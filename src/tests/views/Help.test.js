import React from 'react'
import { render, screen } from '@testing-library/react'
import Help from '../../views/Help'
import { Header } from '../../components/layout'

jest.mock('../../utils/config', () => ({
  REPO_URL: 'https://github.com/repo',
  AIND_DATA_SCHEMA_REPO_URL: 'https://github.com/schema-repo',
  AIND_DATA_SCHEMA_READTHEDOCS_URL: 'https://schema-repo.readthedocs.io'
}))
jest.mock('../../components/layout/Header', () => jest.fn())

describe('Help component', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders a Help section and a Getting Started section', () => {
    render(<Help/>)
    expect(Header).toHaveBeenNthCalledWith(1, {
      titleClassName: 'h2 text-primary',
      title: 'Help',
      subtitle: expect.any(Object)
    }, {})
    expect(Header).toHaveBeenNthCalledWith(2, {
      titleClassName: 'h4',
      title: 'Getting started',
      subtitle: expect.any(Object)
    }, {})
  })

  it('renders correct links to repos and docs from Config', () => {
    Header.mockImplementation(({ title, subtitle }) => (<div>{title}{subtitle}</div>))
    render(<Help/>)
    expect(screen.getByText('GitHub repository')).toHaveAttribute('href', 'https://github.com/repo'.REPO_URL)
    expect(screen.getByText('Issues (bugs or feature requests)')).toHaveAttribute('href', 'https://github.com/repo/issues')
    expect(screen.getByText('Discussions')).toHaveAttribute('href', 'https://github.com/repo/discussions')
    expect(screen.getByText('aind-data-schema')).toHaveAttribute('href', 'https://github.com/schema-repo')
    expect(screen.getByText('readthedocs')).toHaveAttribute('href', 'https://schema-repo.readthedocs.io')
  })
})
