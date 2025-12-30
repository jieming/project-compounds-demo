import { render, screen } from '@testing-library/react'
import LoadingIndicator from './LoadingIndicator'

describe('LoadingIndicator', () => {
    it('should render CircularProgress', () => {
        render(<LoadingIndicator />)
        const progress = screen.getByRole('progressbar')
        expect(progress).toBeInTheDocument()
    })

    it('should render CircularProgress with size 300', () => {
        render(<LoadingIndicator />)
        const progress = screen.getByRole('progressbar')
        expect(progress).toHaveAttribute(
            'style',
            expect.stringContaining('width: 300px')
        )
    })

    it('should render Box with centering styles', () => {
        const { container } = render(<LoadingIndicator />)
        const box = container.querySelector('.MuiBox-root')
        expect(box).toBeInTheDocument()
    })
})
