import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import SchemaToolbar from '../../../components/views/SchemaToolbar'
import SCHEMA_LIST from '../../resources/schema-links/full-parsed-filtered.json'
import SORTED_VERSION_LIST_INSTRUMENT from '../../resources/sorted-version-list-instrument.json'
import { toast } from 'react-toastify'
import Help from '../../../components/views/Help'
import { SchemaContext } from '../../../contexts/schema.context'

const NULL_CALLBACK = () => { }
jest.mock('react-toastify', () => ({ toast: jest.fn() }))
jest.mock('../../../components/views/Help', () => jest.fn())

/**
 * Helper function to render SchemaToolbar component with test context
 * @param {*} context - Context value to used in the test
 */
const renderWithContext = (context) => {
  render(
    <SchemaContext.Provider value={context}>
      <SchemaToolbar/>
    </SchemaContext.Provider>
  )
}

describe('SchemaToolbar component', () => {
  it('renders appropriate inputs on default', () => {
    renderWithContext({
      updateSelectedSchemaType: NULL_CALLBACK,
      updateSelectedSchemaVersion: NULL_CALLBACK,
      selectedSchemaType: '',
      selectedSchemaPath: '',
      schemaList: SCHEMA_LIST,
      handleRehydrate: NULL_CALLBACK
    })
    expect(screen.getByTitle('Select schema')).toBeInTheDocument()
    expect(screen.getByTitle('Select version')).toBeInTheDocument()
    expect(screen.getByTitle('Autofill with existing data from local file')).toBeInTheDocument()
    expect(screen.getByTitle('Get help')).toBeInTheDocument()
    expect(screen.getByTitle('Select schema')).toBeEnabled()
    expect(screen.getByTitle('Select version')).toBeDisabled()
    expect(screen.getByTitle('Autofill with existing data from local file')).toBeEnabled()
    expect(screen.getByTitle('Get help')).toBeEnabled()
  })

  it('calls updateSelectedSchemaType and enables version selection dropdown when a schema type is chosen', () => {
    const mockTypeCallback = jest.fn()
    const schemaType = 'subject'
    const newSchemaType = 'instrument'
    renderWithContext({
      updateSelectedSchemaType: mockTypeCallback,
      updateSelectedSchemaVersion: NULL_CALLBACK,
      selectedSchemaType: schemaType,
      selectedSchemaPath: '',
      schemaList: SCHEMA_LIST,
      handleRehydrate: NULL_CALLBACK
    })
    fireEvent.change(screen.getByTitle('Select schema'), { target: { value: newSchemaType } })
    expect(screen.getByTitle('Select version')).toBeEnabled()
    expect(mockTypeCallback).toHaveBeenCalledWith(newSchemaType)
  })

  it('has schema versions sorted by latest-first semantic version', () => {
    const schemaType = 'instrument'
    renderWithContext({
      updateSelectedSchemaType: NULL_CALLBACK,
      updateSelectedSchemaVersion: NULL_CALLBACK,
      selectedSchemaType: schemaType,
      selectedSchemaPath: '',
      schemaList: SCHEMA_LIST,
      handleRehydrate: NULL_CALLBACK
    })
    const schemaVersionsList = [...screen.getByTitle('Select version').options].map((option) => option.text)
    expect(schemaVersionsList).toStrictEqual(SORTED_VERSION_LIST_INSTRUMENT)
  })

  it('calls updateSelectedSchemaVersion when a schema version is chosen', () => {
    const mockVersionCallback = jest.fn()
    const schemaType = 'instrument'
    const schemaPath = 'schemas/instrument/0.10.0/instrument_schema.json'
    renderWithContext({
      updateSelectedSchemaType: NULL_CALLBACK,
      updateSelectedSchemaVersion: mockVersionCallback,
      selectedSchemaType: schemaType,
      selectedSchemaPath: '',
      schemaList: SCHEMA_LIST,
      handleRehydrate: NULL_CALLBACK
    })
    fireEvent.change(screen.getByTitle('Select version'), { target: { value: schemaPath } })
    expect(mockVersionCallback).toHaveBeenCalledWith(schemaPath)
  })

  it('calls handleRehydrate when autofill button is clicked', () => {
    const mockRehydrateCallback = jest.fn()
    renderWithContext({
      updateSelectedSchemaType: NULL_CALLBACK,
      updateSelectedSchemaVersion: NULL_CALLBACK,
      selectedSchemaType: '',
      selectedSchemaPath: '',
      schemaList: SCHEMA_LIST,
      handleRehydrate: mockRehydrateCallback
    })
    fireEvent.click(screen.getByTitle('Autofill with existing data from local file'))
    expect(mockRehydrateCallback).toHaveBeenCalled()
  })

  it('displays a popup with Help info when the Help button is clicked', () => {
    const expectedToastParams = {
      toastId: 'help-toast',
      autoClose: false
    }
    renderWithContext({
      updateSelectedSchemaType: NULL_CALLBACK,
      updateSelectedSchemaVersion: NULL_CALLBACK,
      selectedSchemaType: '',
      selectedSchemaPath: '',
      schemaList: SCHEMA_LIST,
      handleRehydrate: NULL_CALLBACK
    })
    fireEvent.click(screen.getByTitle('Get help'))
    expect(toast).toHaveBeenCalledWith((<Help />), expectedToastParams)
  })
})
