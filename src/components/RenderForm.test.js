import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import RenderForm from './RenderForm'
import { preProcessSchema } from '../utilities/schemaHandlers'
import { saveToJSONFile } from '../utilities/fileUtils'
import SAMPLE_SCHEMA_EXTRA_DATA from '../testing/sample-schema-discriminator-extra-data.json'

const EXPECTED_PROMPT_TEXT = 'Please select a schema from the dropdown above or autofill data from an existing file.'
const SAMPLE_SCHEMA_TYPE = 'test'
const SAMPLE_SCHEMA = preProcessSchema(SAMPLE_SCHEMA_EXTRA_DATA)
const SAMPLE_FORM_DATA = {
  sub_schema: {
    discriminator_property: 'Discriminator 1',
    extra_data_str: 'I should only exist in Option1'
  }
}

jest.mock('../utilities/fileUtils', () => ({ saveToJSONFile: jest.fn() }))

describe('RenderForm component', () => {
  it('renders prompt on default if no schema is provided', () => {
    render(<RenderForm schemaType={SAMPLE_SCHEMA_TYPE} />)
    expect(screen.getByText(EXPECTED_PROMPT_TEXT)).toBeVisible()
    expect(screen.queryByRole('button', { name: 'Submit' })).toBeNull()
  })

  it('renders with provided schema and formData on default', () => {
    render(<RenderForm schemaType={SAMPLE_SCHEMA_TYPE} schema={SAMPLE_SCHEMA} formData={SAMPLE_FORM_DATA} />)
    expect(screen.queryByText(EXPECTED_PROMPT_TEXT)).toBeNull()
    expect(screen.getByRole('button', { name: 'Submit' })).toBeVisible()
    expect(screen.getByText(SAMPLE_SCHEMA.title)).toBeVisible()
    expect(screen.getByLabelText('Extra Data String')).toHaveValue(SAMPLE_FORM_DATA.sub_schema.extra_data_str)
  })

  it('saves form data on submit', () => {
    render(<RenderForm schemaType={SAMPLE_SCHEMA_TYPE} schema={SAMPLE_SCHEMA} formData={SAMPLE_FORM_DATA} />)
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
    const formData = saveToJSONFile.mock.calls[0][0]
    expect(formData).toEqual(SAMPLE_FORM_DATA)
  })

  it('omits extra data on blur events', () => {
    render(<RenderForm schemaType={SAMPLE_SCHEMA_TYPE} schema={SAMPLE_SCHEMA} formData={SAMPLE_FORM_DATA} />)
    // Select Option2, which should clear extra_data_str from initial formData
    const option2Val = screen.getByRole('option', { name: 'Option2' }).value
    fireEvent.change(screen.getByDisplayValue('Option1'), { target: { value: option2Val } })
    fireEvent.blur(screen.getByDisplayValue('Option2'))
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
    const formData = saveToJSONFile.mock.calls[0][0]
    expect(formData.sub_schema).not.toHaveProperty('extra_data_str')
    expect(formData).toEqual({ sub_schema: { discriminator_property: 'Discriminator 2' } })
  })
})
