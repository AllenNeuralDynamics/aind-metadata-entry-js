import { validate, compareVersions } from 'compare-versions'
import Config from '../config'

/**
 * @typedef {Object} Schema
 * @property {string} type - The schema type.
 * @property {string} version - The semver schema version.
 * @property {string} path - The unique path of the schema.
 */

export async function fetchSchemasfromS3 (props) {
  /*
    Method to retrieve list of schema links from aws s3 bucket
    */

  const response = await fetch(process.env.REACT_APP_S3_URL)
  const responseText = await response.text()
  const parser = new DOMParser()
  const xmlParsed = parser.parseFromString(responseText, 'text/xml')
  const schemaLinks = []
  const elements = xmlParsed.getElementsByTagName('Key')
  for (let i = 0; i < elements.length; i++) {
    schemaLinks[i] = elements[i].innerHTML
  }
  return schemaLinks
}

/**
 * Parses and filters the given schemas paths based on a filter list stored in environment.
 * @param {string[]} schemaLinks - The schemas paths to parse and filter.
 * @returns {Schema[]} The parsed and filtered schemas.
 */
export function parseAndFilterSchemas (schemaLinks) {
  const schemaList = []
  const filter = process.env.REACT_APP_FILTER_SCHEMAS
  const filterArray = filter ? JSON.parse(filter) : []
  for (const link of schemaLinks) {
    const parts = link.split('/')
    if (isValidSchema(link) && !filterArray.includes(parts[1])) {
      const s = { type: parts[1], version: parts[2], path: link }
      // temporary upper bound for schema versions
      const upperBound = Config.SCHEMAS_UPPER_BOUNDS[s.type]
      if (upperBound && compareVersions(s.version, upperBound) > 0) {
        continue
      }
      schemaList.push(s)
    }
  }
  return schemaList
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
function isValidSchema (path) {
  const parts = path.split('/')
  return (
    parts.length === 4 && parts[0] === 'schemas' &&
    validate(parts[2]) && parts[3].endsWith('.json')
  )
}

/**
 * Parses the schema type and version from the given form data and finds the matching schema to use.
 * @param {Object} data - The form data to parse.
 * @param {Schema[]} schemaList - The list of schemas to search.
 * @returns {Schema|undefined} The matching schema or undefined if no matching schema is found.
 */
export function findSchemaFromData (data, schemaList) {
  // The 'describedBy' field should end in {schemaType}.py
  const schemaType = data.describedBy?.split('/').pop().split('.').shift()
  return schemaList.find(schema =>
    schema.type === schemaType && schema.version === data.schema_version)
}
