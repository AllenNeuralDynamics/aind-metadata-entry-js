import React, { useContext } from 'react'
import { compareVersions } from 'compare-versions'
import { toast } from 'react-toastify'
import { Button, SelectDropdown } from '../components/inputs'
import { Toolbar } from '../components/layout'
import Help from './Help'
import { SchemaContext } from '../contexts/schema.context'

/**
 * Component to render a dropdown menu for schema-selection.
 * Based on selected schema, renders a dropdown menu for version-selection.
 * Gives user the option to autofill the form with previously input data.
 * Uses SchemaContext to get and manage states (e.g. selectedSchemaPath, updateSelectedSchemaVersion).
 */
function SchemaToolbar () {
  const { updateSelectedSchemaType, updateSelectedSchemaVersion, selectedSchemaType, selectedSchemaPath, schemaList, handleRehydrate } = useContext(SchemaContext)

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

export default SchemaToolbar
