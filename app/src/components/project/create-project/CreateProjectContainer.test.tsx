import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import CreateProjectContainer from './CreateProjectContainer'
import projectReducer from '../../../store/projectSlice'
import type { Project } from '../project-types'

vi.mock('@apollo/client/react', () => ({
    useMutation: vi.fn(),
}))

const { useMutation } = await import('@apollo/client/react')

const createTestStore = () => {
    return configureStore({
        reducer: {
            project: projectReducer,
        },
    })
}

describe('CreateProjectContainer', () => {
    const mockCreateProject = vi.fn()
    const mockUseMutation = vi.mocked(useMutation)

    beforeEach(() => {
        vi.clearAllMocks()
        mockUseMutation.mockReturnValue([mockCreateProject] as any)
    })

    it('should render Fab button', () => {
        const store = createTestStore()
        render(
            <Provider store={store}>
                <CreateProjectContainer />
            </Provider>
        )

        const fab = screen.getByRole('button', { name: 'add' })
        expect(fab).toBeInTheDocument()
    })

    it('should open dialog when Fab is clicked', async () => {
        const user = userEvent.setup()
        const store = createTestStore()
        render(
            <Provider store={store}>
                <CreateProjectContainer />
            </Provider>
        )

        const fab = screen.getByRole('button', { name: 'add' })
        await user.click(fab)

        expect(screen.getByText('Create New Project')).toBeInTheDocument()
    })

    it('should close dialog when Cancel is clicked', async () => {
        const user = userEvent.setup()
        const store = createTestStore()
        render(
            <Provider store={store}>
                <CreateProjectContainer />
            </Provider>
        )

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

    it('should call mutation and close dialog on successful submit', async () => {
        const user = userEvent.setup()
        const store = createTestStore()
        const mockProject: Project = {
            id: '1',
            name: 'Test Project',
            description: 'Test Description',
        }

        mockCreateProject.mockResolvedValue({
            data: { createProject: mockProject },
        })

        render(
            <Provider store={store}>
                <CreateProjectContainer />
            </Provider>
        )

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

        expect(mockCreateProject).toHaveBeenCalledWith({
            variables: {
                name: 'Test Project',
                description: 'Test Description',
            },
        })

        await waitFor(() => {
            expect(
                screen.queryByText('Create New Project')
            ).not.toBeInTheDocument()
        })

        expect(store.getState().project.snackbar.open).toBe(true)
        expect(store.getState().project.snackbar.message).toBe(
            'Project "Test Project" has been created'
        )
    })

    it('should handle mutation error without closing dialog', async () => {
        const user = userEvent.setup()
        const store = createTestStore()
        const consoleErrorSpy = vi
            .spyOn(console, 'error')
            .mockImplementation(() => {})

        mockCreateProject.mockRejectedValue(new Error('Network error'))

        render(
            <Provider store={store}>
                <CreateProjectContainer />
            </Provider>
        )

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

        await waitFor(() => {
            expect(mockCreateProject).toHaveBeenCalled()
        })

        expect(consoleErrorSpy).toHaveBeenCalledWith(
            'Error creating project:',
            expect.any(Error)
        )

        expect(screen.getByText('Create New Project')).toBeInTheDocument()

        expect(store.getState().project.snackbar.open).toBe(false)

        consoleErrorSpy.mockRestore()
    })
})
