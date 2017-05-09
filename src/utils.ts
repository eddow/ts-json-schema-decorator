import 'reflect-metadata'
import extend = require('extend')

export const factories = {
	makeType: []
};

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
	if('function'!== typeof model)
		path.unshift('constructor');
	while(1< path.length) {
		let prop = path.shift();
		model = model[prop] || (model[prop] = {});
	}
	let prop = path[0];
	if(model.hasOwnProperty(prop)) {
		if(Object=== value.constructor) model[prop] = extend({}, model[prop], value);
		return model[prop];
	}
	return model[prop] = value;
}

export function getPropertyDescriptor(model, key) {
	var props = option({}, model, 'schema.properties', key);
	if(!props.type && !props.$ref) {
		let type = Reflect.getMetadata('design:type', model, key);
		if(type) extend(props, makeType(type, model, key));
	}
	return props;
}

export function createPropertyDecorator(descriptor, restriction?) {
	//TODO3: restriction is a type name ('string', 'number', ...) that must restrict the appliable types
	return (model, key) => {
		var propDescr = getPropertyDescriptor(model, key);
		extend(propDescr, 'function'=== typeof descriptor?descriptor(model, key):descriptor);
	};
}

export function makeType(type, model, property) {
	for(let factory of factories.makeType) {
		let trial = factory(type, model, property);
		if(trial) return trial;
	}
	if(Object=== type.constructor) return type;
	if('function'=== typeof type) {
		if(type.schema) type = extend({type: 'object'}, type.schema);
		else {
			//console.assert(jsdTypes[type.name], `Type must have a schema or be a basic js-data type : ${type}`)
			type = {type: jsdTypes[type.name] || 'object'};
		}
	} else if('string'=== typeof type) type = {type};
	return type;
}