import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Toolbar from './Toolbar'
import { parseAndFilterSchemas } from '../utilities/schemaFetchers'
import sampleSchemaLinks from '../testing/sample-schema-links.json'
import sampleSortedVersionListInstrument from '../testing/sample-sorted-version-list-instrument.json'

const nullCallback = () => { }
const sampleSchemaList = parseAndFilterSchemas(sampleSchemaLinks)

describe('Toolbar component', () => {
  it('renders appropriate inputs on default', () => {
    render(<Toolbar
      ParentTypeCallback={nullCallback}
      ParentVersionCallback={nullCallback}
      selectedSchemaType=''
      selectedSchemaPath=''
      schemaList={sampleSchemaList}
      handleRehydrate={nullCallback}
    />)
    expect(screen.getByTitle('Select a schema')).toBeInTheDocument()
    expect(screen.getByTitle('Select a version')).toBeInTheDocument()
    expect(screen.getByTitle('Autofill with existing data from local file')).toBeInTheDocument()
    expect(screen.getByTitle('Select a schema')).toBeEnabled()
    expect(screen.getByTitle('Select a version')).toBeDisabled()
    expect(screen.getByTitle('Autofill with existing data from local file')).toBeEnabled()
  })

  it('calls ParentTypeCallback and enables version selection dropdown when a schema type is chosen', () => {
    const mockTypeCallback = jest.fn()
    const sampleSchemaType = 'subject'
    const newSchemaType = 'instrument'
    render(<Toolbar
      ParentTypeCallback={mockTypeCallback}
      ParentVersionCallback={nullCallback}
      selectedSchemaType={sampleSchemaType}
      selectedSchemaPath=''
      schemaList={sampleSchemaList}
      handleRehydrate={nullCallback}
    />)
    fireEvent.change(screen.getByTitle('Select a schema'), { target: { value: newSchemaType } })
    expect(screen.getByTitle('Select a version')).toBeEnabled()
    expect(mockTypeCallback).toHaveBeenCalledWith(newSchemaType)
  })

  it('has schema versions sorted by latest-first semantic version', () => {
    const sampleSchemaType = 'instrument'
    render(<Toolbar
      ParentTypeCallback={nullCallback}
      ParentVersionCallback={nullCallback}
      selectedSchemaType={sampleSchemaType}
      selectedSchemaPath=''
      schemaList={sampleSchemaList}
      handleRehydrate={nullCallback}
    />)
    const schemaVersionsList = [...screen.getByTitle('Select a version').options].map((option) => option.text)
    expect(schemaVersionsList).toStrictEqual(sampleSortedVersionListInstrument)
  })

  it('calls ParentVersionCallback when a schema version is chosen', () => {
    const mockVersionCallback = jest.fn()
    const sampleSchemaType = 'instrument'
    const sampleSchemaPath = 'schemas/instrument/0.10.0/instrument_schema.json'
    render(<Toolbar
      ParentTypeCallback={nullCallback}
      ParentVersionCallback={mockVersionCallback}
      selectedSchemaType={sampleSchemaType}
      selectedSchemaPath=''
      schemaList={sampleSchemaList}
      handleRehydrate={nullCallback}
    />)
    fireEvent.change(screen.getByTitle('Select a version'), { target: { value: sampleSchemaPath } })
    expect(mockVersionCallback).toHaveBeenCalledWith(sampleSchemaPath)
  })

  it('calls handleRehydrate when autofill button is clicked', () => {
    const mockRehydrateCallback = jest.fn()
    render(<Toolbar
      ParentTypeCallback={nullCallback}
      ParentVersionCallback={nullCallback}
      selectedSchemaType=''
      selectedSchemaPath=''
      schemaList={sampleSchemaList}
      handleRehydrate={mockRehydrateCallback}
    />)
    fireEvent.click(screen.getByTitle('Autofill with existing data from local file'))
    expect(mockRehydrateCallback).toHaveBeenCalled()
  })
})
