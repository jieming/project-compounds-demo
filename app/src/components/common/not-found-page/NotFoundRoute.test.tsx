import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import NotFoundRoute from './NotFoundRoute'

describe('NotFoundRoute', () => {
    it('should render text 404 - Page not found', () => {
        render(
            <BrowserRouter>
                <NotFoundRoute />
            </BrowserRouter>
        )
        expect(screen.getByText('404 - Page not found')).toBeInTheDocument()
    })

    it('should render link to home', () => {
        render(
            <BrowserRouter>
                <NotFoundRoute />
            </BrowserRouter>
        )
        const link = screen.getByRole('link', { name: 'Go to home' })
        expect(link).toBeInTheDocument()
        expect(link).toHaveAttribute('href', '/')
    })
})
