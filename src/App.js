import React from 'react'
import PropTypes from 'prop-types'
import 'bootstrap/dist/css/bootstrap.min.css'
// import { Header } from './components/layout'
import MetadataEntryPage from './views/MetadataEntryPage'
import { SchemaContextProvider } from './contexts/schema.context'
import Config from './utils/config'

/**
 * Single-page application to display a header and metadata entry form.
 * MetadataEntryPage handles schema selection, form rendering, and form submission.
 */
function App (props) {
  const { appVersion } = props

  return (
    <div>
      <div>
        <nav className="navbar navbar-default">
          <div className="container-fluid">
            <span className="navbar-brand">AIND Data Transfer Forms {appVersion}</span>
            <ul className="nav navbar-nav">
              <li className="active"><a href="/">Submit Jobs</a></li>
              <li><a href={process.env.REACT_APP_DATA_TRANSFER_SERVICE_URL + '/jobs'}>Job Status</a></li>
              <li><a href={process.env.REACT_APP_METADATA_SERVICE_PROJECT_NAMES_URL} target="_blank" rel='noreferrer'>Project Names</a></li>
              <li><a href={Config.AIND_DATA_TRANSFER_SERVICE_READTHEDOCS_URL} target="_blank" rel='noreferrer'>Help</a></li>
            </ul>
          </div>
        </nav>
      </div>
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
