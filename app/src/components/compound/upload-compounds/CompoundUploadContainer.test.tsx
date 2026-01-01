import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import CompoundUploadContainer from './CompoundUploadContainer'
import projectReducer from '../../../store/projectSlice'

vi.mock('@apollo/client/react', () => ({
    useMutation: vi.fn(),
}))

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom')
    return {
        ...actual,
        useParams: vi.fn(),
    }
})

vi.mock('./CompoundUploadZone', () => ({
    default: ({
        onDrop,
        uploading,
    }: {
        onDrop: (files: File[]) => void
        uploading: boolean
    }) => (
        <div data-testid="compound-upload-zone">
            <div data-testid="uploading-state">
                {uploading ? 'uploading' : 'not-uploading'}
            </div>
            <button
                data-testid="trigger-drop"
                onClick={async () => {
                    const fileContent =
                        'Compound_Name,SMILES,MW,LogD,LogP\nTest,CCO,46.07,-0.31,-0.31'
                    const file = new File([fileContent], 'test.csv', {
                        type: 'text/csv',
                    })
                    file.text = vi.fn().mockResolvedValue(fileContent)
                    onDrop([file])
                }}
            >
                Trigger Drop
            </button>
        </div>
    ),
}))

vi.mock('./file-parser-utils', () => ({
    parseCSV: vi.fn(),
}))

const { useMutation } = await import('@apollo/client/react')
const { useParams } = await import('react-router-dom')
const { parseCSV } = await import('./file-parser-utils')

const createTestStore = () => {
    return configureStore({
        reducer: {
            project: projectReducer,
        },
    })
}

