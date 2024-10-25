import React from 'react'
import PropTypes from 'prop-types'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Header } from './components/layout'
import MetadataEntryPage from './views/MetadataEntryPage'
import { SchemaContextProvider } from './contexts/schema.context'

/**
 * Single-page application to display a header and metadata entry form.
 * MetadataEntryPage handles schema selection, form rendering, and form submission.
 */
function App (props) {
  const { appVersion } = props

  return (
    <div>
      < Header
        title="AIND Metadata Entry"
        subtitle={`User-interface for metadata ingestion and validation. Use on Chrome or Edge. App version ${appVersion}`}
        alignCenter
      />
      <SchemaContextProvider>
        < MetadataEntryPage/>
      </SchemaContextProvider>
    </div>
  )
}
App.propTypes = {
  appVersion: PropTypes.string.isRequired
}

export default App
