import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type SnackbarPayload = {
    message: string
    severity?: 'success' | 'error' | 'warning' | 'info'
}

type SnackbarState = {
    open: boolean
    message: string
    severity: 'success' | 'error' | 'warning' | 'info'
}

const initialState: SnackbarState = {
    open: false,
    message: '',
    severity: 'success',
}

const snackbarSlice = createSlice({
    name: 'snackbar',
    initialState,
    reducers: {
        showSnackbar: (state, action: PayloadAction<SnackbarPayload>) => {
            state.open = true
            state.message = action.payload.message
            state.severity = action.payload.severity || 'success'
        },
        hideSnackbar: state => {
            state.open = false
        },
    },
})

export const { showSnackbar, hideSnackbar } = snackbarSlice.actions
export default snackbarSlice.reducer
