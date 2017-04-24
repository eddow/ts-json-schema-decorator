import {option, createPropertyDecorator, getPropertyDescriptor, jsdTypes} from './utils'
import extend = require('extend')

function modelFactory(model, options: any = {}) {
	var rex = /this.([^\s]*) = ([^;]*);/g, string = model.toString(), descr, used;
	
	console.assert(/^class /.test(string), 'Models are described by TypeScript class');
	while(descr = rex.exec(string)) {
		getPropertyDescriptor(model.prototype, descr[1]).default = JSON.parse(descr[2]);
	}
	descr = model.schema.properties;
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
		model.schema.type = 'object';
	} else delete model.schema.definitions;
	//Object.getOwnPropertyNames(model.prototype) //use this for the functions and accessors?
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
