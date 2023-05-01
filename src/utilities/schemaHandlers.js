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
      Uses helper function to make const fields non-fillable
    */
   let copiedSchema = JSON.parse(JSON.stringify(schema))
    preProcessingHelper(copiedSchema)
    return copiedSchema;
  }
  