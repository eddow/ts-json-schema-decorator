import {option, createPropertyDecorator, getPropertyDescriptor, jsdTypes, makeType} from './utils.ts'
import extend = require('extend')

export function Required(required = true) {
	return (model, key) => {
		getPropertyDescriptor(model, key);	//touch
		if(required) option([], model, 'schema.required').push(key);
	};
}

export function Dependency(dependency) {
	return (model, key) => {
		getPropertyDescriptor(model, key);	//touch
		option(dependency, model, 'schema.dependencies', key);
	};
}

//Generic free-style decorator
export function Property(opts = {}) { return createPropertyDecorator(opts); }

export function Defined(definition) {
	return (model, key) => {
		option({$ref: `#/definitions/${definition}`}, model, 'schema.properties', key);
		option([], model, 'defined', definition).push(key);
	};
}
export function Type(type) { return createPropertyDecorator((model, key)=> makeType(type, model, key)); }
export function Default(value) { return createPropertyDecorator({'default': value}); }
export function Enum(values) { return createPropertyDecorator({'enum': values}); }
export function Format(format) { return createPropertyDecorator({format}); }

export function AdditionalProperties(additionalProperties: boolean|object) {
	return createPropertyDecorator({additionalProperties}, 'object');
}
export function PatternProperties(patternProperties: object) {
	return createPropertyDecorator({patternProperties}, 'object');
}

export function Pattern(pattern) { return createPropertyDecorator({pattern}, 'string'); }
export function MinLength(minLength = 1) { return createPropertyDecorator({minLength}, 'string'); }
export function MaxLength(maxLength) { return createPropertyDecorator({maxLength}, 'string'); }

export const Integer = createPropertyDecorator({type: 'integer'}, 'number');
export function Minimum(minimum = 0, exclusiveMinimum = false) { return createPropertyDecorator({minimum, exclusiveMinimum}, 'number'); }
export function Maximum(maximum, exclusiveMaximum = false) { return createPropertyDecorator({maximum, exclusiveMaximum}, 'number'); }

/**
 * Explicit the possible type(s) of the array items
 * @param items 
 * @param uniqueItems 
 * @example @Items([Number, 'boolean', Address, {$ref: 'name'}])
 * @example @Items(String)
 */
export function Items(items, uniqueItems = false) {
	if(items instanceof Array) items
	return createPropertyDecorator((model, key)=> ({
		items: items instanceof Array?
			items.map(item=> makeType(item, model, key)):
			makeType(items, model, key),
		uniqueItems
	}), 'array');
}
export function MinItems(minItems) { return createPropertyDecorator({minItems}, 'array'); }
export function MaxItems(maxItems) { return createPropertyDecorator({maxItems}, 'array'); }