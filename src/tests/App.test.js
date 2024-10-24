import React from 'react'
import { render, screen } from '@testing-library/react'
import App from '../App'
import MetadataEntryPage from '../components/pages/MetadataEntryPage'

const TEST_APP_VERSION = '0.1.0'

jest.mock('../components/pages/MetadataEntryPage', () => jest.fn())

describe('App component', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders header without crashing', () => {
    render(<App appVersion={TEST_APP_VERSION} />)
    expect(screen.queryByText('AIND Metadata Entry')).toBeVisible()
    expect(screen.queryByText(new RegExp(TEST_APP_VERSION, 'i'))).toBeVisible()
  })

  it('renders metadata entry page on default', () => {
    render(<App appVersion={TEST_APP_VERSION} />)
    expect(MetadataEntryPage).toHaveBeenCalled()
  })
})
