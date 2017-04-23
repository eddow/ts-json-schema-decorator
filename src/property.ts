import {option, createPropertyDecorator, getPropertyDescriptor, jsdTypes, makeType} from './utils'
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

export function Define(definition) {
	return createPropertyDecorator({$ref: `#/definitions/${definition}`});
}
export function Type(type) { return createPropertyDecorator({type: makeType(type).type}); }
export function Values(values) { return createPropertyDecorator({'enum': values}); }

export function AdditionalProperties(additionalProperties: boolean|object) {
	return createPropertyDecorator({additionalProperties}, 'object');
}
export function PatternProperties(patternProperties: object) {
	return createPropertyDecorator({patternProperties}, 'object');
}

export function Pattern(pattern) { return createPropertyDecorator({pattern}, 'string'); }
export function MinLength(minLength = 1) { return createPropertyDecorator({minLength}, 'string'); }
export function MaxLength(maxLength) { return createPropertyDecorator({maxLength}, 'string'); }

export function Integer() { return createPropertyDecorator({type: 'integer'}, 'number'); }
export function Minimum(minimum = 0, exclusiveMinimum = false) { return createPropertyDecorator({minimum, exclusiveMinimum}, 'number'); }
export function Maximum(maximum, exclusiveMaximum = false) { return createPropertyDecorator({maximum, exclusiveMaximum}, 'number'); }

export function Items(items, uniqueItems = false) {
	if(items instanceof Array) items
	return createPropertyDecorator({
		items: items instanceof Array?items.map(makeType):makeType(items),
		uniqueItems
	}, 'array');
}
export function MinItems(minItems) { return createPropertyDecorator({minItems}, 'array'); }
export function MaxItems(maxItems) { return createPropertyDecorator({maxItems}, 'array'); }