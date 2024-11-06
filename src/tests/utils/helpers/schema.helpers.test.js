import {
  fetchSchemaPathsFromS3Async,
  parseAndFilterSchemas,
  fetchAndFilterSchemasAsync,
  findSchemaFromFormData,
  fetchSchemaContentAsync,
  processSchemaContent
} from '../../../utils/helpers/schema.helpers'
import SIMPLE_SCHEMA_LINKS from '../../resources/schema-links/simple.json'
import INVALID_SCHEMA_LINKS from '../../resources/schema-links/invalid.json'
import SCHEMA_CONSTS from '../../resources/schemas/consts.json'
import SCHEMA_DEFAULTS from '../../resources/schemas/defaults.json'
import SCHEMA_NESTED from '../../resources/schemas/nested.json'
import SCHEMA_DISCRIMINATOR from '../../resources/schemas/discriminator.json'
import SCHEMA_SIMPLE from '../../resources/schemas/simple.json'
import SCHEMA_DECIMALS from '../../resources/schemas/decimals.json'

// Mock the Config object before the tests
jest.mock('../../../utils/config', () => ({
  __esModule: true, // Indicate that this is an ES module
  default: {
    REACT_APP_FILTER_VERSIONS: {
      test_type_1: ['1.0.0', '1.0.1']
    },
    AJV_OPTIONS: {
      ajvOptionsOverrides: {
        discriminator: true
      }
    }
  }
}))

const EXPECTED_PARSED_SCHEMAS = [
  { type: 'test_type_1', version: '1.0.0', path: 'schemas/test_type_1/1.0.0/test_type_1_schema.json' },
  { type: 'test_type_1', version: '1.0.1', path: 'schemas/test_type_1/1.0.1/test_type_1_schema.json' },
  { type: 'test_type_2', version: '1.0', path: 'schemas/test_type_2/1.0/test_type_1_schema.json' }
]

const VALID_FORM_DATAS = [
  {
    describedBy: 'https://raw.githubusercontent.com/Repo/src/schemas/test_type_1.py',
    schema_version: '1.0.0'
  },
  {
    describedBy: 'test_type_1.py',
    schema_version: '1.0.0'
  }
]
const INVALID_FORM_DATAS = [
  {
    describedBy: 'https://raw.githubusercontent.com/Repo/src/schemas/invalid_schema_type.py',
    schema_version: '1.0.0'
  },
  {
    describedBy: 'https://raw.githubusercontent.com/Repo/src/schemas/test_type_1.py',
    schema_version: '10.0.0'
  },
  {
    describedBy: 'https://raw.githubusercontent.com/Repo/src/schemas/test_type_1.py'
  },
  {
    schema_version: '1.0.0'
  },
  {}
]

describe('fetchSchemaPathsFromS3Async', () => {
  beforeEach(() => {
    jest.resetModules()
    global.fetch = jest.fn(() =>
      Promise.resolve({
        text: () => Promise.resolve(
          '<ListBucketResult><Contents><Key>schemas/test_type_1/1.0/test_type_1_schema.json</Key></Contents></ListBucketResult>'
        )
      })
    )
  })

  it('fetches list of schema paths from given url', async () => {
    const s3Url = 'https://example.s3.us-west-2.amazonaws.com'
    const schemaPaths = await fetchSchemaPathsFromS3Async(s3Url)
    expect(fetch).toHaveBeenCalledWith(s3Url)
    expect(schemaPaths).toBeDefined()
    expect(schemaPaths).toBeInstanceOf(Array)
    expect(schemaPaths).toHaveLength(1)
    expect(schemaPaths[0]).toBe('schemas/test_type_1/1.0/test_type_1_schema.json')
  })
})

describe('parseAndFilterSchemas', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('returns an array of valid schemas', () => {
    const resultSchemas = parseAndFilterSchemas(SIMPLE_SCHEMA_LINKS)
    expect(resultSchemas).toBeInstanceOf(Array)
    expect(resultSchemas).toHaveLength(1)
  })

  it('filters out invalid, test, and non-schema schemas', () => {
    const resultSchemas = parseAndFilterSchemas(INVALID_SCHEMA_LINKS)
    expect(resultSchemas).toHaveLength(0)
  })

  it('should filter out schemas based on version in Config.REACT_APP_FILTER_VERSIONS', () => {
    process.env.REACT_APP_FILTER_VERSIONS = JSON.stringify(['test_type_1'])
    const result = parseAndFilterSchemas(SIMPLE_SCHEMA_LINKS)
    expect(result).toEqual([
      { type: 'test_type_2', version: '1.0', path: 'schemas/test_type_2/1.0/test_type_1_schema.json' }
    ])
  })
})

describe('fetchAndFilterSchemasAsync', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = {
      REACT_APP_S3_URL: 'https://example.s3.us-west-2.amazonaws.com'
    }
    global.fetch = jest.fn(() =>
      Promise.resolve({
        text: () => Promise.resolve(
          '<ListBucketResult><Contents><Key>schemas/test_type_1/1.0/test_type_1_schema.json</Key></Contents></ListBucketResult>'
        )
      })
    )
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('uses REACT_APP_S3_URL in env var to fetch schema paths from s3', async () => {
    await fetchAndFilterSchemasAsync()
    expect(fetch).toHaveBeenCalledWith('https://example.s3.us-west-2.amazonaws.com')
  })

  it('calls the callback with the filtered schemas', async () => {
    const callback = jest.fn()
    await fetchAndFilterSchemasAsync(callback)
    expect(callback).toHaveBeenCalledWith([{ type: 'test_type_1', version: '1.0', path: 'schemas/test_type_1/1.0/test_type_1_schema.json' }])
  })
})

