import React, { useState } from 'react'
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
  const { ParentTypeCallback, ParentVersionCallback, selectedSchemaVersion, schemaList, handleRehydrate } = props
  const [selectedSchemaType, setSelectedSchemaType] = useState('')

  const schemaTypes = Array.from(
    new Set(schemaList.map((schema) => schema.split('/')[1]))
  )
  schemaTypes.shift()

  const versions = schemaList
    .filter((schema) => {
      const [, schemaType] = schema.split('/')
      return schemaType === selectedSchemaType
    })
    .map((schema) => schema.split('/')[2])
    .filter((version) => version !== undefined)
    .sort(compareVersions)
    .reverse()

  const handleTypeChange = (event) => {
    ParentTypeCallback(event.target.value)
    setSelectedSchemaType(event.target.value)
  }

  const handleVersionChange = (event) => {
    ParentVersionCallback(event.target.value)
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
        value={selectedSchemaVersion}
        onChange={handleVersionChange}
        disabled={!selectedSchemaType}
      >
        <option value="">Select version</option>
        {versions.map((version) => (
          <option key={version} value={version}>
            {version}
          </option>
        ))}
      </select>
      <button
        title="Autofill with existing data"
        type="button"
        className={['btn', 'btn-default', styles.btnRight].join(' ')}
        onClick={handleRehydrate}
        disabled={!selectedSchemaType}
      >
        Autofill with existing data
      </button>
    </div>
  )
}

Toolbar.propTypes = {
  ParentTypeCallback: PropTypes.func.isRequired,
  ParentVersionCallback: PropTypes.func.isRequired,
  selectedSchemaVersion: PropTypes.string.isRequired,
  schemaList: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleRehydrate: PropTypes.func.isRequired
}

export default Toolbar
