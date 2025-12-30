import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type Project = {
    id: number | string
    name: string
    description: string
}

type SnackbarPayload = {
    message: string
    severity?: 'success' | 'error' | 'warning' | 'info'
}

type ProjectState = {
    currentProject: Project | undefined
    snackbar: {
        open: boolean
        message: string
        severity: 'success' | 'error' | 'warning' | 'info'
    }
}

const initialState: ProjectState = {
    currentProject: undefined,
    snackbar: {
        open: false,
        message: '',
        severity: 'success',
    },
}

const projectSlice = createSlice({
    name: 'project',
    initialState,
    reducers: {
        setCurrentProject: (
            state,
            action: PayloadAction<Project | undefined>
        ) => {
            state.currentProject = action.payload
        },
        showSnackbar: (state, action: PayloadAction<SnackbarPayload>) => {
            state.snackbar = {
                open: true,
                message: action.payload.message,
                severity: action.payload.severity || 'success',
            }
        },
        hideSnackbar: state => {
            state.snackbar.open = false
        },
    },
})

export const { setCurrentProject, showSnackbar, hideSnackbar } =
    projectSlice.actions
export type { SnackbarPayload }
export default projectSlice.reducer
