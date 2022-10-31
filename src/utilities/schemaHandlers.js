const draft2020 = "https://json-schema.org/draft/2020-12/schema";

export const checkDraft2020 = (schema) => {
    return (
      schema.$schema !== undefined && 
      (
        schema.$schema === draft2020 || 
        schema.$schema === draft2020.concat("#")
        )
      )
  };

  const preProcessingHelper = (obj) => {
    /* 
    Iterates through schema to make const fields non-fillable
      Grays out const fields (prop.readOnly) and autofills the field with the const value (prop.default)
      Hack around a bug in rjsf library.
    */ 
    Object.keys(obj).forEach(key => {

      const prop = obj[key]
      if (prop.const !== undefined) {
        prop.readOnly = true;
        prop.default = prop.const
      }

      if (typeof(prop) === 'object') {
        preProcessingHelper(prop)
      }
    })
  }

  export const preProcessing = (schema) => {
    /*
    PreProcessing for schema validation
      Replaces $schema field with id to address ajv validation and jsonschema 2020-12 compatibility
      Uses helper function to make const fields non-fillable
    */
   let copiedSchema = JSON.parse(JSON.stringify(schema))
    if (checkDraft2020(schema)) {
      delete(copiedSchema.$schema)
    } else if("$schema" in copiedSchema) {
      copiedSchema.id = copiedSchema.$schema;
    }

    preProcessingHelper(copiedSchema)
    
    return copiedSchema;
  }
  