describe('findSchemaFromFormData', () => {
  it('returns the matching schema', () => {
    for (const formData of VALID_FORM_DATAS) {
      const resultSchema = findSchemaFromFormData(formData, EXPECTED_PARSED_SCHEMAS)
      expect(resultSchema).toStrictEqual(EXPECTED_PARSED_SCHEMAS[0])
    }
  })

  it('returns undefined if no matching schema is found', () => {
    for (const formData of INVALID_FORM_DATAS) {
      const resultSchema = findSchemaFromFormData(formData, EXPECTED_PARSED_SCHEMAS)
      expect(resultSchema).toBeUndefined()
    }
  })
})

describe('fetchSchemaContentAsync', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = {
      REACT_APP_S3_URL: 'https://example.s3.us-west-2.amazonaws.com'
    }
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(SCHEMA_SIMPLE)
      })
    )
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('fetches schema content from the given URL', async () => {
    const schemaPath = 'schemas/test_type_1/1.0.0/test_type_1_schema.json'
    const schemaContent = await fetchSchemaContentAsync(schemaPath)
    expect(fetch).toHaveBeenCalledWith('https://example.s3.us-west-2.amazonaws.com/schemas/test_type_1/1.0.0/test_type_1_schema.json')
    expect(schemaContent).toBeDefined()
    expect(schemaContent).toHaveProperty('properties')
    expect(schemaContent.properties.email.title).toBe('Email Address')
  })
})

describe('processSchemaContent', () => {
  it('modifies const schema to add missing default or type', () => {
    const expectedTypes = [
      { key: 'describedBy', type: 'string' },
      { key: 'schema_version', type: 'string' },
      { key: 'number_const', type: 'number' },
      { key: 'boolean_const', type: 'boolean' },
      { key: 'object_const', type: 'object' },
      { key: 'array_const', type: 'array' },
      { key: 'null_const', type: ['null', 'string'] }
    ]
    const processedSchema = processSchemaContent(SCHEMA_CONSTS)
    expect(processedSchema.properties.describedBy.default).toBe(SCHEMA_CONSTS.properties.describedBy.const)
    for (const expectedType of expectedTypes) {
      expect(processedSchema.properties[expectedType.key].type).toStrictEqual(expectedType.type)
    }
  })

  it('modifies dictionary additional properties', () => {
    const processedSchema = processSchemaContent(SCHEMA_DEFAULTS)
    expect(processedSchema.properties.parameters.additionalProperties).toStrictEqual({ type: 'string' })
    expect(processedSchema.properties.default_array.additionalProperties).toBe(undefined)
  })

  it('adds default title to `anyOf` options if needed', () => {
    const processedSchema = processSchemaContent(SCHEMA_NESTED)
    expect(processedSchema.properties.email.anyOf).toStrictEqual([{ title: 'string', type: 'string' }, { title: 'null', type: 'null' }])
  })

  it('modifies discriminator property', () => {
    const processedSchema = processSchemaContent(SCHEMA_DISCRIMINATOR)
    const expectedDiscriminator = SCHEMA_DISCRIMINATOR.properties.sub_schema.discriminator.propertyName
    expect(processedSchema.properties.sub_schema.discriminator.mapping).toBe(undefined)
    expect(processedSchema.properties.sub_schema.required).toStrictEqual([expectedDiscriminator])
    expect(processedSchema.properties.sub_schema_required.required).toContain(expectedDiscriminator)
    expect(processedSchema.properties.sub_schema.oneOf).toStrictEqual(SCHEMA_DISCRIMINATOR.properties.sub_schema.oneOf)
  })

  it('recurses through nested schema as expected', () => {
    const processedSchema = processSchemaContent(SCHEMA_NESTED)
    expect(processedSchema.properties.resume.properties.education.default).toBe(SCHEMA_NESTED.properties.resume.properties.education.const)
    expect(processedSchema.definitions.PastExperience.key_points.additionalProperties).toStrictEqual({ type: 'string' })
  })

  it('does not modify simple sample schema', () => {
    const processedSchema = processSchemaContent(SCHEMA_SIMPLE)
    expect(processedSchema).toEqual(SCHEMA_SIMPLE)
  })

  it('chaages anyOf string/number and null/string/number to decimal', () => {
    const processedSchema = processSchemaContent(SCHEMA_DECIMALS)
    expect(processedSchema.properties.decimal_prop.anyOf).toStrictEqual([{ title: 'decimal', type: 'string', pattern: '^-?\\d+(\\.\\d{1,})?$' }])
    expect(processedSchema.properties.decimal_prop_optional.anyOf).toStrictEqual([{ title: 'decimal', type: 'string', pattern: '^-?\\d+(\\.\\d{1,})?$' }, { type: 'null', title: 'null' }])
  })
})
