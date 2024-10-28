import { validate, compareVersions } from 'compare-versions'
import { guessType, deepEquals } from '@rjsf/utils'
import Config from '../config'

/**
 * @typedef {Object} SchemaInfo
 * @property {string} type - The schema type.
 * @property {string} version - The semver schema version.
 * @property {string} path - The unique path of the schema.
 */

/**
 * Retrieves list of schema paths from AWS S3 Bucket.
 * @param {string} s3Url - The URL of the S3 bucket.
 * @returns {string[]} The list of schema paths
 */
export async function fetchSchemaPathsFromS3Async (s3Url) {
  const response = await fetch(s3Url)
  const responseText = await response.text()
  const parser = new DOMParser()
  const xmlParsed = parser.parseFromString(responseText, 'text/xml')
  const elements = xmlParsed.getElementsByTagName('Key')
  const schemaPaths = Array.from(elements).map(element => element.innerHTML)
  return schemaPaths
}

/**
 * Parses schema type, version and link from the given schema paths.
 * Invalid paths are filtered out based on the schema path format.
 * Certain schema types and versions are also filtered out based on environment and Config settings.
 * @param {string[]} schemaPaths - The schemas paths to parse and filter.
 * @returns {SchemaInfo[]} The parsed and filtered schemas.
 */
export function parseAndFilterSchemas (schemaPaths) {
  const parsedSchemas = Array.from(schemaPaths)
    .filter(path => isValidSchemaPath(path))
    .map(link => {
      const parts = link.split('/')
      return { type: parts[1], version: parts[2], path: link }
    })
  const filterTypes = JSON.parse(process.env.REACT_APP_FILTER_SCHEMAS ?? '[]')
  const filterVersions = Config.REACT_APP_FILTER_VERSIONS
  const filteredSchemas = Array.from(parsedSchemas)
    .filter(schema => !filterTypes.includes(schema.type))
    .filter(schema => !filterVersions[schema.type] || !filterVersions[schema.type].includes(schema.version))
  return filteredSchemas
}

/**
 * Retrieves list of schema links from AWS S3 Bucket, and
 * filters and parses schema info from the links.
 * The s3Url and filtered schema types are stored in environment.
 * The specific schema versions to filter are stored in Config.
 *
 * @param {function} callback - The callback function to call with the result list.
 */
export async function fetchAndFilterSchemasAsync (callback) {
  const s3Url = process.env.REACT_APP_S3_URL
  const schemaPaths = await fetchSchemaPathsFromS3Async(s3Url)
  const filteredSchemas = parseAndFilterSchemas(schemaPaths)
  if (callback) {
    callback(filteredSchemas)
  }
}

export function findLatestSchemas (schemasList) {
  /*
    Method to find latest version of each schema
    */
  const latestSchemas = {}
  for (const schema of schemasList) {
    if (!latestSchemas[schema.type] || compareVersions(schema.version, latestSchemas[schema.type].version) > 0) {
      latestSchemas[schema.type] = schema
    }
  }
  return latestSchemas
}

/**
 * Validates the given schema path.
 * Valid paths are in the form of 'schemas/{type}/{version}/{type}_schema.json'
 * where version is a valid semver version
 * @param {string} path - The schema path to validate.
 * @returns {boolean} True if the schema path is valid, false otherwise.
 */
function isValidSchemaPath (path) {
  const parts = path.split('/')
  return (
    parts.length === 4 && parts[0] === 'schemas' &&
    validate(parts[2]) && parts[3].endsWith('.json')
  )
}

/**
 * Parses the schema type and version from the given form data and finds the matching schema to use.
 * @param {Object} data - The form data to parse.
 * @param {SchemaInfo[]} schemaList - The list of schemas to search.
 * @returns {SchemaInfo|undefined} The matching schema or undefined if no matching schema is found.
 */
export function findSchemaFromFormData (data, schemaList) {
  // The 'describedBy' field should end in {schemaType}.py
  const schemaType = data.describedBy?.split('/').pop().split('.').shift()
  return schemaList.find(schema =>
    schema.type === schemaType && schema.version === data.schema_version)
}

/**
 * Given a schema path, fetches the schema content from the S3 bucket.
 * @param {string} schemaPath - The path of the schema to fetch.
 * @returns {object} The schema content as a JSON object.
 */
export async function fetchSchemaContentAsync (schemaPath) {
  const response = await fetch(process.env.REACT_APP_S3_URL + '/' + schemaPath)
  return await response.json()
}

/**
 * Recursively iterates through schema for rendering purposes.
 *  Specifies type for consts if missing
 *  Renders dictionaries
 *  Add default titles and validators for dropdowns
 *  Enables validation for discriminator keyword
 *
 * @param {any} obj - schema to preprocess
 */
const processSchemaContentHelper = (obj) => {
  Object.keys(obj).forEach(key => {
    if (obj[key] !== null) {
      const prop = obj[key]

      // Need to explicitly specify missing type for consts (bug in pydantic, may be fixed in next release)
      // If default is undefined or not matching const value, set to const
      // Note: We use a custom text widget to autofill the const value and set the field as readonly.
      if (prop.const !== undefined) {
        if (prop.type === undefined) {
          const constType = guessType(prop.const)
          // use nullable string type for null consts to enable allOf defaults
          prop.type = constType === 'null' ? ['null', 'string'] : constType
        }
        if (!deepEquals(prop.default, prop.const)) { prop.default = prop.const }
      }
      // if default is {}, expected value is a dictionary of strings
      if (JSON.stringify(prop.default) === '{}') {
        prop.additionalProperties = { type: 'string' }
      }
      // add default titles and validators for dropdowns
      if (prop.anyOf) {
        // decimals converted to string type with custom regex, title is "decimal"
        const options = Object.values(prop.anyOf).map(option => option.type).sort().join()
        if (options === 'number,string') {
          prop.anyOf = [{ title: 'decimal', type: 'string', pattern: '^-?\\d+(\\.\\d{1,})?$' }]
        } else if (options === 'null,number,string') {
          prop.anyOf = [{ title: 'decimal', type: 'string', pattern: '^-?\\d+(\\.\\d{1,})?$' }, { type: 'null', title: 'null' }]
        } else {
          // when default title is <parentProp.title> option 1, <prop.title> option 2, ...
          // display the type name instead
          Object.values(prop.anyOf).forEach(option => {
            if (!option.$ref && option.type && !option.title) {
              option.title = option.type
            }
          })
        }
      }
      // enable validation for discriminator keyword
      if (Config.AJV_OPTIONS.ajvOptionsOverrides.discriminator && prop.discriminator) {
        // discriminator.mapping is not supported and discriminator property must be `required`
        // docs: https://ajv.js.org/json-schema.html#discriminator
        delete prop.discriminator.mapping
        if (!prop.required) {
          prop.required = [prop.discriminator.propertyName]
        } else if (!prop.required.includes(prop.discriminator.propertyName)) {
          prop.required.push(prop.discriminator.propertyName)
        }
      }

      // recursion
      if (typeof (prop) === 'object') {
        processSchemaContentHelper(prop)
      }
    }
  })
}

/**
 * Processes schema for rendering purposes (e.g. add titles to dropdowns,
 * adds missing type, enables discriminator)
 * @param {object} schema - schema to preprocess
 * @returns {object} The processed schema
 */
export const processSchemaContent = (schema) => {
  const copiedSchema = JSON.parse(JSON.stringify(schema))
  processSchemaContentHelper(copiedSchema)
  return copiedSchema
}
