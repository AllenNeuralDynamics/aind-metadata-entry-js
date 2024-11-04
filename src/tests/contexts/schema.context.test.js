import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import * as fileHelpers from '../../utils/helpers/file.helpers'
import * as schemaFetchers from '../../utils/helpers/schema.helpers'
import { SchemaContext, SchemaContextProvider } from '../../contexts/schema.context'

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

describe('SchemaContextProvider', () => {
  beforeEach(() => {
    jest.spyOn(schemaFetchers, 'fetchAndFilterSchemasAsync').mockResolvedValue([])
    jest.spyOn(global, 'fetch').mockResolvedValue({ json: () => MOCK_FETCHED_SCHEMA_JSON })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('provides correct default states', () => {
    const expectedDefaultStates = {
      formData: null,
      schema: null,
      selectedSchemaType: '',
      selectedSchemaPath: '',
      schemaList: []
    }
    const mockChildComponent = (values) => (
      <span>{JSON.stringify(values)}</span>
    )
    render(
      <SchemaContextProvider>
        <SchemaContext.Consumer>{mockChildComponent}</SchemaContext.Consumer>
      </SchemaContextProvider>
    )
    expect(screen.getByText(
      JSON.stringify(expectedDefaultStates)
    )).toBeVisible()
  })

  it('fetches and filters schemas on mount', () => {
    render(
      <SchemaContextProvider>
        <SchemaContext.Consumer>{() => null}</SchemaContext.Consumer>
      </SchemaContextProvider>
    )
    expect(schemaFetchers.fetchAndFilterSchemasAsync).toHaveBeenCalledTimes(1)
  })

  describe('handleRehydrate', () => {
    it('reads and validates from JSON file and updates state based on contents', async () => {
      // child component to trigger handleRehydrate and display state changes
      const mockChildComponent = ({ selectedSchemaType, handleRehydrate, formData }) => (
        <div>
          <button data-testid='test-autofill-btn' onClick={handleRehydrate}>Test Autofill Button</button >
          <span>{selectedSchemaType}</span>
          <div>{JSON.stringify(formData)}</div>
        </div>
      )
      // mock utils to return correct file data and matched schema
      jest.spyOn(fileHelpers, 'readFromJSONFile').mockResolvedValue(FILE_DATA)
      jest.spyOn(schemaFetchers, 'findSchemaFromFormData').mockReturnValue(MOCK_MATCHED_SCHEMA_DEF)
      render(
        <SchemaContextProvider>
          <SchemaContext.Consumer>{mockChildComponent}</SchemaContext.Consumer>
        </SchemaContextProvider>
      )
      fireEvent.click(await screen.findByTestId('test-autofill-btn'))

      expect(fileHelpers.readFromJSONFile).toHaveBeenCalledTimes(1)
      expect(await screen.findByText(MOCK_MATCHED_SCHEMA_DEF.type)).toBeVisible()
      expect(await screen.findByText(JSON.stringify(FILE_DATA))).toBeVisible()
    })
  })
})
