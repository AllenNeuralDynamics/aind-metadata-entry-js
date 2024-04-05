import { toast } from 'react-toastify'
import { guessType, deepEquals } from '@rjsf/utils'

export const AJV_OPTIONS = {
  ajvOptionsOverrides: {
    discriminator: true
  }
}

const processAnyOf = (prop, allowedTypes) => {
  /*
  Handles AnyOfs in schema.
  Removes unneccessary dropdowns for basic field types.
  Otherwise, adds default titles to dropdown of allowed types/subschemas
  */
  const isAllowedType = prop.anyOf.some(option => allowedTypes.includes(option.type))
  const isOptional = prop.anyOf.some(option => option.type === 'null')
  const isDecimal = prop.anyOf.some(option => option.type === 'number' || option.type === 'string')

  // Replace dropdown with input box for required decimals
  if (isDecimal && !isOptional) {
    prop.type = 'string'
    delete prop.anyOf
  // Replace dropdown with nullable input box for optional basic fields
  } else if ((isDecimal || isAllowedType) && isOptional) {
    prop.type = allowedTypes.filter(type => prop.anyOf.some(option => option.type === type))
    prop.type = prop.type.concat('null')
    delete prop.anyOf
  } else {
    // Add default titles to dropdown of allowed types/subschemas
    Object.values(prop.anyOf).forEach(option => {
      // if the allowed type/ subschema is not a ref nor has a title,
      // it defaults to <parentProp.title> option 1, <prop.title> option 2, ...
      // we can convert to display the type name instead
      if (!option.$ref && option.type && !option.title) {
        option.title = option.type
      }
    })
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
        const allowedTypes = ['string', 'number', 'boolean', 'integer']
        processAnyOf(prop, allowedTypes)
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
