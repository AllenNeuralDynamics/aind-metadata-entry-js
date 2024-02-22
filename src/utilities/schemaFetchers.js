import { validate, compareVersions } from 'compare-versions'

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
 * @typedef {Object} Schema
 * @property {string} type - The schema type.
 * @property {string} version - The semver schema version.
 * @property {string} path - The unique path of the schema.
 *
 * Parses and filters the given schemas paths based on a filter list stored in environment.
 *
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
      schemaList.push({ type: parts[1], version: parts[2], path: link })
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
