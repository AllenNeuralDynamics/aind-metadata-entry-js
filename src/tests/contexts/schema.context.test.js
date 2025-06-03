import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { toast } from 'react-toastify'
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
      loading: false,
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

  describe('fetchAndSetSchema and updateSelectedSchemaVersion', () => {
    it('fetches and sets schema based on schema path', async () => {
      const mockChildComponent = ({ selectedSchemaPath, updateSelectedSchemaVersion }) => (
        <div>
          <button data-testid='test-update-schema-version-btn' onClick={() => updateSelectedSchemaVersion('test_type_1.py')}>Update Schema Version</button >
          <span>{selectedSchemaPath ? `Schema path: ${selectedSchemaPath}` : 'No schema path'}</span>
        </div>
      )
      render(
        <SchemaContextProvider>
          <SchemaContext.Consumer>{mockChildComponent}</SchemaContext.Consumer>
        </SchemaContextProvider>
      )
      await fireEvent.click(await screen.findByTestId('test-update-schema-version-btn'))
      expect(global.fetch).toHaveBeenCalledTimes(1)
      expect(await screen.findByText('Schema path: test_type_1.py')).toBeVisible()
    })

    it('handles errors when fetching schema', async () => {
      // fetch will throw an error
      jest.spyOn(global, 'fetch').mockRejectedValue(new Error('Failed to fetch schema'))
      jest.spyOn(toast, 'error').mockImplementation(() => null)
      jest.spyOn(console, 'error').mockImplementation(() => null)
      const mockChildComponent = ({ selectedSchemaPath, updateSelectedSchemaVersion }) => (
        <div>
          <button data-testid='test-update-schema-version-btn' onClick={() => updateSelectedSchemaVersion('test_type_1.py')}>Update Schema Version</button >
          <span>{selectedSchemaPath ? `Schema path: ${selectedSchemaPath}` : 'No schema path'}</span>
        </div>
      )
      render(
        <SchemaContextProvider>
          <SchemaContext.Consumer>{mockChildComponent}</SchemaContext.Consumer>
        </SchemaContextProvider>
      )
      await fireEvent.click(await screen.findByTestId('test-update-schema-version-btn'))
      expect(global.fetch).toHaveBeenCalledTimes(1)
      expect(await screen.findByText('No schema path')).toBeVisible()
    })

    it('handles errors when processing schema', async () => {
      // processSchemaContent will throw an error
      jest.spyOn(schemaFetchers, 'processSchemaContent').mockImplementation(() => {
        throw new Error('Failed to process schema')
      })
      jest.spyOn(toast, 'warn').mockImplementation(() => null)
      jest.spyOn(console, 'error').mockImplementation(() => null)
      const mockChildComponent = ({ selectedSchemaPath, updateSelectedSchemaVersion }) => (
        <div>
          <button data-testid='test-update-schema-version-btn' onClick={() => updateSelectedSchemaVersion('test_type_1.py')}>Update Schema Version</button >
          <span>{selectedSchemaPath ? `Schema path: ${selectedSchemaPath}` : 'No schema path'}</span>
        </div>
      )
      render(
        <SchemaContextProvider>
          <SchemaContext.Consumer>{mockChildComponent}</SchemaContext.Consumer>
        </SchemaContextProvider>
      )
      await fireEvent.click(await screen.findByTestId('test-update-schema-version-btn'))
      expect(global.fetch).toHaveBeenCalledTimes(1)
      expect(await screen.findByText('No schema path')).toBeVisible()
    })
  })

  describe('handleRehydrate', () => {
    it('reads and validates from JSON file and updates state based on contents', async () => {
      // child component to trigger handleRehydrate and display state changes
      const mockChildComponent = ({ selectedSchemaType, handleRehydrate, formData }) => (
        <div>
          <button data-testid='test-autofill-btn' onClick={handleRehydrate}>Test Autofill Button</button >
          <span>{selectedSchemaType ? `Schema type: ${selectedSchemaType}` : 'No schema type'}</span>
          <div>{formData ? JSON.stringify(formData) : 'No form data'}</div>
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
      expect(await screen.findByText(`Schema type: ${MOCK_MATCHED_SCHEMA_DEF.type}`)).toBeVisible()
      expect(await screen.findByText(JSON.stringify(FILE_DATA))).toBeVisible()
    })

    it('handles errors when reading from JSON file', async () => {
      // child component to trigger handleRehydrate and display state changes
      const mockChildComponent = ({ selectedSchemaType, handleRehydrate, formData }) => (
        <div>
          <button data-testid='test-autofill-btn' onClick={handleRehydrate}>Test Autofill Button</button >
          <span>{selectedSchemaType ? `Schema type: ${selectedSchemaType}` : 'No schema type'}</span>
          <div>{formData ? JSON.stringify(formData) : 'No form data'}</div>
        </div>
      )
      // mock utils to throw error when reading from JSON file
      jest.spyOn(fileHelpers, 'readFromJSONFile').mockRejectedValue(new Error('File not found'))
      render(
        <SchemaContextProvider>
          <SchemaContext.Consumer>{mockChildComponent}</SchemaContext.Consumer>
        </SchemaContextProvider>
      )
      fireEvent.click(await screen.findByTestId('test-autofill-btn'))

      expect(fileHelpers.readFromJSONFile).toHaveBeenCalledTimes(1)
      expect(await screen.findByText('No schema type')).toBeVisible()
      expect(await screen.findByText('No form data')).toBeVisible()
    })
  })
})
