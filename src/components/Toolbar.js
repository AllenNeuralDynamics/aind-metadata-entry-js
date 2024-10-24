import React from 'react'
import PropTypes from 'prop-types'
import 'bootstrap/dist/css/bootstrap.min.css'
import { compareVersions } from 'compare-versions'
import { toast } from 'react-toastify'
import Config from '../utils/config'
import { Button, LinkButton, SelectDropdown } from './layout/inputs'

const helpToast = (
  <div >
    <h2 className='text-primary'>Help</h2>
    View or submit feedback to our <LinkButton url={Config.REPO_URL} text='GitHub repository' />:
    <div>
      <LinkButton url={`${Config.REPO_URL}/issues`} text='Issues (bugs or feature requests)' tooltip='View/submit bugs or feature requests' displayAsButton />
      <LinkButton url={`${Config.REPO_URL}/discussions`} text='Discussions' tooltip='View/submit discussions' displayAsButton />
    </div>
    <br />
    <h4>Getting started</h4>
    Use this tool to create metadata files based on&nbsp;
    <LinkButton url={Config.AIND_DATA_SCHEMA_REPO_URL} text='aind-data-schema' />
    &nbsp;&#40;<LinkButton url={Config.AIND_DATA_SCHEMA_READTHEDOCS_URL} text='readthedocs' />&#41;.
    <ul>
      <li>Select a schema from the dropdown. The latest version will be loaded as a fillable form.</li>
      <li>Or, use the &apos;Autofill from file&apos; button to load an existing metadata file (must be JSON).</li>
      <li>The submitted metadata will be validated and saved as a JSON file to your device.</li>
    </ul>
  </div>)

/**
 * Component to render a dropdown menu for schema-selection.
 * Based on selected schema, renders a dropdown menu for version-selection.
 * Gives user the option to autofill the form with previously input data
 */
function Toolbar (props) {
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
        <SelectDropdown
          title='Select schema'
          value={selectedSchemaType}
          onChange={handleTypeChange}
          options={schemaTypes.map((schemaType) => ({ value: schemaType }))}
        />
        <SelectDropdown
          title='Select version'
          value={selectedSchemaPath}
          onChange={handleVersionChange}
          disabled={!selectedSchemaType}
          options={schemas.map((schema) => (
            { value: schema.path, title: schema.version }
          ))}
        />
        <Button
          text='Help'
          tooltip="Get help"
          onClick={showHelpPopup}
          stylePullRight
        />
        <Button
          text='Autofill from file'
          tooltip='Autofill with existing data from local file'
          onClick={handleAutofill}
          stylePullRight
        />
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
