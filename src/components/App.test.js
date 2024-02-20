import React from 'react'
import { render, screen } from '@testing-library/react'
import App from './App'
import Toolbar from './Toolbar'
import RenderForm from './RenderForm'

const testAppVersion = '0.1.0'
jest.mock('./Toolbar', () => jest.fn())
jest.mock('./RenderForm', () => jest.fn())

describe('App component', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders without crashing', () => {
    render(<App appVersion={testAppVersion} />)
    expect(screen.queryByTitle('Form error')).toBeNull()
  })

  it('renders Toolbar and RenderForm child components on default', () => {
    render(<App appVersion={testAppVersion} />)
    expect(Toolbar).toHaveBeenCalled()
    expect(RenderForm).toHaveBeenCalled()
  })

  it('catches and displays error when unable to render form', () => {
    jest.spyOn(console, 'error').mockImplementation(() => jest.fn())
    RenderForm.mockImplementation(() => { throw new Error('Unable to render form') })
    render(<App appVersion={testAppVersion} />)
    expect(RenderForm).toThrow('Unable to render form')
    expect(screen.getByTitle('Form error')).toBeVisible()
  })
})
