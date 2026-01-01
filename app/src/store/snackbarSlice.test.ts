import snackbarReducer, { showSnackbar, hideSnackbar } from './snackbarSlice'

describe('snackbarSlice', () => {
    describe('initial state', () => {
        it('should return initial state', () => {
            const state = snackbarReducer(undefined, { type: 'unknown' })
            expect(state).toEqual({
                open: false,
                message: '',
                severity: 'success',
            })
        })
    })

    describe('showSnackbar', () => {
        it('should show snackbar with message and severity', () => {
            const state = snackbarReducer(
                undefined,
                showSnackbar({
                    message: 'Test message',
                    severity: 'error',
                })
            )
            expect(state).toEqual({
                open: true,
                message: 'Test message',
                severity: 'error',
            })
        })

        it('should show snackbar with default severity when not provided', () => {
            const state = snackbarReducer(
                undefined,
                showSnackbar({
                    message: 'Test message',
                })
            )
            expect(state).toEqual({
                open: true,
                message: 'Test message',
                severity: 'success',
            })
        })

        it('should show snackbar with different severity types', () => {
            const severities = ['success', 'error', 'warning', 'info'] as const

            severities.forEach(severity => {
                const state = snackbarReducer(
                    undefined,
                    showSnackbar({
                        message: 'Test message',
                        severity,
                    })
                )
                expect(state.severity).toBe(severity)
                expect(state.open).toBe(true)
            })
        })

        it('should replace existing snackbar message', () => {
            const previousState = {
                open: true,
                message: 'Old message',
                severity: 'success' as const,
            }
            const state = snackbarReducer(
                previousState,
                showSnackbar({
                    message: 'New message',
                    severity: 'error',
                })
            )
            expect(state.message).toBe('New message')
            expect(state.severity).toBe('error')
            expect(state.open).toBe(true)
        })
    })

    describe('hideSnackbar', () => {
        it('should hide snackbar', () => {
            const previousState = {
                open: true,
                message: 'Test message',
                severity: 'success' as const,
            }
            const state = snackbarReducer(previousState, hideSnackbar())
            expect(state.open).toBe(false)
            expect(state.message).toBe('Test message')
            expect(state.severity).toBe('success')
        })
    })
})
