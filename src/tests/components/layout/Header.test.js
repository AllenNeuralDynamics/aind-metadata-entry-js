import React from 'react'
import { render, screen } from '@testing-library/react'
import Header from '../../../components/layout/Header'

describe('Header', () => {
  it('renders a header with a title and subtitle', () => {
    render(<Header title="Title" subtitle="Subtitle" />)
    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByText('Subtitle')).toBeInTheDocument()
  })

  it('can render subtitle as a node', () => {
    render(<Header title="Title" subtitle={<div>Subtitle<div>More info</div></div>} />)
    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByText('Subtitle')).toBeInTheDocument()
    expect(screen.getByText('More info')).toBeInTheDocument()
  })
})
