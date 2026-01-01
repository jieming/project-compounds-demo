import { render, screen } from '@testing-library/react'
import CompoundList from './CompoundList'
import type { Compound } from './compound-types'

const mockProject = {
    id: '1',
    name: 'Test Project',
    description: 'Test Description',
}

const mockCompounds: Compound[] = [
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
    {
        id: '3',
        project: mockProject,
        smiles: 'CC(=O)O',
        mw: null,
        logD: null,
        logP: null,
    },
]

describe('CompoundList', () => {
    it('should render DataGrid with compound data', () => {
        render(<CompoundList compounds={mockCompounds} />)

        // Check that compound data is displayed
        expect(screen.getByText('CCO')).toBeInTheDocument()
        expect(screen.getByText('CCN')).toBeInTheDocument()
        expect(screen.getByText('CC(=O)O')).toBeInTheDocument()
    })

    it('should render all column headers', () => {
        render(<CompoundList compounds={mockCompounds} />)

        expect(screen.getByText('ID')).toBeInTheDocument()
        expect(screen.getByText('SMILES')).toBeInTheDocument()
        expect(screen.getByText('MW')).toBeInTheDocument()
        expect(screen.getByText('LogD')).toBeInTheDocument()
        expect(screen.getByText('LogP')).toBeInTheDocument()
    })

    it('should display numeric values correctly', () => {
        render(<CompoundList compounds={mockCompounds} />)

        expect(screen.getByText('46.07')).toBeInTheDocument()
        expect(screen.getByText('45.08')).toBeInTheDocument()
        expect(screen.getByText('-0.31')).toBeInTheDocument()
        expect(screen.getByText('-0.32')).toBeInTheDocument()
        expect(screen.getByText('0.15')).toBeInTheDocument()
        expect(screen.getByText('-0.15')).toBeInTheDocument()
    })

    it('should handle null values in compounds', () => {
        render(<CompoundList compounds={mockCompounds} />)

        expect(screen.getByText('CC(=O)O')).toBeInTheDocument()
    })

    it('should render with empty array', () => {
        render(<CompoundList compounds={[]} />)

        expect(screen.getByText('ID')).toBeInTheDocument()
        expect(screen.getByText('SMILES')).toBeInTheDocument()
        expect(screen.getByText('MW')).toBeInTheDocument()
        expect(screen.getByText('LogD')).toBeInTheDocument()
        expect(screen.getByText('LogP')).toBeInTheDocument()
    })

    it('should render Paper component', () => {
        const { container } = render(<CompoundList compounds={mockCompounds} />)

        const paper = container.querySelector('.MuiPaper-root')
        expect(paper).toBeInTheDocument()
    })

    it('should render DataGrid component', () => {
        const { container } = render(<CompoundList compounds={mockCompounds} />)

        const dataGrid = container.querySelector('.MuiDataGrid-root')
        expect(dataGrid).toBeInTheDocument()
    })

    it('should handle compounds with string IDs', () => {
        const compoundsWithStringIds: Compound[] = [
            {
                id: 'compound-1',
                project: mockProject,
                smiles: 'CCO',
                mw: 46.07,
                logD: -0.31,
                logP: -0.31,
            },
        ]

        render(<CompoundList compounds={compoundsWithStringIds} />)

        expect(screen.getByText('CCO')).toBeInTheDocument()
    })

    it('should handle compounds with number IDs', () => {
        const compoundsWithNumberIds: Compound[] = [
            {
                id: 100,
                project: mockProject,
                smiles: 'CCO',
                mw: 46.07,
                logD: -0.31,
                logP: -0.31,
            },
        ]

        render(<CompoundList compounds={compoundsWithNumberIds} />)

        expect(screen.getByText('CCO')).toBeInTheDocument()
    })

    it('should display all compound fields in the grid', () => {
        render(<CompoundList compounds={[mockCompounds[0]]} />)

        const compound = mockCompounds[0]
        expect(screen.getByText(compound.smiles)).toBeInTheDocument()
        if (compound.mw !== null) {
            expect(screen.getByText(compound.mw.toString())).toBeInTheDocument()
        }
        if (compound.logD !== null) {
            expect(
                screen.getAllByText(compound.logD.toString()).length
            ).toBeGreaterThan(0)
        }
        if (compound.logP !== null) {
            expect(
                screen.getAllByText(compound.logP.toString()).length
            ).toBeGreaterThan(0)
        }
    })
})
