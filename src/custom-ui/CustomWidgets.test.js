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
