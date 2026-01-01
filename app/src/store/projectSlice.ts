import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type Project = {
    id: number | string
    name: string
    description: string
}

type ProjectState = {
    currentProject: Project | undefined
}

const initialState: ProjectState = {
    currentProject: undefined,
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
    },
})

export const { setCurrentProject } = projectSlice.actions
export default projectSlice.reducer