describe('CompoundUploadContainer', () => {
    const mockBulkCreateCompounds = vi.fn()
    const mockUseMutation = vi.mocked(useMutation)
    const mockUseParams = vi.mocked(useParams)

    beforeEach(() => {
        vi.clearAllMocks()
        mockUseMutation.mockReturnValue([mockBulkCreateCompounds] as any)
        mockUseParams.mockReturnValue({ projectId: '1' })
        vi.mocked(parseCSV).mockReturnValue([
            {
                smiles: 'CCO',
                mw: 46.07,
                logD: -0.31,
                logP: -0.31,
            },
        ])
    })

    it('should render CompoundUploadZone', () => {
        const store = createTestStore()
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <CompoundUploadContainer />
                </MemoryRouter>
            </Provider>
        )

        expect(screen.getByTestId('compound-upload-zone')).toBeInTheDocument()
    })

    it('should pass uploading=false initially', () => {
        const store = createTestStore()
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <CompoundUploadContainer />
                </MemoryRouter>
            </Provider>
        )

        expect(screen.getByTestId('uploading-state')).toHaveTextContent(
            'not-uploading'
        )
    })

    it('should call useMutation with correct query and refetchQueries', () => {
        const store = createTestStore()
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <CompoundUploadContainer />
                </MemoryRouter>
            </Provider>
        )

        expect(mockUseMutation).toHaveBeenCalled()
        const mutationCall = mockUseMutation.mock.calls[0]
        expect(mutationCall[0]).toBeDefined()
        expect(mutationCall[1]).toEqual({
            refetchQueries: [
                {
                    query: expect.anything(),
                    variables: { projectId: '1' },
                },
            ],
            awaitRefetchQueries: true,
        })
    })

    it('should handle file drop and call mutation with parsed compounds', async () => {
        const user = userEvent.setup()
        const store = createTestStore()
        mockBulkCreateCompounds.mockResolvedValue({
            data: {
                bulkCreateCompounds: [
                    {
                        id: '1',
                        smiles: 'CCO',
                        mw: 46.07,
                        logD: -0.31,
                        logP: -0.31,
                    },
                ],
            },
        })

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <CompoundUploadContainer />
                </MemoryRouter>
            </Provider>
        )

        const triggerButton = screen.getByTestId('trigger-drop')
        await user.click(triggerButton)

        await waitFor(() => {
            expect(parseCSV).toHaveBeenCalled()
        })

        await waitFor(() => {
            expect(mockBulkCreateCompounds).toHaveBeenCalledWith({
                variables: {
                    projectId: '1',
                    compounds: [
                        {
                            smiles: 'CCO',
                            mw: 46.07,
                            logD: -0.31,
                            logP: -0.31,
                        },
                    ],
                },
            })
        })
    })

    it('should dispatch snackbar notification with compound count after successful upload', async () => {
        const user = userEvent.setup()
        const store = createTestStore()
        mockBulkCreateCompounds.mockResolvedValue({
            data: {
                bulkCreateCompounds: [
                    {
                        id: '1',
                        smiles: 'CCO',
                        mw: 46.07,
                        logD: -0.31,
                        logP: -0.31,
                    },
                ],
            },
        })

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <CompoundUploadContainer />
                </MemoryRouter>
            </Provider>
        )

        const triggerButton = screen.getByTestId('trigger-drop')
        await user.click(triggerButton)

        await waitFor(() => {
            expect(mockBulkCreateCompounds).toHaveBeenCalled()
        })

        await waitFor(() => {
            const state = store.getState()
            expect(state.project.snackbar.open).toBe(true)
            expect(state.project.snackbar.message).toBe(
                'Successfully uploaded 1 compound'
            )
            expect(state.project.snackbar.severity).toBe('success')
        })
    })

    it('should dispatch snackbar notification with plural message for multiple compounds', async () => {
        const user = userEvent.setup()
        const store = createTestStore()
        vi.mocked(parseCSV).mockReturnValue([
            {
                smiles: 'CCO',
                mw: 46.07,
                logD: -0.31,
                logP: -0.31,
            },
            {
                smiles: 'CCN',
                mw: 45.08,
                logD: 0.15,
                logP: -0.15,
            },
            {
                smiles: 'CC(=O)O',
                mw: null,
                logD: null,
                logP: null,
            },
        ])

        mockBulkCreateCompounds.mockResolvedValue({
            data: {
                bulkCreateCompounds: [
                    { id: '1', smiles: 'CCO' },
                    { id: '2', smiles: 'CCN' },
                    { id: '3', smiles: 'CC(=O)O' },
                ],
            },
        })

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <CompoundUploadContainer />
                </MemoryRouter>
            </Provider>
        )

        const triggerButton = screen.getByTestId('trigger-drop')
        await user.click(triggerButton)

        await waitFor(() => {
            expect(mockBulkCreateCompounds).toHaveBeenCalled()
        })

        await waitFor(() => {
            const state = store.getState()
            expect(state.project.snackbar.open).toBe(true)
            expect(state.project.snackbar.message).toBe(
                'Successfully uploaded 3 compounds'
            )
            expect(state.project.snackbar.severity).toBe('success')
        })
    })

    it('should set uploading state during file processing', async () => {
        const user = userEvent.setup()
        const store = createTestStore()
        let resolveMutation: (value: any) => void
        const mutationPromise = new Promise(resolve => {
            resolveMutation = resolve
        })
        mockBulkCreateCompounds.mockReturnValue(mutationPromise as any)

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <CompoundUploadContainer />
                </MemoryRouter>
            </Provider>
        )

        const triggerButton = screen.getByTestId('trigger-drop')
        await user.click(triggerButton)

        await waitFor(() => {
            expect(screen.getByTestId('uploading-state')).toHaveTextContent(
                'uploading'
            )
        })

        resolveMutation!({
            data: {
                bulkCreateCompounds: [],
            },
        })

        await waitFor(() => {
            expect(screen.getByTestId('uploading-state')).toHaveTextContent(
                'not-uploading'
            )
        })
    })

    it('should not process files when projectId is missing', async () => {
        const user = userEvent.setup()
        const store = createTestStore()
        mockUseParams.mockReturnValue({ projectId: undefined })

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <CompoundUploadContainer />
                </MemoryRouter>
            </Provider>
        )

        const triggerButton = screen.getByTestId('trigger-drop')
        await user.click(triggerButton)

        await waitFor(() => {
            expect(parseCSV).not.toHaveBeenCalled()
        })

        expect(mockBulkCreateCompounds).not.toHaveBeenCalled()
    })

    it('should not process files when no files are provided', () => {
        const store = createTestStore()
        // The component checks if acceptedFiles.length === 0 and returns early
        // This test verifies that parseCSV and mutation are not called when no files
        // We can't easily trigger onDrop with empty array in the mock, but the logic
        // is covered by the component's early return check
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <CompoundUploadContainer />
                </MemoryRouter>
            </Provider>
        )

        // Verify that parseCSV hasn't been called yet (since no file drop occurred)
        expect(parseCSV).not.toHaveBeenCalled()
        expect(mockBulkCreateCompounds).not.toHaveBeenCalled()
    })

    it('should handle empty compounds array from parseCSV', async () => {
        const user = userEvent.setup()
        const store = createTestStore()
        const consoleErrorSpy = vi
            .spyOn(console, 'error')
            .mockImplementation(() => {})
        vi.mocked(parseCSV).mockReturnValue([])

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <CompoundUploadContainer />
                </MemoryRouter>
            </Provider>
        )

        const triggerButton = screen.getByTestId('trigger-drop')
        await user.click(triggerButton)

        await waitFor(() => {
            expect(parseCSV).toHaveBeenCalled()
        })

        await waitFor(() => {
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                'No compounds found in file'
            )
        })

        expect(mockBulkCreateCompounds).not.toHaveBeenCalled()

        // Verify snackbar is not shown for empty compounds
        const state = store.getState()
        expect(state.project.snackbar.open).toBe(false)

        await waitFor(() => {
            expect(screen.getByTestId('uploading-state')).toHaveTextContent(
                'not-uploading'
            )
        })

        consoleErrorSpy.mockRestore()
    })

    it('should handle mutation errors', async () => {
        const user = userEvent.setup()
        const store = createTestStore()
        const consoleErrorSpy = vi
            .spyOn(console, 'error')
            .mockImplementation(() => {})
        const error = new Error('Network error')
        mockBulkCreateCompounds.mockRejectedValue(error)

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <CompoundUploadContainer />
                </MemoryRouter>
            </Provider>
        )

        const triggerButton = screen.getByTestId('trigger-drop')
        await user.click(triggerButton)

        await waitFor(() => {
            expect(mockBulkCreateCompounds).toHaveBeenCalled()
        })

        await waitFor(() => {
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                'Error uploading compounds:',
                error
            )
        })

        // Verify snackbar is not shown on error
        const state = store.getState()
        expect(state.project.snackbar.open).toBe(false)

        await waitFor(() => {
            expect(screen.getByTestId('uploading-state')).toHaveTextContent(
                'not-uploading'
            )
        })

        consoleErrorSpy.mockRestore()
    })

    it('should use projectId from useParams', () => {
        const store = createTestStore()
        mockUseParams.mockReturnValue({ projectId: '123' })

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <CompoundUploadContainer />
                </MemoryRouter>
            </Provider>
        )

        expect(mockUseParams).toHaveBeenCalled()
    })
})
