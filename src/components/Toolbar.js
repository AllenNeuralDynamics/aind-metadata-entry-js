import React from 'react'
import PropTypes from 'prop-types'
import 'bootstrap/dist/css/bootstrap.min.css'
import { compareVersions } from 'compare-versions'
import styles from './Toolbar.module.css'
import { toast } from 'react-toastify'
import Config from '../config'
import { getLinkAsButton } from '../utilities/uiUtils'

const helpToast = (
  <div >
    <h2 className='text-primary'>Help</h2>
    View or submit feedback to our {getLinkAsButton(Config.REPO_URL, 'GitHub repository')}:
    <div>
      {getLinkAsButton(`${Config.REPO_URL}/issues`, 'Issues (bugs or feature requests)', 'View/submit bugs or feature requests', true)}
      {getLinkAsButton(`${Config.REPO_URL}/discussions`, 'Discussions', 'View/submit discussions', true)}
    </div>
    <br />
    <h4>Getting started</h4>
    Use this tool to create metadata files based on {getLinkAsButton(Config.AIND_DATA_SCHEMA_REPO_URL, 'aind-data-schema')}
    &nbsp;&#40;{getLinkAsButton(Config.AIND_DATA_SCHEMA_READTHEDOCS_URL, 'readthedocs')}&#41;.
    <ul>
      <li>Select a schema from the dropdown. The latest version will be loaded as a fillable form.</li>
      <li>Or, use the &apos;Autofill from file&apos; button to load an existing metadata file (must be JSON).</li>
      <li>The submitted metadata will be validated and saved as a JSON file to your device.</li>
    </ul>
  </div>)

function Toolbar (props) {
  /**
     * Component to render a dropdown menu for schema-selection.
     * Based on selected schema, renders a dropdown menu for version-selection.
     * Gives user the option to autofill the form with previously input data
     */
  const { ParentTypeCallback, ParentVersionCallback, selectedSchemaType, selectedSchemaPath, schemaList, handleRehydrate } = props

  const schemaTypes = Array.from(
    new Set(schemaList.map((schema) => schema.type))
  )

  const schemas = schemaList
    .filter((schema) => schema.type === selectedSchemaType)
    .sort((a, b) => compareVersions(b.version, a.version)) // reverse sort by semver

  const handleTypeChange = (event) => {
    ParentTypeCallback(event.target.value)
    event.target.blur()
  }

  const handleVersionChange = (event) => {
    ParentVersionCallback(event.target.value)
    event.target.blur()
  }

  const handleAutofill = (event) => {
    handleRehydrate()
    event.target.blur()
  }

  const showHelpPopup = (event) => {
    toast(helpToast, {
      toastId: 'help-toast', // provide id to disable duplicates
      autoClose: false
    })
    event.target.blur()
  }

  return (
    <div>
      <div className="btn-toolbar" role="toolbar">
        <select
          id="schema-type-select"
          className={['btn', 'btn-default', styles.dropdown].join(' ')}
          title='Select a schema'
          value={selectedSchemaType}
          onChange={handleTypeChange}
        >
          <option value="">Select schema</option>
          {schemaTypes.map((schemaType) => (
            <option key={schemaType} value={schemaType}>
              {schemaType}
            </option>
          ))}
        </select>
        <select
          id="schema-version-select"
          className={['btn', 'btn-default', styles.dropdown].join(' ')}
          title='Select a version'
          value={selectedSchemaPath}
          onChange={handleVersionChange}
          disabled={!selectedSchemaType}
        >
          <option value="">Select version</option>
          {schemas.map((schema) => (
            <option key={schema.path} value={schema.path}>
              {schema.version}
            </option>
          ))}
        </select>
        <button
          title="Get help"
          type="button"
          className={['btn', 'btn-default', 'pull-right'].join(' ')}
          onClick={showHelpPopup}
        >
          Help
        </button>
        <button
          title="Autofill with existing data from local file"
          type="button"
          className={['btn', 'btn-default', 'pull-right'].join(' ')}
          onClick={handleAutofill}
        >
          Autofill from file
        </button>
      </div>
    </div>
  )
}

Toolbar.propTypes = {
  ParentTypeCallback: PropTypes.func.isRequired,
  ParentVersionCallback: PropTypes.func.isRequired,
  selectedSchemaType: PropTypes.string.isRequired,
  selectedSchemaPath: PropTypes.string.isRequired,
  schemaList: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleRehydrate: PropTypes.func.isRequired
}

export default Toolbar
