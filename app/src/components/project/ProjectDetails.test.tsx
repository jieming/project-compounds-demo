import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import ProjectDetails from './ProjectDetails'
import projectReducer from '../../store/projectSlice'
import type { Project } from './project-types'

vi.mock('./update-project/UpdateProjectContainer', () => ({
    default: () => <div>UpdateProjectContainer</div>,
}))

vi.mock('./delete-project/DeleteProjectContainer', () => ({
    default: () => <div>DeleteProjectContainer</div>,
}))

const createTestStore = () => {
    return configureStore({
        reducer: {
            project: projectReducer,
        },
    })
}

const mockProject: Project = {
    id: '1',
    name: 'ALZ-2024',
    description: "Beta-amyloid inhibitor for Alzheimer's disease - Phase II",
}

describe('ProjectDetails', () => {
    it('should render project name and description when project is provided', () => {
        const store = createTestStore()
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <ProjectDetails project={mockProject} />
                </MemoryRouter>
            </Provider>
        )
        expect(screen.getByText(mockProject.name)).toBeInTheDocument()
        expect(screen.getByText(mockProject.description)).toBeInTheDocument()
    })

    it('should render Close link when project is provided', () => {
        const store = createTestStore()
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <ProjectDetails project={mockProject} />
                </MemoryRouter>
            </Provider>
        )
        const closeLink = screen.getByRole('link', { name: 'Close' })
        expect(closeLink).toBeInTheDocument()
        expect(closeLink).toHaveAttribute('href', '/projects')
    })

    it('should dispatch setCurrentProject when project is provided', () => {
        const store = createTestStore()
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <ProjectDetails project={mockProject} />
                </MemoryRouter>
            </Provider>
        )

        const state = store.getState()
        expect(state.project.currentProject).toBeDefined()
        expect(state.project.currentProject?.name).toBe(mockProject.name)
        expect(state.project.currentProject?.description).toBe(
            mockProject.description
        )
    })

    it('should dispatch setCurrentProject(undefined) when Close link is clicked', async () => {
        const user = userEvent.setup()
        const store = createTestStore()
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <ProjectDetails project={mockProject} />
                </MemoryRouter>
            </Provider>
        )

        const closeLink = screen.getByRole('link', { name: 'Close' })
        await user.click(closeLink)

        const state = store.getState()
        expect(state.project.currentProject).toBeUndefined()
    })

    it('should render NotFoundRoute when project is undefined', () => {
        const store = createTestStore()
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <ProjectDetails project={undefined} />
                </MemoryRouter>
            </Provider>
        )
        expect(screen.getByText('404 - Page not found')).toBeInTheDocument()
        expect(
            screen.getByRole('link', { name: 'Go to home' })
        ).toBeInTheDocument()
    })

    it('should dispatch setCurrentProject(undefined) when project is undefined', () => {
        const store = createTestStore()
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <ProjectDetails project={undefined} />
                </MemoryRouter>
            </Provider>
        )

        const state = store.getState()
        expect(state.project.currentProject).toBeUndefined()
    })

    it('should render UpdateProjectContainer when project is provided', () => {
        const store = createTestStore()
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <ProjectDetails project={mockProject} />
                </MemoryRouter>
            </Provider>
        )

        expect(screen.getByText('UpdateProjectContainer')).toBeInTheDocument()
    })

    it('should render DeleteProjectContainer when project is provided', () => {
        const store = createTestStore()
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <ProjectDetails project={mockProject} />
                </MemoryRouter>
            </Provider>
        )

        expect(screen.getByText('DeleteProjectContainer')).toBeInTheDocument()
    })
})
