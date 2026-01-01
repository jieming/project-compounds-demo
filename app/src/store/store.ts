import { configureStore } from '@reduxjs/toolkit'
import projectReducer from './projectSlice'
import snackbarReducer from './snackbarSlice'

export const store = configureStore({
    reducer: {
        project: projectReducer,
        snackbar: snackbarReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
