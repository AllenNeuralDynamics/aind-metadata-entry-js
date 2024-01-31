const preProcessHelper = (obj) => {
    /* 
    Recursively iterates through schema for rendering purposes
      Makes const fields non-fillable
      Renders dictionaries
      Hack around a bug in rjsf library.
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
          if (prop.default && typeof(prop.default) === 'object' && Object.keys(prop.default).length === 0) {
            prop.additionalProperties={"type": "string"}
          }
    
          // recursion
          if (typeof(prop) === 'object') {
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
