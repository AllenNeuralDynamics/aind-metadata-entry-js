import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import Form from '@rjsf/core'
import { widgets } from './CustomWidgets'
import validator from '@rjsf/validator-ajv8'

describe('CustomTextWidget', () => {
  it('renders a TextWidget', () => {
    const testSchema = {
      title: 'Test String Const',
      type: 'string'
    }
    render(<Form schema={testSchema}
      validator={validator}
      widgets={ { text: widgets.text } }
    />)
    expect(screen.getByLabelText('Test String Const')).toBeInTheDocument()
  })

  it('adds const value into formData and renders const input as readonly', () => {
    const testSchema = {
      title: 'Test String Const',
      const: 'const example string value',
      type: 'string'
    }
    render(<Form schema={testSchema}
      validator={validator}
      widgets={ { text: widgets.text } }
      onSubmit={({ formData }) => {
        expect(formData).toEqual('const example string value')
      }
    }
    />)
    expect(screen.getByDisplayValue('const example string value')).toBeInTheDocument()
    expect(screen.getByDisplayValue('const example string value')).toHaveAttribute('readonly')
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))
  })
})

describe('CustomSelectWidget', () => {
  it('Does not render a SelectWidget', () => {
    const testSchema = {
      title: 'Test Number/String',
      type: 'object',
      anyOf: [
        {
          type: 'number',
          title: 'number'
        },
        {
          type: 'string',
          title: 'string'
        }
      ]
    }
    render(<Form schema={testSchema}
      validator={validator}
      widgets={ { select: widgets.select } }
    />)
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
  })

  it('Does render a SelectWidget', () => {
    const testSchema = {
      title: 'Test String/Null',
      type: 'object',
      anyOf: [
        {
          type: 'null',
          title: 'null'
        },
        {
          type: 'string',
          title: 'string'
        }
      ]
    }
    render(<Form schema={testSchema}
      validator={validator}
      widgets={ { select: widgets.select } }
    />)
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('Changes options of a SelectWidget', () => {
    const testSchema = {
      title: 'Test Number/String/Null',
      type: 'object',
      anyOf: [
        {
          type: 'number',
          title: 'number'
        },
        {
          type: 'string',
          title: 'string'
        },
        {
          type: 'null',
          title: 'null'
        }
      ]
    }
    render(<Form schema={testSchema}
      validator={validator}
      widgets={ { select: widgets.select } }
    />)
    expect(screen.getByRole('combobox')).not.toHaveValue("string")

  })

})
