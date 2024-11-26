import React, { createContext, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import { readFromJSONFile } from '../utils/helpers/file.helpers'
import {
  fetchAndFilterSchemasAsync,
  findLatestSchemas,
  // findSchemaFromFormData,
  fetchSchemaContentAsync,
  processSchemaContent
} from '../utils/helpers/schema.helpers'
import { toastPromiseWrapper } from '../utils/helpers/ui.helpers'
import Config from '../utils/config'

export const SchemaContext = createContext()

/**
 * Context provider for schema-related states and functions.
 *    Fetches schema objects from s3
 *    Creates schema objects from filepaths
 *    Manages state of selected schema and current form data
 *    Gives user the option to autofill the form with previously input data
 */
export const SchemaContextProvider = ({ children }) => {
  const [formData, setFormData] = useState(null) // formData for rjsf form
  const [schema, setSchema] = useState(null) // JSON schema contents for rjsf form

  // currently selected schema type and path
  const [selectedSchemaType, setSelectedSchemaType] = useState('')
  const [selectedSchemaPath, setSelectedSchemaPath] = useState('')

  // list of available schemas
  const [schemaList, setSchemaList] = useState([])

  // On mount, fetch available schemas from S3, then filter and parse them into schemaList
  useEffect(() => {
    fetchAndFilterSchemasAsync(setSchemaList)
  }, [])

  /**
   * Given a new schema type, retrieve the latest version of the schema from S3.
   * @param {string} schemaType - The schema type to retrieve
   */
  const updateSelectedSchemaType = async (schemaType) => {
    setSelectedSchemaType(schemaType)
    const latestSchemas = findLatestSchemas(schemaList)
    const schemaPath = latestSchemas[schemaType].path
    await fetchAndSetSchema(schemaPath)
  }

  /**
   * Given a new schema version, update the form to use the selected version.
   * @param {string} schemaPath - The path to the schema to use
   */
  const updateSelectedSchemaVersion = async (schemaPath) => {
    await fetchAndSetSchema(schemaPath)
  }

  /**
   * Reads from local JSON file, validates schema type and version,
   * and updates form data and state based on uploaded file.
   * Toast promise is used to display pending, success, and error messages.
   */
  const handleRehydrate = async () => {
    const autofillFromJSONFile = async () => {
      const formData = await readFromJSONFile()
      // Only autofill for 'SubmitJobRequest' schema type
      setSelectedSchemaType('SubmitJobRequest')
      const schema = Config.AIND_DATA_TRANSFER_SCHEMAS.find(
        (schema) => schema.type === 'SubmitJobRequest'
      )
      await fetchAndSetSchema(schema.path)
      setFormData(formData)
    }

    toastPromiseWrapper(
      autofillFromJSONFile(),
      'Reading file...',
      'Successfully autofilled existing data from file.',
      (error) => (error instanceof DOMException && error.name === 'AbortError')
    )
  }

  /**
   * Given a schemaPath, fetches the schema content from S3, processes it for custom rendering,
   * and updates the state variables.
   * @param {string} schemaPath - The path to the new schema to use
   */
  const fetchAndSetSchema = async (schemaPath) => {
    try {
      setFormData(null)
      const schema = await fetchSchemaContentAsync(schemaPath)
      // Try to process schema for custom rendering
      // If there are errors, render raw original schema
      let processedSchema
      try {
        processedSchema = processSchemaContent(schema)
      } catch (error) {
        const msg = `Error processing ${schema?.title} ${schema.properties?.schema_version?.const}`
        console.error(msg, error)
        processedSchema = schema
        toast.warn(`${msg}. Rendered raw schema instead.`)
      }
      setSelectedSchemaPath(schemaPath)
      setSchema(processedSchema)
    } catch (error) {
      console.error(error)
      toast.error(`Unable to render ${schemaPath}`)
    }
  }

  return (
    <SchemaContext.Provider value={{
      formData,
      schema,
      selectedSchemaType,
      selectedSchemaPath,
      schemaList,
      updateSelectedSchemaType,
      updateSelectedSchemaVersion,
      handleRehydrate
    }}>
      {children}
    </SchemaContext.Provider>
  )
}
SchemaContextProvider.propTypes = {
  children: PropTypes.node.isRequired
}
