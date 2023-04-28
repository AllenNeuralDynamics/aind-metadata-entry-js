export async function fetchSchemasfromS3 (props) {
    /*
    Method to retrieve list of schema links from aws s3 bucket
    */
    const response = await fetch(process.env.REACT_APP_S3__URL)
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
