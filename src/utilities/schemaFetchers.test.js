import { parseAndFilterSchemas, findSchemaFromData } from './schemaFetchers'

const SAMPLE_VALID_SCHEMA_LINKS = [
  'schemas/test_type_1/1.0.0/test_type_1_schema.json',
  'schemas/test_type_1/1.0.1/test_type_1_schema.json',
  'schemas/test_type_2/1.0/test_type_1_schema.json'
]
const EXPECTED_PARSED_SCHEMAS = [
  { type: 'test_type_1', version: '1.0.0', path: 'schemas/test_type_1/1.0.0/test_type_1_schema.json' },
  { type: 'test_type_1', version: '1.0.1', path: 'schemas/test_type_1/1.0.1/test_type_1_schema.json' },
  { type: 'test_type_2', version: '1.0', path: 'schemas/test_type_2/1.0/test_type_1_schema.json' }
]
const SAMPLE_INVALID_SCHEMA_LINKS = [
  'schemas/test/1.0.0/test_schema',
  'schemas/test/1.0.0/test_schema.txt',
  'schemas/test/1.0.0a/test_schema.json',
  'schemas/test/test_schema.json',
  'schemas/1.0.0/test_schema.json',
  'test_schema.json',
  'index.html'
]

const SAMPLE_VALID_FORM_DATAS = [
  {
    describedBy: 'https://raw.githubusercontent.com/Repo/src/schemas/test_type_1.py',
    schema_version: '1.0.0'
  },
  {
    describedBy: 'test_type_1.py',
    schema_version: '1.0.0'
  }
]
const SAMPLE_INVALID_FORM_DATAS = [
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
    const resultSchemas = parseAndFilterSchemas(SAMPLE_VALID_SCHEMA_LINKS)
    expect(resultSchemas).toBeInstanceOf(Array)
    expect(resultSchemas).toHaveLength(SAMPLE_VALID_SCHEMA_LINKS.length)
    expect(resultSchemas).toStrictEqual(EXPECTED_PARSED_SCHEMAS)
  })

  it('filters out invalid, test, and non-schema schemas', () => {
    const resultSchemas = parseAndFilterSchemas(SAMPLE_INVALID_SCHEMA_LINKS)
    expect(resultSchemas).toHaveLength(0)
  })

  it('filters out schemas with types defined in process.env.REACT_APP_FILTER_SCHEMAS', () => {
    process.env.REACT_APP_FILTER_SCHEMAS = JSON.stringify(['test_type_1'])
    const resultSchemas = parseAndFilterSchemas(SAMPLE_VALID_SCHEMA_LINKS)
    expect(resultSchemas).toHaveLength(1)
  })
})

describe('findSchemaFromFormData', () => {
  it('returns the matching schema', () => {
    for (const formData of SAMPLE_VALID_FORM_DATAS) {
      const resultSchema = findSchemaFromData(formData, EXPECTED_PARSED_SCHEMAS)
      expect(resultSchema).toStrictEqual(EXPECTED_PARSED_SCHEMAS[0])
    }
  })

  it('returns undefined if no matching schema is found', () => {
    for (const formData of SAMPLE_INVALID_FORM_DATAS) {
      const resultSchema = findSchemaFromData(formData, EXPECTED_PARSED_SCHEMAS)
      expect(resultSchema).toBeUndefined()
    }
  })
})
