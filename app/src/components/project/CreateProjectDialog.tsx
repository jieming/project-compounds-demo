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
    onSubmit: (name: string, description: string) => void
}

const CreateProjectDialog = ({
    open,
    onClose,
    onSubmit,
}: CreateProjectDialogProps) => {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')

    const handleSubmit = () => {
        if (name.trim() && description.trim()) {
            onSubmit(name.trim(), description.trim())
            setName('')
            setDescription('')
            onClose()
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
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={!name.trim() || !description.trim()}
                >
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default CreateProjectDialog
