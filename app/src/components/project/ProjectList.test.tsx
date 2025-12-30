import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import ProjectList from './ProjectList'
import projectsData from './test-project-data.json'
import type { Project } from './project-types'

vi.mock('./create-project/CreateProjectContainer', () => ({
    default: () => <div>CreateProjectContainer</div>,
}))

const projects: Project[] = projectsData

describe('ProjectList', () => {
    it('should render DataGrid with project data', () => {
        render(
            <MemoryRouter initialEntries={['/projects']}>
                <Routes>
                    <Route
                        path="/projects"
                        element={<ProjectList projects={projects} />}
                    />
                </Routes>
            </MemoryRouter>
        )

        projects.forEach(project => {
            expect(screen.getByText(project.name)).toBeInTheDocument()
            expect(screen.getByText(project.description)).toBeInTheDocument()
        })
    })

    it('should render project names as clickable links', () => {
        render(
            <MemoryRouter initialEntries={['/projects']}>
                <Routes>
                    <Route
                        path="/projects"
                        element={<ProjectList projects={projects} />}
                    />
                </Routes>
            </MemoryRouter>
        )

        const project1Link = screen.getByRole('link', { name: 'ALZ-2024' })
        expect(project1Link).toBeInTheDocument()
        expect(project1Link).toHaveAttribute('href', '/projects/1')
    })

    it('should render links with correct hrefs for all projects', () => {
        render(
            <MemoryRouter initialEntries={['/projects']}>
                <Routes>
                    <Route
                        path="/projects"
                        element={<ProjectList projects={projects} />}
                    />
                </Routes>
            </MemoryRouter>
        )

        projects.forEach(project => {
            const link = screen.getByRole('link', { name: project.name })
            expect(link).toHaveAttribute('href', `/projects/${project.id}`)
        })
    })

    it('should render Outlet for nested routes', () => {
        const TestOutlet = () => <div>Test Outlet Content</div>

        render(
            <MemoryRouter initialEntries={['/projects/1']}>
                <Routes>
                    <Route
                        path="/projects"
                        element={<ProjectList projects={projects} />}
                    >
                        <Route path=":projectId" element={<TestOutlet />} />
                    </Route>
                </Routes>
            </MemoryRouter>
        )

        expect(screen.getByText('Test Outlet Content')).toBeInTheDocument()
    })

    it('should render all project columns (ID, Name, Description)', () => {
        render(
            <MemoryRouter initialEntries={['/projects']}>
                <Routes>
                    <Route
                        path="/projects"
                        element={<ProjectList projects={projects} />}
                    />
                </Routes>
            </MemoryRouter>
        )

        expect(screen.getByText('ID')).toBeInTheDocument()
        expect(screen.getByText('Name')).toBeInTheDocument()
        expect(screen.getByText('Description')).toBeInTheDocument()
    })

    it('should render placeholder when no project is selected', () => {
        render(
            <MemoryRouter initialEntries={['/projects']}>
                <Routes>
                    <Route
                        path="/projects"
                        element={<ProjectList projects={projects} />}
                    />
                </Routes>
            </MemoryRouter>
        )

        expect(
            screen.getByText('Select a project to view details')
        ).toBeInTheDocument()
        expect(screen.getByAltText('Select a project')).toBeInTheDocument()
    })

    it('should render with empty projects array', () => {
        render(
            <MemoryRouter initialEntries={['/projects']}>
                <Routes>
                    <Route
                        path="/projects"
                        element={<ProjectList projects={[]} />}
                    />
                </Routes>
            </MemoryRouter>
        )

        expect(screen.getByText('ID')).toBeInTheDocument()
        expect(screen.getByText('Name')).toBeInTheDocument()
        expect(screen.getByText('Description')).toBeInTheDocument()
    })

    it('should render CreateProjectContainer', () => {
        render(
            <MemoryRouter initialEntries={['/projects']}>
                <Routes>
                    <Route
                        path="/projects"
                        element={<ProjectList projects={projects} />}
                    />
                </Routes>
            </MemoryRouter>
        )

        expect(screen.getByText('CreateProjectContainer')).toBeInTheDocument()
    })
})
