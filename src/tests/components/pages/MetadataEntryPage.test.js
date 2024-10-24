import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import MetadataEntryPage from '../../../components/pages/MetadataEntryPage'
import Toolbar from '../../../components/Toolbar'
import RenderForm from '../../../components/RenderForm'
import * as fileHelpers from '../../../utils/helpers/file.helpers'
import * as schemaFetchers from '../../../utils/helpers/schema.helpers'

const FILE_DATA = { test_property: 'data' }
const MOCK_MATCHED_SCHEMA_DEF = { type: 'test_type_1', path: 'test_type_1.py' }
const MOCK_FETCHED_SCHEMA_JSON = {
  title: 'Test Type 1',
  type: 'object',
  properties: {
    test_property: {
      type: 'string'
    }
  }
}

jest.mock('../../../components/Toolbar', () => jest.fn())
jest.mock('../../../components/RenderForm', () => jest.fn())

describe('MetadataEntryPage', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders without crashing', () => {
    render(<MetadataEntryPage/>)
    expect(screen.queryByTitle('Form error')).toBeNull()
  })

  it('renders Toolbar and RenderForm child components on default', () => {
    render(<MetadataEntryPage/>)
    expect(Toolbar).toHaveBeenCalled()
    expect(RenderForm).toHaveBeenCalled()
  })

  it('catches and displays error when unable to render form', () => {
    jest.spyOn(console, 'error').mockImplementation(() => jest.fn())
    RenderForm.mockImplementation(() => { throw new Error('Unable to render form') })
    render(<MetadataEntryPage/>)
    expect(RenderForm).toThrow('Unable to render form')
    expect(screen.getByTitle('Form error')).toBeVisible()
  })
})

describe('handleRehydrate', () => {
  beforeEach(() => {
    jest.spyOn(schemaFetchers, 'fetchAndFilterSchemasAsync').mockResolvedValue([])
    // mock child components to trigger handleRehydrate and display state changes
    Toolbar.mockImplementation(({ selectedSchemaType, handleRehydrate }) => (
      <div>
        <button data-testid='test-autofill-btn' onClick={handleRehydrate}>Test Autofill Button</button >
        <span>{selectedSchemaType}</span>
      </div>
    ))
    RenderForm.mockImplementation(({ formData }) => (
      <div>{JSON.stringify(formData)}</div>
    ))
    // mock utils to return correct file data and matched schema
    jest.spyOn(fileHelpers, 'readFromJSONFile').mockResolvedValue(FILE_DATA)
    jest.spyOn(schemaFetchers, 'findSchemaFromData').mockReturnValue(MOCK_MATCHED_SCHEMA_DEF)
    jest.spyOn(global, 'fetch').mockResolvedValue({ json: () => MOCK_FETCHED_SCHEMA_JSON })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('reads and validates from JSON file and updates state based on contents', async () => {
    render(<MetadataEntryPage/>)
    fireEvent.click(await screen.findByTestId('test-autofill-btn'))

    expect(fileHelpers.readFromJSONFile).toHaveBeenCalledTimes(1)
    expect(await screen.findByText(MOCK_MATCHED_SCHEMA_DEF.type)).toBeVisible()
    expect(await screen.findByText(JSON.stringify(FILE_DATA))).toBeVisible()
  })
})
