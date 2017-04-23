import * as jsd from '../src'
import util = require('util');

@jsd.Model
class Address {
	@jsd.Property()
	street: string = null

	@jsd.Property()
	nr: number = null
}

@jsd.Model
class PersonDefinitions {
	@jsd.MinLength()
	name: string = null
}

@jsd.Model
@jsd.Definitions(PersonDefinitions)
class Person {
	@jsd.Required()
	@jsd.Define('name')
	firstName: string = null

	@jsd.Required()
	@jsd.Define('name')
	lastName: string

	@jsd.Required(false)
	age: number

	@jsd.Required(true)
	address: Address
	
}

console.log(util.inspect(Person, {depth: null}));

/*
{ [Function: Person]
  schema:
   { properties:
      { firstName: { '$ref': '#/definitions/name' },
        lastName: { '$ref': '#/definitions/name' },
        age: { type: 'number' },
        address:
         { type: 'object',
           properties:
            { street: { type: 'string', default: null },
              nr: { type: 'number', default: null } } } },
     required: [ 'firstName', 'lastName', 'address' ],
     definitions: { name: { type: 'string', minLength: 1, default: null } } } }
*/
