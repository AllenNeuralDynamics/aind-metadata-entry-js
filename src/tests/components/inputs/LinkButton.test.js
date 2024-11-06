import React from 'react'
import { render, screen } from '@testing-library/react'
import LinkButton from '../../../components/inputs/LinkButton'

describe('LinkButton', () => {
  const PLACEHOLDER_URL = 'https://example.com'
  const PLACEHOLDER_TEXT = 'Example Link'
  const PLACEHOLDER_TOOLTIP = 'This is an example link'

  test('should return an <a> element with the correct attributes on default', () => {
    render(<LinkButton url={PLACEHOLDER_URL} text={PLACEHOLDER_TEXT} />)
    expect(screen.getByText(PLACEHOLDER_TEXT)).toBeInTheDocument()
    expect(screen.getByText(PLACEHOLDER_TEXT)).toHaveAttribute('href', PLACEHOLDER_URL)
    expect(screen.getByText(PLACEHOLDER_TEXT)).not.toHaveAttribute('title', PLACEHOLDER_TOOLTIP)
    expect(screen.getByText(PLACEHOLDER_TEXT)).toHaveAttribute('target', '_blank')
    expect(screen.getByText(PLACEHOLDER_TEXT)).toHaveAttribute('rel', 'noreferrer')
    expect(screen.getByText(PLACEHOLDER_TEXT)).not.toHaveAttribute('type', 'button')
    expect(screen.getByText(PLACEHOLDER_TEXT)).not.toHaveClass('btn')
  })

  test('should return an <a> element with a tooltip if specified', () => {
    render(<LinkButton url={PLACEHOLDER_URL} text={PLACEHOLDER_TEXT} tooltip={PLACEHOLDER_TOOLTIP} />)
    expect(screen.getByText(PLACEHOLDER_TEXT)).toBeInTheDocument()
    expect(screen.getByText(PLACEHOLDER_TEXT)).toHaveAttribute('title', PLACEHOLDER_TOOLTIP)
  })

  test('should return an <a> element with the correct button classes and type if displayAsButton is true', () => {
    render(<LinkButton url={PLACEHOLDER_URL} text={PLACEHOLDER_TEXT} displayAsButton />)
    expect(screen.getByText(PLACEHOLDER_TEXT)).toBeInTheDocument()
    expect(screen.getByText(PLACEHOLDER_TEXT)).toHaveAttribute('type', 'button')
    expect(screen.getByText(PLACEHOLDER_TEXT)).toHaveClass('btn btn-default')
  })
})
