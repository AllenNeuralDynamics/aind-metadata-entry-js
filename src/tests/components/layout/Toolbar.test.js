import React from 'react'
import { render, screen } from '@testing-library/react'
import Toolbar from '../../../components/layout/Toolbar'

describe('Toolbar', () => {
  it('renders a toolbar with correct styling and child components', () => {
    render(<Toolbar><div>test</div></Toolbar>)
    expect(screen.getByRole('toolbar')).toBeInTheDocument()
    expect(screen.getByRole('toolbar')).toHaveClass('btn-toolbar')
    expect(screen.getByText('test')).toBeInTheDocument()
  })
})
