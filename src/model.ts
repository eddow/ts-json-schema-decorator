import {option, createPropertyDecorator, getPropertyDescriptor, jsdTypes} from './utils'
import extend = require('extend')

function modelFactory(model, options: any = {}) {
	var rex = /this.([^\s]*) = ([^;]*);/g, string = model.toString(), descr, used, name = model.name;
	
	console.assert(/^class /.test(string), `${name}: Models are described by TypeScript class`);
	while(descr = rex.exec(string)) {
		//JSON.parse should be an on-construct evaluation with 'this' initialised
		used = getPropertyDescriptor(model.prototype, descr[1]);
		try {
			used.default = JSON.parse(descr[2]);
		} catch(x) {
			used.default = undefined;
		}
		//console.assert(!model.schema.properties[descr[1]], `${name}.${descr[1]}: Value initializers override record initialization data and must be avoided. Use @Default() instead.`)
	}
	descr = model.schema.properties;
	model.defaults = {};
	for(let i in descr) {
		if(descr[i].$ref) descr[i] = {$ref: descr[i].$ref};	//removes all other properties than $ref
		else if(descr[i].type instanceof Array) {
			descr[i].anyOf = descr[i].type;
			delete descr[i].type;
		}
	}

	descr = extend({}, model.schema.definitions || {});	//the given definitions
	used = model.defined;	//the used definitions
	// Remove unused definitions and check the presence of used ones
	if(used) {
		for(let i in used)
			if(!descr[i]) console.error(`Unknown definition '${i} used in ${model.name} for ${used[i].join(', ')}.`);
		let keys = Object.keys(descr);
		for(let i of keys)
			if(!used[i])
				delete descr[i];
		model.schema.definitions = descr;
	} else delete model.schema.definitions;
	model.schema.type = 'object';
	model.schema.tsClass = model;	//This is not serialized but can be useful for schema's users
	return extend(model, options);
}

export function Definitions(...defs) {
	return (model)=> {
		for(let def of defs) {
			if('function'=== typeof def && def.schema)
				def = def.schema.properties;
			option(def, model.prototype, 'schema.definitions');
		}
	};
}

export function Model(options = {}) {
	if (typeof options === 'function') {
		return modelFactory(options);
	}
	return function (model) {
		return modelFactory(model, options);
	};
}
