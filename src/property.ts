import {option, createPropertyDescriptor, getPropertyDescriptor, jsdTypes, makeType} from './utils'
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

export function Property(opts = {}) { return createPropertyDescriptor(opts); }
export function Type(type) { return createPropertyDescriptor({type: makeType(type).type}); }
export function Values(values) { return createPropertyDescriptor({'enum': values}); }

export function AdditionalProperties(additionalProperties: boolean|object) {
	return createPropertyDescriptor({additionalProperties}, 'object');
}
export function PatternProperties(patternProperties: object) {
	return createPropertyDescriptor({patternProperties}, 'object');
}

export function Pattern(pattern) { return createPropertyDescriptor({pattern}, 'string'); }
export function MinLength(minLength = 1) { return createPropertyDescriptor({minLength}, 'string'); }
export function MaxLength(maxLength) { return createPropertyDescriptor({maxLength}, 'string'); }

export function Integer() { return createPropertyDescriptor({type: 'integer'}, 'number'); }
export function Minimum(minimum = 0, exclusiveMinimum = false) { return createPropertyDescriptor({minimum, exclusiveMinimum}, 'number'); }
export function Maximum(maximum, exclusiveMaximum = false) { return createPropertyDescriptor({maximum, exclusiveMaximum}, 'number'); }

export function Items(items, uniqueItems = false) {
	if(items instanceof Array) items
	return createPropertyDescriptor({
		items: items instanceof Array?items.map(makeType):makeType(items),
		uniqueItems
	}, 'array');
}
export function MinItems(minItems) { return createPropertyDescriptor({minItems}, 'array'); }
export function MaxItems(maxItems) { return createPropertyDescriptor({maxItems}, 'array'); }