import React, { useContext } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { toast } from 'react-toastify'
import RenderForm from '../RenderForm'
import SchemaToolbar from '../SchemaToolbar'
import styles from './MetadataEntryPage.module.css'
import { SchemaContext } from '../../contexts/schema.context'

/**
 * Page to display a dropdown menu of schemas and form to enter metadata.
 * Uses SchemaContext to get states (e.g. selectedSchemaPath).
 */
function MetadataEntryPage () {
  const { selectedSchemaPath } = useContext(SchemaContext)

  return (
    <div>
      <SchemaToolbar/>
      <div className={styles.formSection}>
        <ErrorBoundary
          fallback={<div title='Form error' className={styles.error}>Unable to render form. Please try again or select a different schema/version.</div>}
          onError={(error) => { toast.error(`${error.name}: ${error.message}`) }}
          resetKeys={[selectedSchemaPath]}
        >
          <RenderForm key={selectedSchemaPath}/>
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default MetadataEntryPage
