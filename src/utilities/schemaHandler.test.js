import { preProcessSchema } from './schemaHandlers'
import SAMPLE_SCHEMA_DISCRIMINATOR from '../testing/sample-schema-discriminator.json'

const testSchema1 = ({
  type: 'object',
  properties: {
    describedBy: {
      type: 'string',
      const: 'https://github.com/AllenNeuralDynamics/data_schema/blob/main/schemas/subject.json',
      description: 'The URL reference to the schema.',
      title: 'Described by'
    },
    schema_version: {
      const: '1.0.0',
      default: '1.0.0',
      description: 'The version of the schema.',
      title: 'Schema Version'
    },
    number_const: {
      title: 'Number with missing type',
      const: 1,
      default: 1
    },
    boolean_const: {
      title: 'Boolean with missing type',
      const: true,
      default: true
    },
    object_const: {
      title: 'Object with missing type',
      const: { key: 'value' },
      default: { key: 'value' }
    },
    array_const: {
      title: 'Array with missing type',
      const: [1, 2, 3],
      default: [1, 2, 3]
    },
    null_const: {
      title: 'Null with missing type',
      const: null,
      default: null
    }
  }
})

const testSchema2 = ({
  title: 'sample schema',
  type: 'object',
  properties: {
    name: {
      title: 'Full Name',
      type: 'string'
    },
    email: {
      title: 'Email Address',
      type: 'string'
    },
    parameters: {
      title: 'parameters',
      type: 'object',
      default: {}
    },
    default_array: {
      title: 'Test Array',
      type: 'array',
      default: [],
      items: {
        type: 'string'
      }
    }
  },
  required: [
    'name'
  ]
})

const testSchema3 = ({
  title: 'sample schema',
  type: 'object',
  properties: {
    name: {
      title: 'Full Name',
      type: 'string'
    },
    email: {
      title: 'Email Address',
      anyOf: [
        {
          type: 'string'
        },
        {
          type: 'null'
        }
      ]
    },
    resume: {
      title: 'Resume',
      type: 'object',
      properties: {
        education: {
          title: 'Education',
          const: 'Farmington University',
          type: 'string'
        },
        weighted_gpa: {
          title: 'Weighted GPA',
          anyOf: [
            {
              type: 'string'
            },
            {
              type: 'number'
            }
          ]
        },
        unweighted_gpa: {
          title: 'Unweighted GPA',
          anyOf: [
            {
              type: 'string'
            },
            {
              type: 'number'
            },
            {
              type: 'null'
            }
          ]
        },
        past_experiences: {
          title: 'Past Experiences',
          anyOf: [
            {
              $ref: '#/definitions/PastExperience'
            },
            {
              type: 'null'
            },
            {
              type: 'string'
            }
          ]
        }
      }
    }
  },
  definitions: {
    PastExperience: {
      title: 'PastExperience',
      description: 'Description of Past Experience',
      type: 'object',
      key_points: {
        title: 'Key Points',
        description: 'Info about job experience (ex: company name, duration, etc)',
        type: 'object',
        default: {}
      }
    }
  },
  required: [
    'name'
  ]
})

const testSchema4 = ({
  title: 'sample schema',
  type: 'object',
  properties: {
    name: {
      title: 'Full Name',
      type: 'string'
    },
    email: {
      title: 'Email Address',
      type: 'string'
    }
  },
  required: [
    'name'
  ]
})

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
  const processedSchema1 = preProcessSchema(testSchema1)
  expect(processedSchema1.properties.describedBy.default).toBe(testSchema1.properties.describedBy.const)
  for (const expectedType of expectedTypes) {
    expect(processedSchema1.properties[expectedType.key].type).toStrictEqual(expectedType.type)
  }
})

test('Checks preProcessSchema modifies dictionary additional properties', () => {
  const processedSchema2 = preProcessSchema(testSchema2)
  expect(processedSchema2.properties.parameters.additionalProperties).toStrictEqual({ type: 'string' })
  expect(processedSchema2.properties.default_array.additionalProperties).toBe(undefined)
})

test('Checks preProcessSchema handles `anyOf` as needed', () => {
  const processedSchema3 = preProcessSchema(testSchema3)
  expect(processedSchema3.properties.email.type).toStrictEqual(['string', 'null'])
  expect(processedSchema3.properties.resume.properties.weighted_gpa.type).toStrictEqual('number')
  expect(processedSchema3.properties.email.type.anyOf).toBeFalsy()
  expect(processedSchema3.properties.resume.properties.past_experiences.anyOf).toStrictEqual([{ $ref: '#/definitions/PastExperience' }, { title: 'null', type: 'null' }, { title: 'string', type: 'string' }])
  expect(processedSchema3.properties.resume.properties.unweighted_gpa.type).toStrictEqual(['number', 'null'])
})

test('Checks preProcessSchema modifies discriminator property', () => {
  const processedSchema = preProcessSchema(SAMPLE_SCHEMA_DISCRIMINATOR)
  const expectedDiscriminator = SAMPLE_SCHEMA_DISCRIMINATOR.properties.sub_schema.discriminator.propertyName
  expect(processedSchema.properties.sub_schema.discriminator.mapping).toBe(undefined)
  expect(processedSchema.properties.sub_schema.required).toStrictEqual([expectedDiscriminator])
  expect(processedSchema.properties.sub_schema_required.required).toContain(expectedDiscriminator)
  expect(processedSchema.properties.sub_schema.oneOf).toStrictEqual(SAMPLE_SCHEMA_DISCRIMINATOR.properties.sub_schema.oneOf)
})

test('Checks preProcessSchema recurses through nested schema as expected', () => {
  const processedSchema3 = preProcessSchema(testSchema3)
  expect(processedSchema3.properties.resume.properties.education.default).toBe(testSchema3.properties.resume.properties.education.const)
  expect(processedSchema3.definitions.PastExperience.key_points.additionalProperties).toStrictEqual({ type: 'string' })
})

test('Checks preProcessSchema does not modify simple sample schema', () => {
  const processedSchema = preProcessSchema(testSchema4)
  expect(processedSchema).toEqual(testSchema4)
})
