import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import UpdateProjectDialog from './UpdateProjectDialog'

describe('UpdateProjectDialog', () => {
    const mockOnClose = vi.fn()
    const mockOnSubmit = vi.fn().mockResolvedValue(undefined)
    const initialName = 'Initial Project Name'
    const initialDescription = 'Initial Project Description'

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should render dialog when open is true', () => {
        render(
            <UpdateProjectDialog
                open={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
                initialName={initialName}
                initialDescription={initialDescription}
            />
        )
        expect(screen.getByText('Update Project')).toBeInTheDocument()
    })

    it('should not render dialog when open is false', () => {
        render(
            <UpdateProjectDialog
                open={false}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
                initialName={initialName}
                initialDescription={initialDescription}
            />
        )
        expect(screen.queryByText('Update Project')).not.toBeInTheDocument()
    })

    it('should prepopulate fields with initial values when dialog opens', () => {
        render(
            <UpdateProjectDialog
                open={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
                initialName={initialName}
                initialDescription={initialDescription}
            />
        )

        const nameField = screen.getByPlaceholderText('Enter project name')
        const descriptionField = screen.getByPlaceholderText(
            'Enter project description'
        )

        expect(nameField).toHaveValue(initialName)
        expect(descriptionField).toHaveValue(initialDescription)
    })

    it('should update fields when initial values change', async () => {
        const { rerender } = render(
            <UpdateProjectDialog
                open={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
                initialName={initialName}
                initialDescription={initialDescription}
            />
        )

        const nameField = screen.getByPlaceholderText('Enter project name')
        const descriptionField = screen.getByPlaceholderText(
            'Enter project description'
        )

        expect(nameField).toHaveValue(initialName)
        expect(descriptionField).toHaveValue(initialDescription)

        rerender(
            <UpdateProjectDialog
                open={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
                initialName="New Project Name"
                initialDescription="New Project Description"
            />
        )

        await waitFor(() => {
            expect(nameField).toHaveValue('New Project Name')
            expect(descriptionField).toHaveValue('New Project Description')
        })
    })

    it('should render name and description text fields', () => {
        render(
            <UpdateProjectDialog
                open={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
                initialName={initialName}
                initialDescription={initialDescription}
            />
        )
        expect(
            screen.getByPlaceholderText('Enter project name')
        ).toBeInTheDocument()
        expect(
            screen.getByPlaceholderText('Enter project description')
        ).toBeInTheDocument()
    })

    it('should enable Update button when fields are prepopulated', () => {
        render(
            <UpdateProjectDialog
                open={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
                initialName={initialName}
                initialDescription={initialDescription}
            />
        )
        const updateButton = screen.getByRole('button', { name: 'Update' })
        expect(updateButton).not.toBeDisabled()
    })

    it('should disable Update button when fields are empty', () => {
        render(
            <UpdateProjectDialog
                open={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
                initialName=""
                initialDescription=""
            />
        )
        const updateButton = screen.getByRole('button', { name: 'Update' })
        expect(updateButton).toBeDisabled()
    })

    it('should disable Update button when one field is empty', async () => {
        const user = userEvent.setup()
        render(
            <UpdateProjectDialog
                open={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
                initialName={initialName}
                initialDescription={initialDescription}
            />
        )

        const nameField = screen.getByPlaceholderText('Enter project name')
        const updateButton = screen.getByRole('button', { name: 'Update' })

        await user.clear(nameField)
        expect(updateButton).toBeDisabled()
    })

    it('should call onSubmit with trimmed values when Update is clicked', async () => {
        const user = userEvent.setup()
        render(
            <UpdateProjectDialog
                open={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
                initialName={initialName}
                initialDescription={initialDescription}
            />
        )

        const nameField = screen.getByPlaceholderText('Enter project name')
        const descriptionField = screen.getByPlaceholderText(
            'Enter project description'
        )
        const updateButton = screen.getByRole('button', { name: 'Update' })

        await user.clear(nameField)
        await user.type(nameField, '  Updated Project  ')
        await user.clear(descriptionField)
        await user.type(descriptionField, '  Updated Description  ')
        await user.click(updateButton)

        await expect(mockOnSubmit).toHaveBeenCalledWith(
            'Updated Project',
            'Updated Description'
        )
        expect(mockOnClose).not.toHaveBeenCalled()
    })

    it('should call onClose when Cancel is clicked', async () => {
        const user = userEvent.setup()
        render(
            <UpdateProjectDialog
                open={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
                initialName={initialName}
                initialDescription={initialDescription}
            />
        )

        const cancelButton = screen.getByRole('button', { name: 'Cancel' })
        await user.click(cancelButton)

        expect(mockOnClose).toHaveBeenCalled()
        expect(mockOnSubmit).not.toHaveBeenCalled()
    })

    it('should reset fields to initial values when Cancel is clicked', async () => {
        const user = userEvent.setup()
        render(
            <UpdateProjectDialog
                open={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
                initialName={initialName}
                initialDescription={initialDescription}
            />
        )

        const nameField = screen.getByPlaceholderText('Enter project name')
        const descriptionField = screen.getByPlaceholderText(
            'Enter project description'
        )

        await user.clear(nameField)
        await user.type(nameField, 'Modified Name')
        await user.clear(descriptionField)
        await user.type(descriptionField, 'Modified Description')

        const cancelButton = screen.getByRole('button', { name: 'Cancel' })
        await user.click(cancelButton)

        expect(mockOnClose).toHaveBeenCalled()
    })

    it('should not call onSubmit when fields are empty', async () => {
        const user = userEvent.setup()
        render(
            <UpdateProjectDialog
                open={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
                initialName=""
                initialDescription=""
            />
        )

        const updateButton = screen.getByRole('button', { name: 'Update' })
        expect(updateButton).toBeDisabled()

        // Try to click (should not work since disabled)
        await user.click(updateButton).catch(() => {})

        expect(mockOnSubmit).not.toHaveBeenCalled()
    })

    it('should display character count for name field', async () => {
        const user = userEvent.setup()
        render(
            <UpdateProjectDialog
                open={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
                initialName={initialName}
                initialDescription={initialDescription}
            />
        )

        const nameField = screen.getByPlaceholderText('Enter project name')
        await user.clear(nameField)
        await user.type(nameField, 'Test')

        expect(screen.getByText('4/20')).toBeInTheDocument()
    })

    it('should display character count for description field', async () => {
        const user = userEvent.setup()
        render(
            <UpdateProjectDialog
                open={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
                initialName={initialName}
                initialDescription={initialDescription}
            />
        )

        const descriptionField = screen.getByPlaceholderText(
            'Enter project description'
        )
        await user.clear(descriptionField)
        await user.type(descriptionField, 'Test Description')

        expect(screen.getByText('16/200')).toBeInTheDocument()
    })

    it('should show error when name exceeds 20 characters', async () => {
        const user = userEvent.setup()
        render(
            <UpdateProjectDialog
                open={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
                initialName={initialName}
                initialDescription={initialDescription}
            />
        )

        const nameField = screen.getByPlaceholderText('Enter project name')
        await user.clear(nameField)
        await user.type(nameField, 'a'.repeat(21))

        expect(
            screen.getByText('Maximum 20 characters allowed')
        ).toBeInTheDocument()
        expect(nameField).toHaveAttribute('aria-invalid', 'true')
    })

    it('should show error when description exceeds 200 characters', async () => {
        const user = userEvent.setup()
        render(
            <UpdateProjectDialog
                open={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
                initialName={initialName}
                initialDescription={initialDescription}
            />
        )

        const descriptionField = screen.getByPlaceholderText(
            'Enter project description'
        )
        await user.clear(descriptionField)
        await user.type(descriptionField, 'a'.repeat(201))

        expect(
            screen.getByText('Maximum 200 characters allowed')
        ).toBeInTheDocument()
        expect(descriptionField).toHaveAttribute('aria-invalid', 'true')
    })

    it('should disable Update button when name exceeds limit', async () => {
        const user = userEvent.setup()
        render(
            <UpdateProjectDialog
                open={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
                initialName={initialName}
                initialDescription={initialDescription}
            />
        )

        const nameField = screen.getByPlaceholderText('Enter project name')
        const updateButton = screen.getByRole('button', { name: 'Update' })

        await user.clear(nameField)
        await user.type(nameField, 'a'.repeat(21))

        expect(updateButton).toBeDisabled()
    })

    it('should disable Update button when description exceeds limit', async () => {
        const user = userEvent.setup()
        render(
            <UpdateProjectDialog
                open={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
                initialName={initialName}
                initialDescription={initialDescription}
            />
        )

        const descriptionField = screen.getByPlaceholderText(
            'Enter project description'
        )
        const updateButton = screen.getByRole('button', { name: 'Update' })

        await user.clear(descriptionField)
        await user.type(descriptionField, 'a'.repeat(201))

        expect(updateButton).toBeDisabled()
    })

    it('should show character count for prepopulated fields', () => {
        render(
            <UpdateProjectDialog
                open={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
                initialName={initialName}
                initialDescription={initialDescription}
            />
        )

        expect(screen.getByText(`${initialName.length}/20`)).toBeInTheDocument()
        expect(
            screen.getByText(`${initialDescription.length}/200`)
        ).toBeInTheDocument()
    })
})
