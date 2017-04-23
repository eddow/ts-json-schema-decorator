import 'reflect-metadata'
import extend = require('extend')

export const jsdTypes = {
	Array: 'array',
	String: 'string',
	Number: 'number',
	Boolean: 'boolean',
	Object: 'object'
};

export function option(value, model, ...path) {
	for(let i = 0; i< path.length; ++i) {
		path.splice(i, 1, ...path[i].split('.'))
	}
	path.unshift('constructor');
	while(1< path.length) {
		let prop = path.shift();
		model = model[prop] || (model[prop] = {});
	}
	let prop = path[0];
	if(model.hasOwnProperty(prop))
		return Object=== value.constructor? extend(model[prop], value) : model[prop];
	return model[prop] = value;
}

export function getPropertyDescriptor(model, key) {
	var props = option({}, model, 'schema.properties', key);
	if(!props.type) {
		let type = Reflect.getMetadata('design:type', model, key);
		if(type) extend(props, makeType(type));
	}
	return props;
}
export function createPropertyDescriptor(descriptor, restriction?) {
	//TODO3: restriction is a type name ('string', 'number', ...) that should restrict the appliable types
	return (model, key) => {
		var propDescr = getPropertyDescriptor(model, key);
		if('function'=== typeof descriptor)
			descriptor(propDescr);
		else extend(propDescr, descriptor);
	};
}

export function makeType(type) {
	if(Object=== type.constructor) return type;
	if('function'=== typeof type) {
		if(type.schema) type = extend({type: 'object'}, type.schema);
		else {
			//console.assert(jsdTypes[type.name], `Type should have a schema or be a basic js-data type : ${type}`)
			type = {type: jsdTypes[type.name] || 'object'};
		}
	} else if('string'=== typeof type) type = {type};
	return type;
}