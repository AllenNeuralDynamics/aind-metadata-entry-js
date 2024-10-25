import React, { useState, useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { toast } from 'react-toastify'
import RenderForm from '../RenderForm'
import { readFromJSONFile } from '../../utils/helpers/file.helpers'
import {
  fetchAndFilterSchemasAsync,
  findLatestSchemas,
  findSchemaFromData,
  fetchSchemaContentAsync,
  processSchemaContent
} from '../../utils/helpers/schema.helpers'
import SchemaToolbar from '../SchemaToolbar'
import styles from './MetadataEntryPage.module.css'
import { toastPromiseWrapper } from '../../utils/helpers/ui.helpers'

/**
 * Page to display a dropdown menu of schemas and form to enter metadata.
 *    Fetches schema objects from s3
 *    Creates schema objects from filepaths
 *    Renders dropdown menu with options
 *    Gives user the option to autofill the form with previously input data
 */
function MetadataEntryPage () {
  const [data, setData] = useState(null)
  const [schema, setSchema] = useState(null)
  const [selectedSchemaType, setSelectedSchemaType] = useState('')
  const [selectedSchemaPath, setSelectedSchemaPath] = useState('')

  const [schemaList, setSchemaList] = useState([])

  useEffect(() => {
    fetchAndFilterSchemasAsync(setSchemaList)
  }, [])

  const updateSelectedSchemaType = async (schemaType) => {
    /**
         * Method to retrieve user-selected schema and
         * defaults form to latest version.
         */
    setSelectedSchemaType(schemaType)
    const latestSchemas = findLatestSchemas(schemaList)
    const schemaPath = latestSchemas[schemaType].path
    await fetchAndSetSchema(schemaPath)
  }

  const updateSelectedSchemaVersion = async (schemaPath) => {
    /**
         * Method to retrieve user-selected schema version
         * and replace default form to selected version
         */
    await fetchAndSetSchema(schemaPath)
  }

  /**
   * Reads from local JSON file, validates schema type and version,
   * and updates form data and state based on uploaded file.
   * Toast promise is used to display pending, success, and error messages.
   */
  const handleRehydrate = async () => {
    const autofillFromJSONFile = async () => {
      const data = await readFromJSONFile()
      const schema = findSchemaFromData(data, schemaList)
      if (!schema) {
        throw new Error('Invalid schema type or version. Please check your file.')
      }
      setSelectedSchemaType(schema.type)
      await fetchAndSetSchema(schema.path)
      setData(data)
    }

    toastPromiseWrapper(
      autofillFromJSONFile(),
      'Reading file...',
      'Successfully autofilled existing data from file.',
      (error) => (error instanceof DOMException && error.name === 'AbortError')
    )
  }

  const fetchAndSetSchema = async (schemaPath) => {
    /**
         * Method to put the user-selected schema into state
         * defaults to latest schema version
         */
    try {
      setData(null)
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
    <div>
      <SchemaToolbar
        updateSelectedSchemaType={updateSelectedSchemaType}
        updateSelectedSchemaVersion={updateSelectedSchemaVersion}
        selectedSchemaType={selectedSchemaType}
        selectedSchemaPath={selectedSchemaPath}
        schemaList={schemaList}
        handleRehydrate={handleRehydrate}
      />
      <div className={styles.formSection}>
        <ErrorBoundary
          fallback={<div title='Form error' className={styles.error}>Unable to render form. Please try again or select a different schema/version.</div>}
          onError={(error) => { toast.error(`${error.name}: ${error.message}`) }}
          resetKeys={[selectedSchemaPath]}
        >
          <RenderForm key={selectedSchemaPath} schemaType={selectedSchemaType} schema={schema} formData={data} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default MetadataEntryPage
