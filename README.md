# ts-json-schema-decorator
Generate JSON-Schemas out of typescript classes thanks to decorators

## Build

```
node fuse
```

## Limitations

Properties need to have at least one decorator for their type to be accessible by reflection => why not @Require(false)?

## Example
```typescript
import util = require('util');
import {
	Model, Definitions,
	Property, Required, Defined, Default,
	Integer,
	MinLength,
	Items
} from '../src'

@Model()
class Address {
	@Property()
	@Default(null)
	street: string

	@Property()
	@Default(null)
	nr: number
}

@Model()
class PersonDefinitions {
	@MinLength()
	@Default(null)
	name: string
}

@Model()
@Definitions(PersonDefinitions)
class Person {
	@Required()
	@Defined('name')
	firstName: string

	@Required()
	@Defined('name')
	lastName: string

	@Required(false)
	age: number

	@Required(true)
	address: Address
	
	@Items([Number, 'boolean', Address, {$ref: 'name'}])
	testArray: object[]
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
							nr: { type: 'number', default: null } } },
        testArray:
         { type: 'array',
           items:
            [ { type: 'number' },
              { type: 'boolean' },
              { type: 'object',
                properties:
                 { street: { type: 'string', default: null },
                   nr: { type: 'number', default: null } } },
              { '$ref': 'name' } ],
           uniqueItems: false } },
     required: [ 'firstName', 'lastName', 'address' ],
     definitions: { name: { type: 'string', minLength: 1, default: null } } } }
*/
```
# Incoming
Next step is hyper-documentation, we have to make sure even the most innocent grand-ma can use the jsDoc-style tooltip documentation of the IDE to understand each parameter she gives in.

## Donations
I contribute for free with drive, passion and time.
If you like what I do, you can promote me to do it more.

These are the only *like* buttons that have a real effect.

- [paypal.me/eeddow](https://www.paypal.me/eeddow)
- ETH: 0xb79b61130bc5726ddab6c1d59c3e0479afe69540
- BTC: 39ybn3KGNUvZrhifaLJcf4cJdzkGMdfAMT
- BCH: 3K81iYWwLZuWXY1qHcBL559FYraUqKMkEp