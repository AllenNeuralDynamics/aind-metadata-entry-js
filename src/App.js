import React from 'react'
import PropTypes from 'prop-types'
import Header from './components/layout/Header'
import MetadataEntryPage from './components/pages/MetadataEntryPage'

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
      />
      < MetadataEntryPage/>
    </div>
  )
}
App.propTypes = {
  appVersion: PropTypes.string.isRequired
}

export default App
