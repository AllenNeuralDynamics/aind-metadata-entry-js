import { parseAndFilterSchemas, findSchemaFromData } from './schemaFetchers'
import SIMPLE_SCHEMA_LINKS from '../tests/resources/schema-links/simple.json'
import INVALID_SCHEMA_LINKS from '../tests/resources/schema-links/invalid.json'

// Mock the Config object before the tests
jest.mock('../config', () => ({
  __esModule: true, // Indicate that this is an ES module
  default: {
    REACT_APP_FILTER_VERSIONS: {
      test_type_1: ['1.0.0', '1.0.1']
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

describe('findSchemaFromFormData', () => {
  it('returns the matching schema', () => {
    for (const formData of VALID_FORM_DATAS) {
      const resultSchema = findSchemaFromData(formData, EXPECTED_PARSED_SCHEMAS)
      expect(resultSchema).toStrictEqual(EXPECTED_PARSED_SCHEMAS[0])
    }
  })

  it('returns undefined if no matching schema is found', () => {
    for (const formData of INVALID_FORM_DATAS) {
      const resultSchema = findSchemaFromData(formData, EXPECTED_PARSED_SCHEMAS)
      expect(resultSchema).toBeUndefined()
    }
  })
})
