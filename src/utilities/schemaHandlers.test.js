import { preProcessSchema } from './schemaHandlers'
import SCHEMA_CONSTS from '../tests/resources/schemas/consts.json'
import SCHEMA_DEFAULTS from '../tests/resources/schemas/defaults.json'
import SCHEMA_NESTED from '../tests/resources/schemas/nested.json'
import SCHEMA_DISCRIMINATOR from '../tests/resources/schemas/discriminator.json'
import SCHEMA_SIMPLE from '../tests/resources/schemas/simple.json'
import SCHEMA_DECIMALS from '../tests/resources/schemas/decimals.json'

test('Checks preProcessSchema modifies const schema to add missing default or type', () => {
  const expectedTypes = [
    { key: 'describedBy', type: 'string' },
    { key: 'schema_version', type: 'string' },
    { key: 'number_const', type: 'number' },
    { key: 'boolean_const', type: 'boolean' },
    { key: 'object_const', type: 'object' },
    { key: 'array_const', type: 'array' },
    { key: 'null_const', type: ['null', 'string'] }
  ]
  const processedSchema = preProcessSchema(SCHEMA_CONSTS)
  expect(processedSchema.properties.describedBy.default).toBe(SCHEMA_CONSTS.properties.describedBy.const)
  for (const expectedType of expectedTypes) {
    expect(processedSchema.properties[expectedType.key].type).toStrictEqual(expectedType.type)
  }
})

test('Checks preProcessSchema modifies dictionary additional properties', () => {
  const processedSchema = preProcessSchema(SCHEMA_DEFAULTS)
  expect(processedSchema.properties.parameters.additionalProperties).toStrictEqual({ type: 'string' })
  expect(processedSchema.properties.default_array.additionalProperties).toBe(undefined)
})

test('Checks preProcessSchema adds default title to `anyOf` options if needed', () => {
  const processedSchema = preProcessSchema(SCHEMA_NESTED)
  expect(processedSchema.properties.email.anyOf).toStrictEqual([{ title: 'string', type: 'string' }, { title: 'null', type: 'null' }])
})

test('Checks preProcessSchema modifies discriminator property', () => {
  const processedSchema = preProcessSchema(SCHEMA_DISCRIMINATOR)
  const expectedDiscriminator = SCHEMA_DISCRIMINATOR.properties.sub_schema.discriminator.propertyName
  expect(processedSchema.properties.sub_schema.discriminator.mapping).toBe(undefined)
  expect(processedSchema.properties.sub_schema.required).toStrictEqual([expectedDiscriminator])
  expect(processedSchema.properties.sub_schema_required.required).toContain(expectedDiscriminator)
  expect(processedSchema.properties.sub_schema.oneOf).toStrictEqual(SCHEMA_DISCRIMINATOR.properties.sub_schema.oneOf)
})

test('Checks preProcessSchema recurses through nested schema as expected', () => {
  const processedSchema = preProcessSchema(SCHEMA_NESTED)
  expect(processedSchema.properties.resume.properties.education.default).toBe(SCHEMA_NESTED.properties.resume.properties.education.const)
  expect(processedSchema.definitions.PastExperience.key_points.additionalProperties).toStrictEqual({ type: 'string' })
})

test('Checks preProcessSchema does not modify simple sample schema', () => {
  const processedSchema = preProcessSchema(SCHEMA_SIMPLE)
  expect(processedSchema).toEqual(SCHEMA_SIMPLE)
})

test('Checks if anyOf string/number and null/string/number are changed to decimal', () => {
  const processedSchema = preProcessSchema(SCHEMA_DECIMALS)
  expect(processedSchema.properties.decimal_prop.anyOf).toStrictEqual([{ title: 'decimal', type: 'string', pattern: '^-?\\d+(\\.\\d{1,})?$' }])
  expect(processedSchema.properties.decimal_prop_optional.anyOf).toStrictEqual([{ title: 'decimal', type: 'string', pattern: '^-?\\d+(\\.\\d{1,})?$' }, { type: 'null', title: 'null' }])
})
