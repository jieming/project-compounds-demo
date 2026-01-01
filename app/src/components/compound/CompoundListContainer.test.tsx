import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import CompoundListContainer from './CompoundListContainer'
import type { GetCompoundsData } from './compound-types'

vi.mock('@apollo/client/react', () => ({
    useQuery: vi.fn(),
}))

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom')
    return {
        ...actual,
        useParams: vi.fn(),
    }
})

vi.mock('./CompoundList', () => ({
    default: ({ compounds }: { compounds: any[] }) => (
        <div data-testid="compound-list">
            {compounds.map(compound => (
                <div key={compound.id}>{compound.smiles}</div>
            ))}
        </div>
    ),
}))

vi.mock('./upload-compounds/CompoundUploadContainer', () => ({
    default: () => (
        <div data-testid="compound-upload-zone-container">Upload Zone</div>
    ),
}))

vi.mock('../common/loading-indicator/LoadingIndicator', () => ({
    default: () => <div data-testid="loading-indicator">Loading...</div>,
}))

const { useQuery } = await import('@apollo/client/react')
const { useParams } = await import('react-router-dom')

describe('CompoundListContainer', () => {
    const mockProject = {
        id: '1',
        name: 'Test Project',
        description: 'Test Description',
    }

    const mockCompounds: GetCompoundsData = {
        compounds: [
            {
                id: '1',
                project: mockProject,
                smiles: 'CCO',
                mw: 46.07,
                logD: -0.31,
                logP: -0.32,
            },
            {
                id: '2',
                project: mockProject,
                smiles: 'CCN',
                mw: 45.08,
                logD: 0.15,
                logP: -0.15,
            },
        ],
    }

    beforeEach(() => {
        vi.clearAllMocks()
        vi.mocked(useParams).mockReturnValue({ projectId: '1' })
    })

    it('should render LoadingIndicator when loading', () => {
        vi.mocked(useQuery).mockReturnValue({
            loading: true,
            error: undefined,
            data: undefined,
        } as any)

        render(
            <MemoryRouter>
                <CompoundListContainer />
            </MemoryRouter>
        )

        expect(screen.getByTestId('loading-indicator')).toBeInTheDocument()
    })

    it('should render error message when error occurs', () => {
        const errorMessage = 'Failed to fetch compounds'
        vi.mocked(useQuery).mockReturnValue({
            loading: false,
            error: { message: errorMessage } as any,
            data: undefined,
        } as any)

        render(
            <MemoryRouter>
                <CompoundListContainer />
            </MemoryRouter>
        )

        expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument()
    })

    it('should render CompoundList when compounds are loaded', () => {
        vi.mocked(useQuery).mockReturnValue({
            loading: false,
            error: undefined,
            data: mockCompounds,
        } as any)

        render(
            <MemoryRouter>
                <CompoundListContainer />
            </MemoryRouter>
        )

        expect(screen.getByTestId('compound-list')).toBeInTheDocument()
        expect(screen.getByText('CCO')).toBeInTheDocument()
        expect(screen.getByText('CCN')).toBeInTheDocument()
    })

    it('should render CompoundUploadZoneContainer when compounds array is empty', () => {
        vi.mocked(useQuery).mockReturnValue({
            loading: false,
            error: undefined,
            data: { compounds: [] },
        } as any)

        render(
            <MemoryRouter>
                <CompoundListContainer />
            </MemoryRouter>
        )

        expect(
            screen.getByTestId('compound-upload-zone-container')
        ).toBeInTheDocument()
        expect(screen.queryByTestId('compound-list')).not.toBeInTheDocument()
    })

    it('should render CompoundUploadZoneContainer when data is null', () => {
        vi.mocked(useQuery).mockReturnValue({
            loading: false,
            error: undefined,
            data: null,
        } as any)

        render(
            <MemoryRouter>
                <CompoundListContainer />
            </MemoryRouter>
        )

        expect(
            screen.getByTestId('compound-upload-zone-container')
        ).toBeInTheDocument()
        expect(screen.queryByTestId('compound-list')).not.toBeInTheDocument()
    })

    it('should call useQuery with correct variables', () => {
        vi.mocked(useQuery).mockReturnValue({
            loading: false,
            error: undefined,
            data: mockCompounds,
        } as any)

        render(
            <MemoryRouter>
                <CompoundListContainer />
            </MemoryRouter>
        )

        expect(useQuery).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({
                variables: { projectId: '1' },
                skip: false,
            })
        )
    })

    it('should skip query when projectId is missing', () => {
        vi.mocked(useParams).mockReturnValue({ projectId: undefined })
        vi.mocked(useQuery).mockReturnValue({
            loading: false,
            error: undefined,
            data: undefined,
        } as any)

        render(
            <MemoryRouter>
                <CompoundListContainer />
            </MemoryRouter>
        )

        expect(useQuery).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({
                variables: { projectId: undefined },
                skip: true,
            })
        )
    })

    it('should handle compounds with null values', () => {
        const compoundsWithNulls: GetCompoundsData = {
            compounds: [
                {
                    id: '1',
                    project: mockProject,
                    smiles: 'CC(=O)O',
                    mw: null,
                    logD: null,
                    logP: null,
                },
            ],
        }

        vi.mocked(useQuery).mockReturnValue({
            loading: false,
            error: undefined,
            data: compoundsWithNulls,
        } as any)

        render(
            <MemoryRouter>
                <CompoundListContainer />
            </MemoryRouter>
        )

        expect(screen.getByTestId('compound-list')).toBeInTheDocument()
        expect(screen.getByText('CC(=O)O')).toBeInTheDocument()
    })
})
