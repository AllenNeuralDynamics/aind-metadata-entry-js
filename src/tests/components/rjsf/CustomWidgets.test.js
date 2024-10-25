import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import Form from '@rjsf/core'
import { CustomWidgets } from '../../../components/rjsf/CustomWidgets'
import validator from '@rjsf/validator-ajv8'

describe('CustomTextWidget', () => {
  it('renders a TextWidget', () => {
    const testSchema = {
      title: 'Test String Const',
      type: 'string'
    }
    render(<Form schema={testSchema}
      validator={validator}
      widgets={ { text: CustomWidgets.text } }
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
      widgets={ { text: CustomWidgets.text } }
      onSubmit={({ formData }) => {
        expect(formData).toEqual('const example string value')
      }
    }
    />)
    expect(screen.getByDisplayValue('const example string value')).toBeInTheDocument()
    expect(screen.getByDisplayValue('const example string value')).toHaveAttribute('readonly')
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))
  })

  it('only allows numerical and decimal input for decimal title', () => {
    const testSchema = {
      title: 'decimal',
      type: 'string'
    }
    render(<Form schema={testSchema}
      validator={validator}
      widgets={ { text: CustomWidgets.text } }
    />)
    expect(screen.getByLabelText('decimal')).toBeInTheDocument()
    const textbox = screen.getByLabelText('decimal')

    // check integer input
    fireEvent.change(textbox, { target: { value: '23' } })
    expect(textbox.value).toBe('23')

    // check decimal inputs
    fireEvent.change(textbox, { target: { value: '23.' } })
    expect(textbox.value).toBe('23.')

    fireEvent.change(textbox, { target: { value: '23.7' } })
    expect(textbox.value).toBe('23.7')

    fireEvent.change(textbox, { target: { value: '23.70000000' } })
    expect(textbox.value).toBe('23.70000000')

    fireEvent.change(textbox, { target: { value: '-23.7' } })
    expect(textbox.value).toBe('-23.7')

    fireEvent.change(textbox, { target: { value: '' } })
    fireEvent.change(textbox, { target: { value: '.7' } })
    expect(textbox.value).toBe('.7')

    // check letter values
    fireEvent.change(textbox, { target: { value: '' } })
    fireEvent.change(textbox, { target: { value: 'abc' } })
    expect(textbox.value).toBe('')

    fireEvent.change(textbox, { target: { value: '45abc' } })
    expect(textbox.value).toBe('')

    fireEvent.change(textbox, { target: { value: '45' } })
    fireEvent.change(textbox, { target: { value: '45abc' } })
    expect(textbox.value).toBe('45')
  })
})
