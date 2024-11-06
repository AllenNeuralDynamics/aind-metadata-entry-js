import React from 'react'
import { render, screen } from '@testing-library/react'
import MetadataEntryPage from '../../views/MetadataEntryPage'
import SchemaToolbar from '../../views/SchemaToolbar'
import RenderForm from '../../views/RenderForm'
import { SchemaContext } from '../../contexts/schema.context'

const SCHEMA_TYPE = 'test_type'

jest.mock('../../views/SchemaToolbar', () => jest.fn())
jest.mock('../../views/RenderForm', () => jest.fn())

/**
 * Helper function to render MetadataEntryPage with test context
 * @param {*} context - Context value to used in the test
 */
const renderWithContext = (context) => {
  render(
    <SchemaContext.Provider value={context}>
      <MetadataEntryPage/>
    </SchemaContext.Provider>
  )
}

describe('MetadataEntryPage', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders without crashing', () => {
    renderWithContext({ selectedSchemaType: SCHEMA_TYPE })
    expect(screen.queryByTitle('Form error')).toBeNull()
  })

  it('renders SchemaToolbar and RenderForm child components on default', () => {
    renderWithContext({ selectedSchemaType: SCHEMA_TYPE })
    expect(SchemaToolbar).toHaveBeenCalled()
    expect(RenderForm).toHaveBeenCalled()
  })

  it('catches and displays error when unable to render form', () => {
    jest.spyOn(console, 'error').mockImplementation(() => jest.fn())
    RenderForm.mockImplementation(() => { throw new Error('Unable to render form') })
    renderWithContext({ selectedSchemaType: SCHEMA_TYPE })
    expect(RenderForm).toThrow('Unable to render form')
    expect(screen.getByTitle('Form error')).toBeVisible()
  })
})
