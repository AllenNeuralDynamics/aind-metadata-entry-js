import { render, screen } from '@testing-library/react'
import { getLinkAsButton } from './uiUtils'

describe('uiUtils', () => {
  describe('getLinkAsButton', () => {
    const PLACEHOLDER_URL = 'https://example.com'
    const PLACEHOLDER_TEXT = 'Example Link'
    const PLACEHOLDER_TOOLTIP = 'This is an example link'
    test('should return an <a> element with the correct attributes on default', () => {
      const linkElement = getLinkAsButton(PLACEHOLDER_URL, PLACEHOLDER_TEXT)
      render(linkElement)
      expect(screen.getByText(PLACEHOLDER_TEXT)).toBeInTheDocument()
      expect(screen.getByText(PLACEHOLDER_TEXT)).toHaveAttribute('href', PLACEHOLDER_URL)
      expect(screen.getByText(PLACEHOLDER_TEXT)).not.toHaveAttribute('title', PLACEHOLDER_TOOLTIP)
      expect(screen.getByText(PLACEHOLDER_TEXT)).toHaveAttribute('target', '_blank')
      expect(screen.getByText(PLACEHOLDER_TEXT)).toHaveAttribute('rel', 'noreferrer')
      expect(screen.getByText(PLACEHOLDER_TEXT)).not.toHaveAttribute('type', 'button')
      expect(screen.getByText(PLACEHOLDER_TEXT)).not.toHaveClass('btn')
    })

    test('should return an <a> element with a tooltip if specified', () => {
      const linkElement = getLinkAsButton(PLACEHOLDER_URL, PLACEHOLDER_TEXT, PLACEHOLDER_TOOLTIP)
      render(linkElement)
      expect(screen.getByText(PLACEHOLDER_TEXT)).toBeInTheDocument()
      expect(screen.getByText(PLACEHOLDER_TEXT)).toHaveAttribute('title', PLACEHOLDER_TOOLTIP)
    })

    test('should return an <a> element with the correct button classes and type if displayAsButton is true', () => {
      const linkElement = getLinkAsButton(PLACEHOLDER_URL, PLACEHOLDER_TEXT, PLACEHOLDER_TOOLTIP, true)
      render(linkElement)
      expect(screen.getByText(PLACEHOLDER_TEXT)).toBeInTheDocument()
      expect(screen.getByText(PLACEHOLDER_TEXT)).toHaveAttribute('type', 'button')
      expect(screen.getByText(PLACEHOLDER_TEXT)).toHaveClass('btn btn-default')
    })
  })
})
