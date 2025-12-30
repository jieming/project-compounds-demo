import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import type { Project } from '../project-types'

interface DeleteProjectConfirmDialogProps {
    dialogOpen: boolean
    handleCloseDialog: () => void
    handleConfirmDelete: () => void
    currentProject: Project | undefined
}

const DeleteProjectConfirmDialog = ({
    dialogOpen,
    handleCloseDialog,
    handleConfirmDelete,
    currentProject,
}: DeleteProjectConfirmDialogProps) => {
    return (
        <Dialog
            open={dialogOpen}
            onClose={handleCloseDialog}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>Delete Project</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to delete the project{' '}
                    <strong>{currentProject?.name}</strong>? This action cannot
                    be undone.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseDialog}>Cancel</Button>
                <Button
                    onClick={handleConfirmDelete}
                    variant="contained"
                    color="error"
                >
                    DELETE
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default DeleteProjectConfirmDialog
