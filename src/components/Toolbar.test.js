import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Toolbar from './Toolbar'
import sampleSchemaList from '../testing/sample-schema-list.json'
import sampleSortedVersionListInstrument from '../testing/sample-sorted-version-list-instrument.json'

const nullCallback = () => { }

describe('Toolbar component', () => {
  it('renders appropriate inputs on default', () => {
    render(<Toolbar
      ParentTypeCallback={nullCallback}
      ParentVersionCallback={nullCallback}
      selectedSchemaVersion=''
      schemaList={sampleSchemaList}
      handleRehydrate={nullCallback}
    />)
    expect(screen.getByTitle('Select a schema')).toBeInTheDocument()
    expect(screen.getByTitle('Select a version')).toBeInTheDocument()
    expect(screen.getByTitle('Autofill with existing data')).toBeInTheDocument()
    expect(screen.getByTitle('Select a schema')).toBeEnabled()
    expect(screen.getByTitle('Select a version')).toBeDisabled()
    expect(screen.getByTitle('Autofill with existing data')).toBeDisabled()
  })

  it('enables version selection dropdown and autofill/ upload button when a schema type is chosen', () => {
    render(<Toolbar
      ParentTypeCallback={nullCallback}
      ParentVersionCallback={nullCallback}
      selectedSchemaVersion=''
      schemaList={sampleSchemaList}
      handleRehydrate={nullCallback}
    />)
    fireEvent.change(screen.getByTitle('Select a schema'), { target: { value: 'instrument' } })
    expect(screen.getByTitle('Select a version')).toBeEnabled()
    expect(screen.getByTitle('Autofill with existing data')).toBeEnabled()
  })

  it('has schema versions sorted by latest-first semantic version', () => {
    render(<Toolbar
      ParentTypeCallback={nullCallback}
      ParentVersionCallback={nullCallback}
      selectedSchemaVersion=''
      schemaList={sampleSchemaList}
      handleRehydrate={nullCallback}
    />)
    fireEvent.change(screen.getByTitle('Select a schema'), { target: { value: 'instrument' } })

    const schemaVersionsList = [...screen.getByTitle('Select a version').options].map((option) => option.text)
    expect(schemaVersionsList).toStrictEqual(sampleSortedVersionListInstrument)
  })
})
