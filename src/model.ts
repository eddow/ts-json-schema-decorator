import {option, createPropertyDescriptor, getPropertyDescriptor, jsdTypes} from './utils'
import extend = require('extend')

function modelFactory(Model, options: any = {}) {

	var rex = /this.([^\s]*) = ([^;]*);/g, string = Model.toString(), descr;
	
	console.assert(/^class /.test(string), 'Model are described by TypeScript class');
	while(descr = rex.exec(string)) {
		getPropertyDescriptor(Model.prototype, descr[1]).default = JSON.parse(descr[2]);
	}
	descr = Model.schema.properties;
	for(var i in descr) {
		if(descr[i].type instanceof Array) {
			descr[i].anyOf = descr[i].type;
			delete descr[i].type;
		}
	}
	//Object.getOwnPropertyNames(Model.prototype) //use this for the functions and accessors?
	return Model;
}


export function Model(options = {}) {
	if (typeof options === 'function') {
		return modelFactory(options);
	}
	return function (model) {
		return modelFactory(model, options);
	};
}
