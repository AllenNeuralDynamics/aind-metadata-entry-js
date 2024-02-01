const preProcessHelper = (obj) => {
  /* 
  Recursively iterates through schema for rendering purposes
    Makes const fields non-fillable
    Renders dictionaries
    Displays type selection dropdown with better default text
  */
  Object.keys(obj).forEach(key => {
    if (obj[key] !== null) {
      const prop = obj[key];

      // grays out const fields (readOnly) and autofills the field with the const value (default)
      if (prop.const !== undefined) {
        prop.readOnly = true;
        prop.default = prop.const;
      }

      // if default is {}, expected value is a dictionary of strings 
      if (prop.default && typeof (prop.default) === 'object' && Object.keys(prop.default).length === 0) {
        prop.additionalProperties = { "type": "string" }
      }

      // add default titles to dropdown of allowed types/ subschemas
      if (prop.anyOf) {
        Object.values(prop.anyOf).forEach(option => {
          // if the allowed type/ subschema is not a ref nor has a title,
          // it defaults to <parentProp.title> option 1, <prop.title> option 2, ...
          // we can convert to display the type name instead
          if (!option.$ref && option.type && !option.title) {
            option.title = option.type
          }
        })
      }

      // recursion
      if (typeof (prop) === 'object') {
        preProcessHelper(prop);
      }
    }
  });
};

export const preProcessSchema = (schema) => {
  /*
  PreProcessing for schema validation
    Uses helper function to make const fields non-fillable
    Returns processedSchema if successful, otherwise returns raw original schema
  */
  let copiedSchema = JSON.parse(JSON.stringify(schema))
  try {
    preProcessHelper(copiedSchema)
  } catch (error) {
    const msg = `Error processing ${schema?.title} ${schema.properties?.schema_version?.const}`
    console.error(msg, schema)
    console.error(error)
    alert(`${msg}. Rendering raw schema instead.`)
    return schema
  }
  return copiedSchema;
}
