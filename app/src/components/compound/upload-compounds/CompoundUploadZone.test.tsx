import { render, screen } from '@testing-library/react'
import CompoundUploadZone from './CompoundUploadZone'

vi.mock('react-dropzone', () => ({
    useDropzone: vi.fn(),
}))

import { useDropzone } from 'react-dropzone'

describe('CompoundUploadZone', () => {
    const mockOnDrop = vi.fn()
    const mockGetRootProps = vi.fn(() => ({
        onClick: vi.fn(),
        onDragOver: vi.fn(),
        onDragEnter: vi.fn(),
        onDragLeave: vi.fn(),
        onDrop: vi.fn(),
    }))
    const mockGetInputProps = vi.fn(() => ({
        onChange: vi.fn(),
        onClick: vi.fn(),
        accept: '.csv,.xls',
    }))

    beforeEach(() => {
        vi.clearAllMocks()
        vi.mocked(useDropzone).mockReturnValue({
            getRootProps: mockGetRootProps,
            getInputProps: mockGetInputProps,
            isDragActive: false,
            isDragAccept: false,
            isDragReject: false,
            open: vi.fn(),
        } as any)
    })

    it('should render upload zone when not uploading', () => {
        render(<CompoundUploadZone onDrop={mockOnDrop} uploading={false} />)

        expect(
            screen.getByText('No project compounds found')
        ).toBeInTheDocument()
        expect(
            screen.getByText('Please upload compound files to get started')
        ).toBeInTheDocument()
        expect(
            screen.getByText('Drag & drop files here or click to browse')
        ).toBeInTheDocument()
        expect(screen.getByText('Supported formats: CSV')).toBeInTheDocument()
    })

    it('should render loading state when uploading', () => {
        render(<CompoundUploadZone onDrop={mockOnDrop} uploading={true} />)

        expect(screen.getByText('Uploading compounds...')).toBeInTheDocument()
        expect(
            screen.getByText('Please wait while we process your file')
        ).toBeInTheDocument()
        expect(
            screen.queryByText('Drag & drop files here or click to browse')
        ).not.toBeInTheDocument()
    })

    it('should show CloudUploadIcon when not uploading', () => {
        render(<CompoundUploadZone onDrop={mockOnDrop} uploading={false} />)

        const icon = screen.getByTestId('CloudUploadIcon')
        expect(icon).toBeInTheDocument()
    })

    it('should show CircularProgress when uploading', () => {
        render(<CompoundUploadZone onDrop={mockOnDrop} uploading={true} />)

        const progress = screen.getByRole('progressbar')
        expect(progress).toBeInTheDocument()
    })

    it('should call useDropzone with correct props when not uploading', () => {
        render(<CompoundUploadZone onDrop={mockOnDrop} uploading={false} />)

        expect(useDropzone).toHaveBeenCalledWith({
            onDrop: mockOnDrop,
            accept: {
                'text/csv': ['.csv'],
                'application/vnd.ms-excel': ['.xls'],
            },
            disabled: false,
        })
    })

    it('should call useDropzone with disabled=true when uploading', () => {
        render(<CompoundUploadZone onDrop={mockOnDrop} uploading={true} />)

        expect(useDropzone).toHaveBeenCalledWith({
            onDrop: mockOnDrop,
            accept: {
                'text/csv': ['.csv'],
                'application/vnd.ms-excel': ['.xls'],
            },
            disabled: true,
        })
    })

    it('should display drag active message when isDragActive is true', () => {
        vi.mocked(useDropzone).mockReturnValue({
            getRootProps: mockGetRootProps,
            getInputProps: mockGetInputProps,
            isDragActive: true,
            isDragAccept: false,
            isDragReject: false,
            open: vi.fn(),
        } as any)

        render(<CompoundUploadZone onDrop={mockOnDrop} uploading={false} />)

        expect(
            screen.getByText('Drop files here to upload...')
        ).toBeInTheDocument()
        expect(
            screen.queryByText('Please upload compound files to get started')
        ).not.toBeInTheDocument()
    })

    it('should apply getRootProps to the Box component', () => {
        render(<CompoundUploadZone onDrop={mockOnDrop} uploading={false} />)

        expect(mockGetRootProps).toHaveBeenCalled()
    })

    it('should apply getInputProps to the input element', () => {
        render(<CompoundUploadZone onDrop={mockOnDrop} uploading={false} />)

        expect(mockGetInputProps).toHaveBeenCalled()
    })

    it('should render input element', () => {
        const { container } = render(
            <CompoundUploadZone onDrop={mockOnDrop} uploading={false} />
        )

        const input = container.querySelector('input')
        expect(input).toBeInTheDocument()
    })
})
