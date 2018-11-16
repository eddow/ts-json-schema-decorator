import {option, createPropertyDecorator, getPropertyDescriptor, jsdTypes} from './utils'

function src(code) {
	//TODO: add sourceMap
	return [eval][0](code);
}

/**
 * 
 * @param model 
 * @param options {}: raw means no wrapper is used
 */
function modelFactory(model, options: any = {}) {
	var rex = /this.([^\s]*) = ([^;]*);/g, string = model.toString(), descr, used, name = model.name;
	
	//console.assert(/^class /.test(string), `${name}: Models are described by TypeScript class`);
	if(/^class /.test(string)) {
		while(descr = rex.exec(string)) {
			//The value is an expression
			//The value - if object or array - has to be re-evaluated for each initialisation
			//Usually, initialisation allow the use of `this` keyword
			Object.defineProperty(getPropertyDescriptor(model.prototype, descr[1]), 'default', {
				get: (init=> () => src('('+init+')'))(descr[2]),
				enumerable: true
			});
		}
	} else {
		//TODO: read defaults from function() syntax
	}
	descr = model.schema.properties;
	for(let i in descr) {
		if(descr[i].$ref) descr[i] = {$ref: descr[i].$ref};	//removes all other properties than $ref
		else if(descr[i].type instanceof Array) {
			descr[i].anyOf = descr[i].type;
			delete descr[i].type;
		}
	}

	descr = Object.assign({}, model.schema.definitions||{});	//the given definitions
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
	function ctor(...args) {
		var rv, i, schema = model.schema.properties;
		rv = new csuper(...args);
		Object.setPrototypeOf(rv, model.prototype);
		for(i in schema)
			if(undefined=== rv[i])
				rv[i] = schema[i].default;
		return rv;
	}
	if(false===options.raw) {
		/*
			The wrapper is used to :
			- Have each property initialized to its default (or undefined)
			- initialize the properties after the parent classes has been called for the initialisation not to override constructor given values
		*/
		var csuper = Object.getPrototypeOf(model.prototype).constructor, wrapper;
		//TODO: https://github.com/substack/vm-browserify or similar
		wrapper = ctor; //src(`(function ${model.name}(){ return ctor.apply(this, arguments); })`);
		Object.assign(wrapper, model);
		wrapper.prototype = model.prototype;
		model = wrapper;
	}
	function defaults(rv = {}) {
		var i, schema = model.schema.properties;
		rv || (rv = {});
		for(i in schema)
			if(undefined=== rv[i])
				rv[i] = schema[i].default;
		return rv;
	}
	model.schema = Object.assign({}, model.schema, {model, defaults});	//These are not serialized but can be useful for schema's users
	
	return Object.assign(model, options);
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
