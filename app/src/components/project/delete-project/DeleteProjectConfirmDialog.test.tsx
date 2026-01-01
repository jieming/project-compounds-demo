import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DeleteProjectConfirmDialog from './DeleteProjectConfirmDialog'
import type { Project } from '../project-types'

describe('DeleteProjectConfirmDialog', () => {
    const mockOnClose = vi.fn()
    const mockOnConfirmDelete = vi.fn()
    const mockProject: Project = {
        id: '1',
        name: 'Test Project',
        description: 'Test Description',
    }

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should render dialog when open is true', () => {
        render(
            <DeleteProjectConfirmDialog
                dialogOpen={true}
                handleCloseDialog={mockOnClose}
                handleConfirmDelete={mockOnConfirmDelete}
                currentProject={mockProject}
            />
        )

        expect(screen.getByText('Delete Project')).toBeInTheDocument()
    })

    it('should not render dialog when open is false', () => {
        render(
            <DeleteProjectConfirmDialog
                dialogOpen={false}
                handleCloseDialog={mockOnClose}
                handleConfirmDelete={mockOnConfirmDelete}
                currentProject={mockProject}
            />
        )

        expect(screen.queryByText('Delete Project')).not.toBeInTheDocument()
    })

    it('should display project name in the message', () => {
        render(
            <DeleteProjectConfirmDialog
                dialogOpen={true}
                handleCloseDialog={mockOnClose}
                handleConfirmDelete={mockOnConfirmDelete}
                currentProject={mockProject}
            />
        )

        expect(screen.getByText(/Test Project/)).toBeInTheDocument()
    })

    it('should display warning messages about compounds being removed and action being irreversible', () => {
        render(
            <DeleteProjectConfirmDialog
                dialogOpen={true}
                handleCloseDialog={mockOnClose}
                handleConfirmDelete={mockOnConfirmDelete}
                currentProject={mockProject}
            />
        )

        expect(
            screen.getByText(
                /All project compounds will be removed. This action cannot be undone./
            )
        ).toBeInTheDocument()
    })

    it('should render Cancel button', () => {
        render(
            <DeleteProjectConfirmDialog
                dialogOpen={true}
                handleCloseDialog={mockOnClose}
                handleConfirmDelete={mockOnConfirmDelete}
                currentProject={mockProject}
            />
        )

        const cancelButton = screen.getByRole('button', { name: 'Cancel' })
        expect(cancelButton).toBeInTheDocument()
    })

    it('should render DELETE button', () => {
        render(
            <DeleteProjectConfirmDialog
                dialogOpen={true}
                handleCloseDialog={mockOnClose}
                handleConfirmDelete={mockOnConfirmDelete}
                currentProject={mockProject}
            />
        )

        const deleteButton = screen.getByRole('button', { name: 'DELETE' })
        expect(deleteButton).toBeInTheDocument()
    })

    it('should call handleCloseDialog when Cancel button is clicked', async () => {
        const user = userEvent.setup()
        render(
            <DeleteProjectConfirmDialog
                dialogOpen={true}
                handleCloseDialog={mockOnClose}
                handleConfirmDelete={mockOnConfirmDelete}
                currentProject={mockProject}
            />
        )

        const cancelButton = screen.getByRole('button', { name: 'Cancel' })
        await user.click(cancelButton)

        expect(mockOnClose).toHaveBeenCalledTimes(1)
        expect(mockOnConfirmDelete).not.toHaveBeenCalled()
    })

    it('should call handleConfirmDelete when DELETE button is clicked', async () => {
        const user = userEvent.setup()
        render(
            <DeleteProjectConfirmDialog
                dialogOpen={true}
                handleCloseDialog={mockOnClose}
                handleConfirmDelete={mockOnConfirmDelete}
                currentProject={mockProject}
            />
        )

        const deleteButton = screen.getByRole('button', { name: 'DELETE' })
        await user.click(deleteButton)

        expect(mockOnConfirmDelete).toHaveBeenCalledTimes(1)
        expect(mockOnClose).not.toHaveBeenCalled()
    })

    it('should handle undefined currentProject gracefully', () => {
        render(
            <DeleteProjectConfirmDialog
                dialogOpen={true}
                handleCloseDialog={mockOnClose}
                handleConfirmDelete={mockOnConfirmDelete}
                currentProject={undefined}
            />
        )

        expect(screen.getByText('Delete Project')).toBeInTheDocument()
        expect(
            screen.getByText(/All project compounds will be removed/)
        ).toBeInTheDocument()
    })
})
