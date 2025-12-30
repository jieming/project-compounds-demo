import projectReducer, {
    setCurrentProject,
    showSnackbar,
    hideSnackbar,
    type Project,
} from './projectSlice'

describe('projectSlice', () => {
    const mockProject: Project = {
        id: '1',
        name: 'Test Project',
        description: 'Test Description',
    }

    describe('initial state', () => {
        it('should return initial state', () => {
            const state = projectReducer(undefined, { type: 'unknown' })
            expect(state).toEqual({
                currentProject: undefined,
                snackbar: {
                    open: false,
                    message: '',
                    severity: 'success',
                },
            })
        })
    })

    describe('setCurrentProject', () => {
        it('should set current project', () => {
            const state = projectReducer(
                undefined,
                setCurrentProject(mockProject)
            )
            expect(state.currentProject).toEqual(mockProject)
        })

        it('should set current project to undefined', () => {
            const previousState = {
                currentProject: mockProject,
                snackbar: {
                    open: false,
                    message: '',
                    severity: 'success' as const,
                },
            }
            const state = projectReducer(
                previousState,
                setCurrentProject(undefined)
            )
            expect(state.currentProject).toBeUndefined()
        })

        it('should replace existing current project', () => {
            const existingProject: Project = {
                id: '2',
                name: 'Existing Project',
                description: 'Existing Description',
            }
            const previousState = {
                currentProject: existingProject,
                snackbar: {
                    open: false,
                    message: '',
                    severity: 'success' as const,
                },
            }
            const state = projectReducer(
                previousState,
                setCurrentProject(mockProject)
            )
            expect(state.currentProject).toEqual(mockProject)
            expect(state.currentProject).not.toEqual(existingProject)
        })
    })

    describe('showSnackbar', () => {
        it('should show snackbar with message and severity', () => {
            const state = projectReducer(
                undefined,
                showSnackbar({
                    message: 'Test message',
                    severity: 'error',
                })
            )
            expect(state.snackbar).toEqual({
                open: true,
                message: 'Test message',
                severity: 'error',
            })
        })

        it('should show snackbar with default severity when not provided', () => {
            const state = projectReducer(
                undefined,
                showSnackbar({
                    message: 'Test message',
                })
            )
            expect(state.snackbar).toEqual({
                open: true,
                message: 'Test message',
                severity: 'success',
            })
        })

        it('should show snackbar with different severity types', () => {
            const severities = ['success', 'error', 'warning', 'info'] as const

            severities.forEach(severity => {
                const state = projectReducer(
                    undefined,
                    showSnackbar({
                        message: 'Test message',
                        severity,
                    })
                )
                expect(state.snackbar.severity).toBe(severity)
                expect(state.snackbar.open).toBe(true)
            })
        })

        it('should replace existing snackbar message', () => {
            const previousState = {
                currentProject: undefined,
                snackbar: {
                    open: true,
                    message: 'Old message',
                    severity: 'success' as const,
                },
            }
            const state = projectReducer(
                previousState,
                showSnackbar({
                    message: 'New message',
                    severity: 'error',
                })
            )
            expect(state.snackbar.message).toBe('New message')
            expect(state.snackbar.severity).toBe('error')
            expect(state.snackbar.open).toBe(true)
        })
    })

    describe('hideSnackbar', () => {
        it('should hide snackbar', () => {
            const previousState = {
                currentProject: undefined,
                snackbar: {
                    open: true,
                    message: 'Test message',
                    severity: 'success' as const,
                },
            }
            const state = projectReducer(previousState, hideSnackbar())
            expect(state.snackbar.open).toBe(false)
            expect(state.snackbar.message).toBe('Test message')
            expect(state.snackbar.severity).toBe('success')
        })

        it('should not affect other state when hiding snackbar', () => {
            const previousState = {
                currentProject: mockProject,
                snackbar: {
                    open: true,
                    message: 'Test message',
                    severity: 'error' as const,
                },
            }
            const state = projectReducer(previousState, hideSnackbar())
            expect(state.snackbar.open).toBe(false)
            expect(state.currentProject).toEqual(mockProject)
        })
    })

    describe('combined actions', () => {
        it('should handle multiple actions independently', () => {
            let state = projectReducer(
                undefined,
                setCurrentProject(mockProject)
            )
            expect(state.currentProject).toEqual(mockProject)

            state = projectReducer(
                state,
                showSnackbar({
                    message: 'Project created',
                    severity: 'success',
                })
            )
            expect(state.currentProject).toEqual(mockProject)
            expect(state.snackbar.open).toBe(true)
            expect(state.snackbar.message).toBe('Project created')

            state = projectReducer(state, hideSnackbar())
            expect(state.currentProject).toEqual(mockProject)
            expect(state.snackbar.open).toBe(false)

            state = projectReducer(state, setCurrentProject(undefined))
            expect(state.currentProject).toBeUndefined()
            expect(state.snackbar.open).toBe(false)
        })
    })
})
