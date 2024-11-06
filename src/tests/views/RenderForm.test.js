import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import RenderForm from '../../views/RenderForm'
import { processSchemaContent } from '../../utils/helpers/schema.helpers'
import { saveToJSONFile } from '../../utils/helpers/file.helpers'
import SCHEMA_DISCRIMINATOR_EXTRA_DATA from '../resources/schemas/discriminator-extra-data.json'
import { toast } from 'react-toastify'
import { SchemaContext } from '../../contexts/schema.context'

const EXPECTED_PROMPT_TEXT = 'Please select a schema from the dropdown above or autofill data from an existing file.'
const SCHEMA_TYPE = 'test'
const SCHEMA = processSchemaContent(SCHEMA_DISCRIMINATOR_EXTRA_DATA)
const FORM_DATA = {
  sub_schema: {
    discriminator_property: 'Discriminator 1',
    extra_data_str: 'I should only exist in Option1'
  }
}

jest.mock('../../utils/helpers/file.helpers', () => ({ saveToJSONFile: jest.fn() }))
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn()
  }
}))

/**
 * Helper function to render RenderForm component with test context
 * @param {*} context - Context value to used in the test
 */
const renderWithContext = (context) => {
  render(
    <SchemaContext.Provider value={context}>
      <RenderForm/>
    </SchemaContext.Provider>
  )
}

describe('RenderForm component', () => {
  it('renders prompt on default if no schema is provided', () => {
    renderWithContext({ selectedSchemaType: SCHEMA_TYPE })
    expect(screen.getByText(EXPECTED_PROMPT_TEXT)).toBeVisible()
    expect(screen.queryByRole('button', { name: 'Submit' })).toBeNull()
  })

  it('renders with provided schema and formData on default', () => {
    renderWithContext({ selectedSchemaType: SCHEMA_TYPE, schema: SCHEMA, formData: FORM_DATA })
    expect(screen.queryByText(EXPECTED_PROMPT_TEXT)).toBeNull()
    expect(screen.getByRole('button', { name: 'Submit' })).toBeVisible()
    expect(screen.getByText(SCHEMA.title)).toBeVisible()
    expect(screen.getByLabelText('Extra Data String')).toHaveValue(FORM_DATA.sub_schema.extra_data_str)
  })

  it('saves form data on submit', () => {
    renderWithContext({ selectedSchemaType: SCHEMA_TYPE, schema: SCHEMA, formData: FORM_DATA })
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
    const formData = saveToJSONFile.mock.calls[0][0]
    expect(formData).toEqual(FORM_DATA)
  })

  it('validates formData when Validate button is clicked', () => {
    // if invalid data, focus on the first error
    jest.spyOn(console, 'error').mockImplementation(() => jest.fn())
    const invalidFormData = {
      sub_schema: {
        discriminator_property: 'Discriminator 1',
        extra_data_str: 123
      }
    }
    renderWithContext({ selectedSchemaType: SCHEMA_TYPE, schema: SCHEMA, formData: invalidFormData })
    fireEvent.click(screen.getByRole('button', { name: 'Validate' }))
    expect(screen.getByText('Errors')).toBeVisible()
    expect(screen.getByText('.sub_schema.extra_data_str: \'Extra Data String\' must be string')).toBeVisible()
  })

  it('shows a success message when form data is validated with no errors', () => {
    // if valid data, show success message
    renderWithContext({ selectedSchemaType: SCHEMA_TYPE, schema: SCHEMA, formData: FORM_DATA })
    fireEvent.click(screen.getByRole('button', { name: 'Validate' }))
    expect(toast.success).toHaveBeenCalledWith('Form is valid. Ready to submit!')
  })

  it('omits extra data on validate', () => {
    renderWithContext({ selectedSchemaType: SCHEMA_TYPE, schema: SCHEMA, formData: FORM_DATA })
    // Select Option2, which should clear extra_data_str from initial formData
    const option2Val = screen.getByRole('option', { name: 'Option2' }).value
    fireEvent.change(screen.getByDisplayValue('Option1'), { target: { value: option2Val } })
    fireEvent.click(screen.getByRole('button', { name: 'Validate' }))
    expect(screen.queryByText('Errors')).toBeNull()
  })

  it('omits extra data on submit', () => {
    renderWithContext({ selectedSchemaType: SCHEMA_TYPE, schema: SCHEMA, formData: FORM_DATA })
    // Select Option2, which should clear extra_data_str from initial formData
    const option2Val = screen.getByRole('option', { name: 'Option2' }).value
    fireEvent.change(screen.getByDisplayValue('Option1'), { target: { value: option2Val } })
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
    const formData = saveToJSONFile.mock.calls[0][0]
    expect(formData.sub_schema).not.toHaveProperty('extra_data_str')
    expect(formData).toEqual({ sub_schema: { discriminator_property: 'Discriminator 2' } })
  })
})
