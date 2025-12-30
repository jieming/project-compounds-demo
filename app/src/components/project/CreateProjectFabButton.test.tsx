import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CreateProjectFabButton from './CreateProjectFabButton'

describe('CreateProjectFabButton', () => {
    it('should render Fab button', () => {
        render(<CreateProjectFabButton />)
        const fab = screen.getByRole('button', { name: 'add' })
        expect(fab).toBeInTheDocument()
    })

    it('should open dialog when Fab is clicked', async () => {
        const user = userEvent.setup()
        render(<CreateProjectFabButton />)

        const fab = screen.getByRole('button', { name: 'add' })
        await user.click(fab)

        expect(screen.getByText('Create New Project')).toBeInTheDocument()
    })

    it('should close dialog when Cancel is clicked', async () => {
        const user = userEvent.setup()
        render(<CreateProjectFabButton />)

        const fab = screen.getByRole('button', { name: 'add' })
        await user.click(fab)

        const cancelButton = screen.getByRole('button', { name: 'Cancel' })
        await user.click(cancelButton)

        await waitFor(() => {
            expect(
                screen.queryByText('Create New Project')
            ).not.toBeInTheDocument()
        })
    })

    it('should close dialog and call onSubmit when Create is clicked', async () => {
        const user = userEvent.setup()
        const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

        render(<CreateProjectFabButton />)

        const fab = screen.getByRole('button', { name: 'add' })
        await user.click(fab)

        const nameField = screen.getByPlaceholderText('Enter project name')
        const descriptionField = screen.getByPlaceholderText(
            'Enter project description'
        )
        const createButton = screen.getByRole('button', { name: 'Create' })

        await user.type(nameField, 'Test Project')
        await user.type(descriptionField, 'Test Description')
        await user.click(createButton)

        expect(consoleSpy).toHaveBeenCalledWith('Creating project:', {
            name: 'Test Project',
            description: 'Test Description',
        })

        await waitFor(() => {
            expect(
                screen.queryByText('Create New Project')
            ).not.toBeInTheDocument()
        })

        consoleSpy.mockRestore()
    })
})
