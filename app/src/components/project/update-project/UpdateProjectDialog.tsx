import { useState, useEffect } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

interface UpdateProjectDialogProps {
    open: boolean
    onClose: () => void
    onSubmit: (name: string, description: string) => Promise<void>
    initialName: string
    initialDescription: string
}

const UpdateProjectDialog = ({
    open,
    onClose,
    onSubmit,
    initialName,
    initialDescription,
}: UpdateProjectDialogProps) => {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')

    useEffect(() => {
        if (open) {
            setName(initialName)
            setDescription(initialDescription)
        }
    }, [open, initialName, initialDescription])

    const handleSubmit = async () => {
        if (name.trim() && description.trim()) {
            await onSubmit(name.trim(), description.trim())
        }
    }

    const handleClose = () => {
        setName(initialName)
        setDescription(initialDescription)
        onClose()
    }

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Update Project</DialogTitle>
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
                    Update
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default UpdateProjectDialog
