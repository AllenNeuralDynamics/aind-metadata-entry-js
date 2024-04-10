import { toast } from 'react-toastify'
import { guessType, deepEquals } from '@rjsf/utils'
// import { widgets } from '../custom-ui/CustomWidgets'

export const AJV_OPTIONS = {
  ajvOptionsOverrides: {
    discriminator: true
  }
}

const preProcessHelper = (obj) => {
  /*
  Recursively iterates through schema for rendering purposes
    Specifies type for consts if missing
    Renders dictionaries
    Displays type selection dropdown with better default text
    Enables validation for discriminator keyword
  */
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

      // enable validation for discriminator keyword
      if (AJV_OPTIONS.ajvOptionsOverrides.discriminator && prop.discriminator) {
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
        preProcessHelper(prop)
      }
    }
  })
}

export const preProcessSchema = (schema) => {
  /*
  PreProcessing for schema validation
    Uses helper function to make const fields non-fillable
    Returns processedSchema if successful, otherwise returns raw original schema
  */
  const copiedSchema = JSON.parse(JSON.stringify(schema))
  try {
    preProcessHelper(copiedSchema)
  } catch (error) {
    const msg = `Error processing ${schema?.title} ${schema.properties?.schema_version?.const}`
    console.error(msg, schema)
    console.error(error)
    toast.warn(`${msg}. Rendered raw schema instead.`)
    return schema
  }
  return copiedSchema
}

export const preprocessUiSchema = (schema) => {
  const dynamicUiSchema = {}
  // Loop through properties in the schema
  Object.keys(schema).forEach(key => {
    if (schema[key] !== null) {
      const prop = schema[key]
      console.log(prop)
      const isDecimal = prop.anyOf.some(option => option.type === 'number') && prop.anyOf.some(option => option.type === 'string')
      // Check if anyOf includes string and number types
      console.log(prop, ' IS DECIMAL')
      if (prop.anyOf && isDecimal) {
        dynamicUiSchema[key] = { 'ui:widget': 'decimal' }
      }
      // recursion
      if (typeof (prop) === 'object') {
        preprocessUiSchema(prop)
      }
    }
  })
  return dynamicUiSchema
}
