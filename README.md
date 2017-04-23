# ts-json-schema-decorator
Generate JSON-Schemas out of typescript classes thanks to decorators

## Limitations

Properties need to have at least one decorator for their type to be accessible by reflection => why not @Require(false)?