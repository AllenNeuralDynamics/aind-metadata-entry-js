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
        past_experiences: {
          title: 'Past Experiences',
          type: 'array',
          items: {
            $ref: '#/definitions/PastExperience'
          }
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

test('Checks preProcessSchema modifies const schema', () => {
  const processedSchema1 = preProcessSchema(testSchema1)
  expect(processedSchema1.properties.describedBy.default).toBe(testSchema1.properties.describedBy.const)
  expect(processedSchema1.properties.describedBy.readOnly).toBe(true)
})

test('Checks preProcessSchema modifies dictionary additional properties', () => {
  const processedSchema2 = preProcessSchema(testSchema2)
  expect(processedSchema2.properties.parameters.additionalProperties).toStrictEqual({ type: 'string' })
})

test('Checks preProcessSchema adds default title to `anyOf` options if needed', () => {
  const processedSchema3 = preProcessSchema(testSchema3)
  expect(processedSchema3.properties.email.anyOf).toStrictEqual([{ title: 'string', type: 'string' }, { title: 'null', type: 'null' }])
})

test('Checks preProcessSchema removes discriminator.mapping property', () => {
  const processedSchema = preProcessSchema(SAMPLE_SCHEMA_DISCRIMINATOR)
  expect(processedSchema.properties.sub_schema.discriminator.mapping).toBe(undefined)
})

test('Checks preProcessSchema adds discriminator property as required', () => {
  const processedSchema = preProcessSchema(SAMPLE_SCHEMA_DISCRIMINATOR)
  expect(processedSchema.properties.sub_schema.required).toStrictEqual([SAMPLE_SCHEMA_DISCRIMINATOR.properties.sub_schema.discriminator.propertyName])
})

test('Checks preProcessSchema recurses through nested schema as expected', () => {
  const processedSchema3 = preProcessSchema(testSchema3)
  expect(processedSchema3.properties.resume.properties.education.readOnly).toBe(true)
  expect(processedSchema3.properties.resume.properties.education.default).toBe(testSchema3.properties.resume.properties.education.const)
  expect(processedSchema3.definitions.PastExperience.key_points.additionalProperties).toStrictEqual({ type: 'string' })
})

test('Checks preProcessSchema does not modify simple sample schema', () => {
  const processedSchema = preProcessSchema(testSchema4)
  expect(processedSchema).toEqual(testSchema4)
})
