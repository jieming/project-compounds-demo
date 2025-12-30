import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ProjectListContainer from './ProjectListContainer'
import testProjectsData from './test-project-data.json'
import type { GetProjectsData } from './project-types'

vi.mock('@apollo/client/react', () => ({
    useQuery: vi.fn(),
}))

vi.mock('./create-project/CreateProjectContainer', () => ({
    default: () => <div>CreateProjectContainer</div>,
}))

const { useQuery } = await import('@apollo/client/react')

describe('ProjectListContainer', () => {
    const mockProjects: GetProjectsData = {
        projects: testProjectsData,
    }

    it('should render LoadingIndicator when loading', () => {
        vi.mocked(useQuery).mockReturnValue({
            loading: true,
            error: undefined,
            data: undefined,
        } as any)

        render(
            <MemoryRouter>
                <ProjectListContainer />
            </MemoryRouter>
        )

        expect(screen.getByRole('progressbar')).toBeInTheDocument()
    })

    it('should render error message when error occurs', () => {
        const errorMessage = 'Failed to fetch projects'
        vi.mocked(useQuery).mockReturnValue({
            loading: false,
            error: { message: errorMessage } as any,
            data: undefined,
        } as any)

        render(
            <MemoryRouter>
                <ProjectListContainer />
            </MemoryRouter>
        )

        expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument()
    })

    it('should render ProjectList with projects when data is loaded', () => {
        vi.mocked(useQuery).mockReturnValue({
            loading: false,
            error: undefined,
            data: mockProjects,
        } as any)

        render(
            <MemoryRouter>
                <ProjectListContainer />
            </MemoryRouter>
        )

        mockProjects.projects.forEach(project => {
            expect(screen.getByText(project.name)).toBeInTheDocument()
            expect(screen.getByText(project.description)).toBeInTheDocument()
        })
    })

    it('should render ProjectList with empty array when data is null', () => {
        vi.mocked(useQuery).mockReturnValue({
            loading: false,
            error: undefined,
            data: null,
        } as any)

        render(
            <MemoryRouter>
                <ProjectListContainer />
            </MemoryRouter>
        )

        expect(screen.getByText('ID')).toBeInTheDocument()
        expect(screen.getByText('Name')).toBeInTheDocument()
        expect(screen.getByText('Description')).toBeInTheDocument()
    })
})
