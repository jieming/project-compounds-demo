import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import ProjectNotifications from './ProjectNotifications'
import projectReducer from '../../../store/projectSlice'
import snackbarReducer from '../../../store/snackbarSlice'
import { showSnackbar } from '../../../store/snackbarSlice'

const createTestStore = () => {
    return configureStore({
        reducer: {
            project: projectReducer,
            snackbar: snackbarReducer,
        },
    })
}

describe('ProjectNotifications', () => {
    it('should not render snackbar when closed', () => {
        const store = createTestStore()
        render(
            <Provider store={store}>
                <ProjectNotifications />
            </Provider>
        )

        const snackbar = screen.queryByRole('alert')
        expect(snackbar).not.toBeInTheDocument()
    })

    it('should render snackbar with message when open', () => {
        const store = createTestStore()
        store.dispatch(
            showSnackbar({
                message: 'Project "Test Project" has been created',
                severity: 'success',
            })
        )

        render(
            <Provider store={store}>
                <ProjectNotifications />
            </Provider>
        )

        const snackbar = screen.getByRole('alert')
        expect(snackbar).toBeInTheDocument()
        expect(snackbar).toHaveTextContent(
            'Project "Test Project" has been created'
        )
    })

    it('should display success severity correctly', () => {
        const store = createTestStore()
        store.dispatch(
            showSnackbar({
                message: 'Project created successfully',
                severity: 'success',
            })
        )

        render(
            <Provider store={store}>
                <ProjectNotifications />
            </Provider>
        )

        const alert = screen.getByRole('alert')
        expect(alert).toHaveClass('MuiAlert-standardSuccess')
    })

    it('should display error severity correctly', () => {
        const store = createTestStore()
        store.dispatch(
            showSnackbar({
                message: 'Failed to delete project',
                severity: 'error',
            })
        )

        render(
            <Provider store={store}>
                <ProjectNotifications />
            </Provider>
        )

        const alert = screen.getByRole('alert')
        expect(alert).toHaveClass('MuiAlert-standardError')
    })

    it('should close snackbar when close button is clicked', async () => {
        const user = userEvent.setup()
        const store = createTestStore()
        store.dispatch(
            showSnackbar({
                message: 'Test message',
                severity: 'success',
            })
        )

        render(
            <Provider store={store}>
                <ProjectNotifications />
            </Provider>
        )

        const snackbar = screen.getByRole('alert')
        expect(snackbar).toBeInTheDocument()

        const closeButton = screen.getByRole('button', { name: /close/i })
        await user.click(closeButton)

        // Wait for the snackbar to close (MUI has transition animations)
        await waitFor(() => {
            expect(store.getState().snackbar.open).toBe(false)
        })
    })

    it('should use default severity of success when not specified', () => {
        const store = createTestStore()
        store.dispatch(
            showSnackbar({
                message: 'Test message',
            })
        )

        render(
            <Provider store={store}>
                <ProjectNotifications />
            </Provider>
        )

        const alert = screen.getByRole('alert')
        expect(alert).toHaveClass('MuiAlert-standardSuccess')
    })
})
