import { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

interface CreateProjectDialogProps {
    open: boolean
    onClose: () => void
    onSubmit: (name: string, description: string) => Promise<void>
}

const MAX_NAME_LENGTH = 20
const MAX_DESCRIPTION_LENGTH = 200

const CreateProjectDialog = ({
    open,
    onClose,
    onSubmit,
}: CreateProjectDialogProps) => {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')

    const nameError = name.length > MAX_NAME_LENGTH
    const descriptionError = description.length > MAX_DESCRIPTION_LENGTH

    const isFormValid =
        name.trim() && description.trim() && !nameError && !descriptionError

    const handleSubmit = async () => {
        if (isFormValid) {
            await onSubmit(name.trim(), description.trim())
            setName('')
            setDescription('')
        }
    }

    const handleClose = () => {
        setName('')
        setDescription('')
        onClose()
    }

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Project Name"
                    placeholder="Enter project name"
                    fullWidth
                    variant="outlined"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    error={nameError}
                    helperText={
                        nameError
                            ? `Maximum ${MAX_NAME_LENGTH} characters allowed`
                            : `${name.length}/${MAX_NAME_LENGTH}`
                    }
                    sx={{ mb: 2 }}
                />
                <TextField
                    margin="dense"
                    label="Description"
                    placeholder="Enter project description"
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    required
                    error={descriptionError}
                    helperText={
                        descriptionError
                            ? `Maximum ${MAX_DESCRIPTION_LENGTH} characters allowed`
                            : `${description.length}/${MAX_DESCRIPTION_LENGTH}`
                    }
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={!isFormValid}
                >
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default CreateProjectDialog
