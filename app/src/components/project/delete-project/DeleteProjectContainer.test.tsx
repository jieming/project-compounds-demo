import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { MemoryRouter } from 'react-router-dom'
import DeleteProjectContainer from './DeleteProjectContainer'
import projectReducer, { setCurrentProject } from '../../../store/projectSlice'
import snackbarReducer from '../../../store/snackbarSlice'
import type { Project } from '../project-types'

vi.mock('@apollo/client/react', () => ({
    useMutation: vi.fn(),
}))

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom')
    return {
        ...actual,
        useNavigate: vi.fn(),
    }
})

const { useMutation } = await import('@apollo/client/react')
const { useNavigate } = await import('react-router-dom')

const createTestStore = () => {
    return configureStore({
        reducer: {
            project: projectReducer,
            snackbar: snackbarReducer,
        },
    })
}

describe('DeleteProjectContainer', () => {
    const mockDeleteProject = vi.fn()
    const mockUseMutation = vi.mocked(useMutation)
    const mockNavigate = vi.fn()

    const mockProject: Project = {
        id: '1',
        name: 'Test Project',
        description: 'Test Description',
    }

    beforeEach(() => {
        vi.clearAllMocks()
        mockUseMutation.mockReturnValue([mockDeleteProject] as any)
        vi.mocked(useNavigate).mockReturnValue(mockNavigate)
    })

    it('should render delete icon button', () => {
        const store = createTestStore()
        store.dispatch(setCurrentProject(mockProject))

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <DeleteProjectContainer />
                </MemoryRouter>
            </Provider>
        )

        const deleteButton = screen.getByRole('button')
        expect(deleteButton).toBeInTheDocument()
    })

    it('should open dialog when delete button is clicked', async () => {
        const user = userEvent.setup()
        const store = createTestStore()
        store.dispatch(setCurrentProject(mockProject))

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <DeleteProjectContainer />
                </MemoryRouter>
            </Provider>
        )

        const deleteButton = screen.getByRole('button')
        await user.click(deleteButton)

        expect(screen.getByText('Delete Project')).toBeInTheDocument()
    })

    it('should call mutation and navigate on successful delete', async () => {
        const user = userEvent.setup()
        const store = createTestStore()
        store.dispatch(setCurrentProject(mockProject))

        mockDeleteProject.mockResolvedValue({
            data: { deleteProject: mockProject },
        })

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <DeleteProjectContainer />
                </MemoryRouter>
            </Provider>
        )

        const deleteButton = screen.getByRole('button')
        await user.click(deleteButton)

        const confirmButton = screen.getByRole('button', { name: 'DELETE' })
        await user.click(confirmButton)

        await waitFor(() => {
            expect(mockDeleteProject).toHaveBeenCalledWith({
                variables: { id: mockProject.id },
            })
        })

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/projects')
        })

        await waitFor(() => {
            const state = store.getState()
            expect(state.project.currentProject).toBeUndefined()
            expect(state.snackbar.open).toBe(true)
            expect(state.snackbar.message).toBe(
                'Project "Test Project" has been deleted'
            )
        })
    })

    it('should close dialog when Cancel is clicked', async () => {
        const user = userEvent.setup()
        const store = createTestStore()
        store.dispatch(setCurrentProject(mockProject))

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <DeleteProjectContainer />
                </MemoryRouter>
            </Provider>
        )

        const deleteButton = screen.getByRole('button')
        await user.click(deleteButton)

        const cancelButton = screen.getByRole('button', { name: 'Cancel' })
        await user.click(cancelButton)

        await waitFor(() => {
            expect(screen.queryByText('Delete Project')).not.toBeInTheDocument()
        })
    })

    it('should display project name in dialog', async () => {
        const user = userEvent.setup()
        const store = createTestStore()
        store.dispatch(setCurrentProject(mockProject))

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <DeleteProjectContainer />
                </MemoryRouter>
            </Provider>
        )

        const deleteButton = screen.getByRole('button')
        await user.click(deleteButton)

        expect(screen.getByText(/Test Project/)).toBeInTheDocument()
    })

    it('should display compounds warning message in dialog', async () => {
        const user = userEvent.setup()
        const store = createTestStore()
        store.dispatch(setCurrentProject(mockProject))

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <DeleteProjectContainer />
                </MemoryRouter>
            </Provider>
        )

        const deleteButton = screen.getByRole('button')
        await user.click(deleteButton)

        expect(
            screen.getByText(/All project compounds will be removed/)
        ).toBeInTheDocument()
    })

    it('should handle mutation errors', async () => {
        const user = userEvent.setup()
        const store = createTestStore()
        const consoleErrorSpy = vi
            .spyOn(console, 'error')
            .mockImplementation(() => {})
        store.dispatch(setCurrentProject(mockProject))

        const error = new Error('Network error')
        mockDeleteProject.mockRejectedValue(error)

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <DeleteProjectContainer />
                </MemoryRouter>
            </Provider>
        )

        const deleteButton = screen.getByRole('button')
        await user.click(deleteButton)

        const confirmButton = screen.getByRole('button', { name: 'DELETE' })
        await user.click(confirmButton)

        await waitFor(() => {
            expect(mockDeleteProject).toHaveBeenCalled()
        })

        await waitFor(() => {
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                'Error deleting project:',
                error
            )
        })

        expect(mockNavigate).not.toHaveBeenCalled()

        consoleErrorSpy.mockRestore()
    })

    it('should call useMutation with correct query and refetchQueries', () => {
        const store = createTestStore()
        store.dispatch(setCurrentProject(mockProject))

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <DeleteProjectContainer />
                </MemoryRouter>
            </Provider>
        )

        expect(mockUseMutation).toHaveBeenCalled()
        const mutationCall = mockUseMutation.mock.calls[0]
        expect(mutationCall[0]).toBeDefined()
        expect(mutationCall[1]).toEqual({
            refetchQueries: [{ query: expect.anything() }],
            awaitRefetchQueries: true,
        })
    })
})
