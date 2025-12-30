import { useState } from 'react'
import Fab from '@mui/material/Fab'
import AddIcon from '@mui/icons-material/Add'
import CreateProjectDialog from './CreateProjectDialog'

const CreateProjectFabButton = () => {
    const [dialogOpen, setDialogOpen] = useState(false)

    const handleOpenDialog = () => {
        setDialogOpen(true)
    }

    const handleCloseDialog = () => {
        setDialogOpen(false)
    }

    const handleSubmit = (name: string, description: string) => {
        console.log('Creating project:', { name, description })
    }

    return (
        <>
            <Fab
                color="primary"
                aria-label="add"
                onClick={handleOpenDialog}
                sx={{
                    position: 'fixed',
                    bottom: 24,
                    left: 24,
                }}
            >
                <AddIcon />
            </Fab>
            <CreateProjectDialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                onSubmit={handleSubmit}
            />
        </>
    )
}

export default CreateProjectFabButton
