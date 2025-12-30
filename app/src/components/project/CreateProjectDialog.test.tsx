import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CreateProjectDialog from './CreateProjectDialog'

describe('CreateProjectDialog', () => {
    const mockOnClose = vi.fn()
    const mockOnSubmit = vi.fn()

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should render dialog when open is true', () => {
        render(
            <CreateProjectDialog
                open={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
            />
        )
        expect(screen.getByText('Create New Project')).toBeInTheDocument()
    })

    it('should not render dialog when open is false', () => {
        render(
            <CreateProjectDialog
                open={false}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
            />
        )
        expect(screen.queryByText('Create New Project')).not.toBeInTheDocument()
    })

    it('should render name and description text fields', () => {
        render(
            <CreateProjectDialog
                open={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
            />
        )
        expect(
            screen.getByPlaceholderText('Enter project name')
        ).toBeInTheDocument()
        expect(
            screen.getByPlaceholderText('Enter project description')
        ).toBeInTheDocument()
    })

    it('should have placeholder text in text fields', () => {
        render(
            <CreateProjectDialog
                open={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
            />
        )
        expect(
            screen.getByPlaceholderText('Enter project name')
        ).toBeInTheDocument()
        expect(
            screen.getByPlaceholderText('Enter project description')
        ).toBeInTheDocument()
    })

    it('should disable Create button when fields are empty', () => {
        render(
            <CreateProjectDialog
                open={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
            />
        )
        const createButton = screen.getByRole('button', { name: 'Create' })
        expect(createButton).toBeDisabled()
    })

    it('should enable Create button when both fields are filled', async () => {
        const user = userEvent.setup()
        render(
            <CreateProjectDialog
                open={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
            />
        )

        const nameField = screen.getByPlaceholderText('Enter project name')
        const descriptionField = screen.getByPlaceholderText(
            'Enter project description'
        )

        await user.type(nameField, 'Test Project')
        await user.type(descriptionField, 'Test Description')

        const createButton = screen.getByRole('button', { name: 'Create' })
        expect(createButton).not.toBeDisabled()
    })

    it('should call onSubmit with trimmed values when Create is clicked', async () => {
        const user = userEvent.setup()
        render(
            <CreateProjectDialog
                open={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
            />
        )

        const nameField = screen.getByPlaceholderText('Enter project name')
        const descriptionField = screen.getByPlaceholderText(
            'Enter project description'
        )
        const createButton = screen.getByRole('button', { name: 'Create' })

        await user.type(nameField, '  Test Project  ')
        await user.type(descriptionField, '  Test Description  ')
        await user.click(createButton)

        expect(mockOnSubmit).toHaveBeenCalledWith(
            'Test Project',
            'Test Description'
        )
        expect(mockOnClose).toHaveBeenCalled()
    })

    it('should call onClose when Cancel is clicked', async () => {
        const user = userEvent.setup()
        render(
            <CreateProjectDialog
                open={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
            />
        )

        const cancelButton = screen.getByRole('button', { name: 'Cancel' })
        await user.click(cancelButton)

        expect(mockOnClose).toHaveBeenCalled()
        expect(mockOnSubmit).not.toHaveBeenCalled()
    })

    it('should clear form fields after submit', async () => {
        const user = userEvent.setup()
        render(
            <CreateProjectDialog
                open={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
            />
        )

        const nameField = screen.getByPlaceholderText('Enter project name')
        const descriptionField = screen.getByPlaceholderText(
            'Enter project description'
        )
        const createButton = screen.getByRole('button', { name: 'Create' })

        await user.type(nameField, 'Test Project')
        await user.type(descriptionField, 'Test Description')
        await user.click(createButton)

        expect(nameField).toHaveValue('')
        expect(descriptionField).toHaveValue('')
    })
})
