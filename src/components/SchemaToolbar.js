import React from 'react'
import PropTypes from 'prop-types'
import { compareVersions } from 'compare-versions'
import { toast } from 'react-toastify'
import { Button, SelectDropdown } from './layout/inputs'
import Toolbar from './layout/Toolbar'
import Help from './Help'

/**
 * Component to render a dropdown menu for schema-selection.
 * Based on selected schema, renders a dropdown menu for version-selection.
 * Gives user the option to autofill the form with previously input data
 */
function SchemaToolbar (props) {
  const { updateSelectedSchemaType, updateSelectedSchemaVersion, selectedSchemaType, selectedSchemaPath, schemaList, handleRehydrate } = props

  const schemaTypes = Array.from(
    new Set(schemaList.map((schema) => schema.type))
  )

  const schemas = schemaList
    .filter((schema) => schema.type === selectedSchemaType)
    .sort((a, b) => compareVersions(b.version, a.version)) // reverse sort by semver

  const showHelpPopup = () => {
    toast(<Help/>, {
      toastId: 'help-toast', // provide id to disable duplicates
      autoClose: false
    })
  }

  return (
    <Toolbar>
      <SelectDropdown
        title='Select schema'
        value={selectedSchemaType}
        onChange={updateSelectedSchemaType}
        options={schemaTypes.map((schemaType) => ({ value: schemaType }))}
      />
      <SelectDropdown
        title='Select version'
        value={selectedSchemaPath}
        onChange={updateSelectedSchemaVersion}
        disabled={!selectedSchemaType}
        options={schemas.map((schema) => (
          { value: schema.path, title: schema.version }
        ))}
      />
      <Button
        text='Help'
        tooltip="Get help"
        onClick={showHelpPopup}
        extraClassName='pull-right'
      />
      <Button
        text='Autofill from file'
        tooltip='Autofill with existing data from local file'
        onClick={handleRehydrate}
        extraClassName='pull-right'
      />
    </Toolbar>
  )
}
SchemaToolbar.propTypes = {
  updateSelectedSchemaType: PropTypes.func.isRequired,
  updateSelectedSchemaVersion: PropTypes.func.isRequired,
  selectedSchemaType: PropTypes.string.isRequired,
  selectedSchemaPath: PropTypes.string.isRequired,
  schemaList: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleRehydrate: PropTypes.func.isRequired
}

export default SchemaToolbar
