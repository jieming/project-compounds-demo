import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '../../../store/store'
import { hideSnackbar } from '../../../store/snackbarSlice'

const ProjectNotifications = () => {
    const dispatch = useDispatch()

    const snackbar = useSelector((state: RootState) => state.snackbar)

    const handleCloseSnackbar = () => {
        dispatch(hideSnackbar())
    }

    return (
        <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
            <Alert
                onClose={handleCloseSnackbar}
                severity={snackbar.severity}
                sx={{ width: '100%' }}
            >
                {snackbar.message}
            </Alert>
        </Snackbar>
    )
}

export default ProjectNotifications
