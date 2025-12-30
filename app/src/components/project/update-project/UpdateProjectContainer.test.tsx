import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import UpdateProjectContainer from './UpdateProjectContainer'
import projectReducer, { setCurrentProject } from '../../../store/projectSlice'
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

describe('UpdateProjectContainer', () => {
    const mockUpdateProject = vi.fn()
    const mockUseMutation = vi.mocked(useMutation)

    const mockProject: Project = {
        id: '1',
        name: 'Test Project',
        description: 'Test Description',
    }

    beforeEach(() => {
        vi.clearAllMocks()
        mockUseMutation.mockReturnValue([mockUpdateProject] as any)
    })

    it('should render edit icon button', () => {
        const store = createTestStore()
        store.dispatch(setCurrentProject(mockProject))

        render(
            <Provider store={store}>
                <UpdateProjectContainer />
            </Provider>
        )

        const editButton = screen.getByRole('button')
        expect(editButton).toBeInTheDocument()
    })

    it('should open dialog when edit button is clicked', async () => {
        const user = userEvent.setup()
        const store = createTestStore()
        store.dispatch(setCurrentProject(mockProject))

        render(
            <Provider store={store}>
                <UpdateProjectContainer />
            </Provider>
        )

        const editButton = screen.getByRole('button')
        await user.click(editButton)

        expect(screen.getByText('Update Project')).toBeInTheDocument()
    })

    it('should prepopulate dialog with current project data', async () => {
        const user = userEvent.setup()
        const store = createTestStore()
        store.dispatch(setCurrentProject(mockProject))

        render(
            <Provider store={store}>
                <UpdateProjectContainer />
            </Provider>
        )

        const editButton = screen.getByRole('button')
        await user.click(editButton)

        const nameField = screen.getByPlaceholderText('Enter project name')
        const descriptionField = screen.getByPlaceholderText(
            'Enter project description'
        )

        expect(nameField).toHaveValue(mockProject.name)
        expect(descriptionField).toHaveValue(mockProject.description)
    })

    it('should close dialog when Cancel is clicked', async () => {
        const user = userEvent.setup()
        const store = createTestStore()
        store.dispatch(setCurrentProject(mockProject))

        render(
            <Provider store={store}>
                <UpdateProjectContainer />
            </Provider>
        )

        const editButton = screen.getByRole('button')
        await user.click(editButton)

        const cancelButton = screen.getByRole('button', { name: 'Cancel' })
        await user.click(cancelButton)

        await waitFor(() => {
            expect(screen.queryByText('Update Project')).not.toBeInTheDocument()
        })
    })

    it('should call mutation and close dialog on successful submit', async () => {
        const user = userEvent.setup()
        const store = createTestStore()
        store.dispatch(setCurrentProject(mockProject))

        const updatedProject: Project = {
            id: '1',
            name: 'Updated Project',
            description: 'Updated Description',
        }

        mockUpdateProject.mockResolvedValue({
            data: { updateProject: updatedProject },
        })

        render(
            <Provider store={store}>
                <UpdateProjectContainer />
            </Provider>
        )

        const editButton = screen.getByRole('button')
        await user.click(editButton)

        const nameField = screen.getByPlaceholderText('Enter project name')
        const descriptionField = screen.getByPlaceholderText(
            'Enter project description'
        )
        const updateButton = screen.getByRole('button', { name: 'Update' })

        await user.clear(nameField)
        await user.type(nameField, 'Updated Project')
        await user.clear(descriptionField)
        await user.type(descriptionField, 'Updated Description')
        await user.click(updateButton)

        expect(mockUpdateProject).toHaveBeenCalledWith({
            variables: {
                id: mockProject.id,
                name: 'Updated Project',
                description: 'Updated Description',
            },
        })

        await waitFor(() => {
            expect(screen.queryByText('Update Project')).not.toBeInTheDocument()
        })

        expect(store.getState().project.snackbar.open).toBe(true)
        expect(store.getState().project.snackbar.message).toBe(
            'Project "Updated Project" has been updated'
        )
    })

    it('should handle mutation error without closing dialog', async () => {
        const user = userEvent.setup()
        const store = createTestStore()
        store.dispatch(setCurrentProject(mockProject))
        const consoleErrorSpy = vi
            .spyOn(console, 'error')
            .mockImplementation(() => {})

        mockUpdateProject.mockRejectedValue(new Error('Network error'))

        render(
            <Provider store={store}>
                <UpdateProjectContainer />
            </Provider>
        )

        const editButton = screen.getByRole('button')
        await user.click(editButton)

        const nameField = screen.getByPlaceholderText('Enter project name')
        const descriptionField = screen.getByPlaceholderText(
            'Enter project description'
        )
        const updateButton = screen.getByRole('button', { name: 'Update' })

        await user.clear(nameField)
        await user.type(nameField, 'Updated Project')
        await user.clear(descriptionField)
        await user.type(descriptionField, 'Updated Description')
        await user.click(updateButton)

        await waitFor(() => {
            expect(mockUpdateProject).toHaveBeenCalled()
        })

        expect(consoleErrorSpy).toHaveBeenCalledWith(
            'Error updating project:',
            expect.any(Error)
        )

        expect(screen.getByText('Update Project')).toBeInTheDocument()

        expect(store.getState().project.snackbar.open).toBe(false)

        consoleErrorSpy.mockRestore()
    })

    it('should render button even when currentProject is undefined', () => {
        const store = createTestStore()

        render(
            <Provider store={store}>
                <UpdateProjectContainer />
            </Provider>
        )

        const editButton = screen.getByRole('button')
        expect(editButton).toBeInTheDocument()
    })

    it('should use current project id in mutation variables', async () => {
        const user = userEvent.setup()
        const store = createTestStore()
        store.dispatch(setCurrentProject(mockProject))

        mockUpdateProject.mockResolvedValue({
            data: { updateProject: mockProject },
        })

        render(
            <Provider store={store}>
                <UpdateProjectContainer />
            </Provider>
        )

        const editButton = screen.getByRole('button')
        await user.click(editButton)

        const updateButton = screen.getByRole('button', { name: 'Update' })
        await user.click(updateButton)

        await waitFor(() => {
            expect(mockUpdateProject).toHaveBeenCalled()
        })

        expect(mockUpdateProject).toHaveBeenCalledWith({
            variables: {
                id: mockProject.id,
                name: mockProject.name,
                description: mockProject.description,
            },
        })
    })
})
