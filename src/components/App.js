import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { ErrorBoundary } from 'react-error-boundary'
import { toast } from 'react-toastify'
import RenderForm from './RenderForm'
import RehydrateForm from './RehydrateForm'
import { preProcessSchema } from '../utilities/schemaHandlers'
import { fetchSchemasfromS3, findLatestSchemas, filterSchemas } from '../utilities/schemaFetchers'
import Toolbar from './Toolbar'
import styles from './App.module.css'

function App (props) {
  /*
    Application to display a dropdown menu of schemas.
        Fetches schema objects from s3
        Creates schema objects from filepaths
        Renders dropdown menu with options
        Gives user the option to autofill the form with previously input data
     */
  const { appVersion } = props
  const appVersionMsg = appVersion ? `App version ${appVersion}` : null
  const [data, setData] = useState(null)
  const [schema, setSchema] = useState(null)
  const [selectedSchemaType, setSelectedSchemaType] = useState('')
  const [selectedSchemaVersion, setSelectedSchemaVersion] = useState('')
  const [selectedSchemaPath, setSelectedSchemaPath] = useState('')

  const [schemaList, setSchemaList] = useState([])

  useEffect(() => {
    async function fetchSchemaList () {
      /*
            Method to retrieve list of schema links from aws s3 bucket
            UseEffect hook so that dropdowns can be rendered from list
            */
      const schemaLinks = await fetchSchemasfromS3()
      const filteredSchemas = filterSchemas(schemaLinks)
      setSchemaList(filteredSchemas)
    }
    fetchSchemaList()
  }, [])

  const typeCallbackFunction = async (childData) => {
    /**
         * Method to retrieve user-selected schema and
         * defaults form to latest version.
         */
    setSelectedSchemaType(childData)
    const latestSchemas = findLatestSchemas(schemaList)
    const schemaURL = latestSchemas[childData].path
    setSelectedSchemaVersion(latestSchemas[childData].version)
    await fetchAndSetSchema(schemaURL, childData)
  }

  const versionCallbackFunction = async (childData) => {
    /**
         * Method to retrieve user-selected schema version
         * and replace default form to selected version
         */
    setSelectedSchemaVersion(childData)
    const schemaURL = schemaList.find(url =>
      url.includes(selectedSchemaType) && url.includes(childData)
    )
    await fetchAndSetSchema(schemaURL)
  }

  const handleRehydrate = async () => {
    /**
         * Method to put the user-selected data into state
         * updates schema based on schema version in rehydrate file
         */
    const data = await RehydrateForm()
    const version = data.schema_version
    setSelectedSchemaVersion(version)
    const schemaURL = schemaList.find(url =>
      url.includes(selectedSchemaType) && url.includes(version))
    await fetchAndSetSchema(schemaURL)
    setData(data)
  }

  const fetchAndSetSchema = async (url) => {
    /**
         * Method to put the user-selected schema into state
         * defaults to latest schema version
         */
    try {
      const response = await fetch(process.env.REACT_APP_S3_URL + '/' + url)
      const schema = await response.json()
      const processedSchema = await schema ? preProcessSchema(schema) : undefined
      setSelectedSchemaPath(url)
      setSchema(processedSchema)
    } catch (error) {
      console.error(error)
      toast.error(`Unable to render ${url}`)
    }
  }

  return (
    <div>
      <div className={styles.titleSection}>
        <h1> AIND Metadata Entry </h1>
        <div>User-interface for metadata ingestion and validation. Use on Chrome or Edge. {appVersionMsg}</div>
      </div>
      <div className={styles.toolbarSection}>
        < Toolbar
          ParentTypeCallback={typeCallbackFunction}
          ParentVersionCallback={versionCallbackFunction}
          selectedSchemaVersion={selectedSchemaVersion}
          schemaList={schemaList}
          handleRehydrate={handleRehydrate}
        />
      </div>
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

App.propTypes = {
  appVersion: PropTypes.string.isRequired
}

export default App
