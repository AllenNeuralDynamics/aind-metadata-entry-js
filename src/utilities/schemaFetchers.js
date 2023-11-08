export async function fetchSchemasfromS3 (props) {
    /*
    Method to retrieve list of schema links from aws s3 bucket
    */

    const response = await fetch(process.env.REACT_APP_S3_URL)
    const responseText = await response.text()
    const parser=new DOMParser();
    const xmlParsed = parser.parseFromString(responseText, 'text/xml');
    var schema_links = []
    const elements = xmlParsed.getElementsByTagName("Key");
    for (var i=0; i < elements.length; i++) {
        schema_links[i] = elements[i].innerHTML
    }
    return schema_links
}

export function filterSchemas(schema_links) {
  /*
  Method to filter schemas in schema list options.
   */
  const filter = process.env.REACT_APP_FILTER_SCHEMAS
  if (!filter) { return schema_links }
  const filterArray = JSON.parse(filter)
  const filteredStrings = schema_links.filter(str => !filterArray.some(substring => str.includes(substring)))
  return filteredStrings;
}

export function findLatestSchemas(schemasList) {
    /*
    Method to find latest version of each schema
    */
    const latestSchemas = {};
    for (const schemaPath of schemasList) {
      const parts = schemaPath.split('/');
      if (parts[0] === 'schemas') {
        const schemaType = parts[1];
        const schemaVersion = parts[2];
        if (!latestSchemas[schemaType] || compareVersions(schemaVersion, latestSchemas[schemaType].version) > 0) {
          latestSchemas[schemaType] = {
            schema_type: schemaType,
            version: schemaVersion,
            path: schemaPath
          };
        }
      }
    }
    return latestSchemas;
  }
  
  function compareVersions(v1, v2) {
    /*
    Helper method for to find latest schemas
    */
    const parts1 = v1.split('.');
    const parts2 = v2.split('.');
    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
      const part1 = parseInt(parts1[i] || '0');
      const part2 = parseInt(parts2[i] || '0');
      if (part1 < part2) {
        return -1;
      } else if (part1 > part2) {
        return 1;
      }
    }
    return 0;
  }

  export function getSchemaVersionsByType(schemasList) {
    const schemaVersionsByType = {};
  
    // Loop through all the schemas
    for (const schema of schemasList) {
      const schemaType = schema.split('/')[1];
      const schemaVersion = schema.split('/')[2];
  
      // If the schema type hasn't been seen before, create a new array for it
      if (!schemaVersionsByType[schemaType]) {
        schemaVersionsByType[schemaType] = [];
      }
  
      // Add the schema version to the array for the current type
      schemaVersionsByType[schemaType].push(schemaVersion);
    }
  
    return schemaVersionsByType;
  }