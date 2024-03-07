import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import App from './App'
import Toolbar from './Toolbar'
import RenderForm from './RenderForm'
import * as fileUtils from '../utilities/fileUtils'
import * as schemaFetchers from '../utilities/schemaFetchers'

const TEST_APP_VERSION = '0.1.0'

const SAMPLE_FILE_DATA = { test_property: 'data' }
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

jest.mock('./Toolbar', () => jest.fn())
jest.mock('./RenderForm', () => jest.fn())

describe('App component', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders without crashing', () => {
    render(<App appVersion={TEST_APP_VERSION} />)
    expect(screen.queryByTitle('Form error')).toBeNull()
  })

  it('renders Toolbar and RenderForm child components on default', () => {
    render(<App appVersion={TEST_APP_VERSION} />)
    expect(Toolbar).toHaveBeenCalled()
    expect(RenderForm).toHaveBeenCalled()
  })

  it('catches and displays error when unable to render form', () => {
    jest.spyOn(console, 'error').mockImplementation(() => jest.fn())
    RenderForm.mockImplementation(() => { throw new Error('Unable to render form') })
    render(<App appVersion={TEST_APP_VERSION} />)
    expect(RenderForm).toThrow('Unable to render form')
    expect(screen.getByTitle('Form error')).toBeVisible()
  })
})

describe('handleRehydrate', () => {
  beforeEach(() => {
    jest.spyOn(schemaFetchers, 'fetchSchemasfromS3').mockResolvedValue([])
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
    jest.spyOn(fileUtils, 'readFromJSONFile').mockResolvedValue(SAMPLE_FILE_DATA)
    jest.spyOn(schemaFetchers, 'findSchemaFromData').mockReturnValue(MOCK_MATCHED_SCHEMA_DEF)
    jest.spyOn(global, 'fetch').mockResolvedValue({ json: () => MOCK_FETCHED_SCHEMA_JSON })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('reads and validates from JSON file and updates state based on contents', async () => {
    render(<App appVersion={TEST_APP_VERSION} />)
    fireEvent.click(await screen.findByTestId('test-autofill-btn'))

    expect(fileUtils.readFromJSONFile).toHaveBeenCalledTimes(1)
    expect(await screen.findByText(MOCK_MATCHED_SCHEMA_DEF.type)).toBeVisible()
    expect(await screen.findByText(JSON.stringify(SAMPLE_FILE_DATA))).toBeVisible()
  })
})
