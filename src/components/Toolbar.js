import React from 'react'
import PropTypes from 'prop-types'
import 'bootstrap/dist/css/bootstrap.min.css'
import { compareVersions } from 'compare-versions'
import styles from './Toolbar.module.css'

function Toolbar (props) {
  /**
     * Component to render a dropdown menu for schema-selection.
     * Based on selected schema, renders a dropdown menu for version-selection.
     * Gives user the option to autofill the form with previously input data
     */
  const { ParentTypeCallback, ParentVersionCallback, selectedSchemaType, selectedSchemaPath, schemaList, ParentAutofillCallback } = props

  const schemaTypes = Array.from(
    new Set(schemaList.map((schema) => schema.type))
  )

  const schemas = schemaList
    .filter((schema) => schema.type === selectedSchemaType)
    .sort((a, b) => compareVersions(b.version, a.version)) // reverse sort by semver

  const handleTypeChange = (event) => {
    ParentTypeCallback(event.target.value)
  }

  const handleVersionChange = (event) => {
    ParentVersionCallback(event.target.value)
  }

  const handleAutofill = (event) => {
    ParentAutofillCallback()
  }

  return (
    <div>
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
        title="Autofill with existing data from local file"
        type="button"
        className={['btn', 'btn-default', styles.btnRight].join(' ')}
        onClick={handleAutofill}
      >
        Autofill from file
      </button>
    </div>
  )
}

Toolbar.propTypes = {
  ParentTypeCallback: PropTypes.func.isRequired,
  ParentVersionCallback: PropTypes.func.isRequired,
  selectedSchemaType: PropTypes.string,
  selectedSchemaPath: PropTypes.string.isRequired,
  schemaList: PropTypes.arrayOf(PropTypes.object).isRequired,
  ParentAutofillCallback: PropTypes.func.isRequired
}

export default Toolbar
