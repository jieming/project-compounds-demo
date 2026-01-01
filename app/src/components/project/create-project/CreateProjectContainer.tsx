import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useMutation } from '@apollo/client/react'
import { gql } from '@apollo/client'
import Fab from '@mui/material/Fab'
import AddIcon from '@mui/icons-material/Add'
import CreateProjectDialog from './CreateProjectDialog'
import type { Project } from '../project-types'
import { showSnackbar } from '../../../store/snackbarSlice'

const CREATE_PROJECT = gql`
    mutation CreateProject($name: String!, $description: String!) {
        createProject(name: $name, description: $description) {
            id
            name
            description
        }
    }
`

const GET_PROJECTS = gql`
    query GetProjects {
        projects {
            id
            name
            description
        }
    }
`

const CreateProjectContainer = () => {
    const [dialogOpen, setDialogOpen] = useState(false)
    const dispatch = useDispatch()
    const [createProject] = useMutation<
        { createProject: Project },
        { name: string; description: string }
    >(CREATE_PROJECT, {
        refetchQueries: [{ query: GET_PROJECTS }],
        awaitRefetchQueries: true,
    })

    const handleOpenDialog = () => {
        setDialogOpen(true)
    }

    const handleCloseDialog = () => {
        setDialogOpen(false)
    }

    const handleSubmit = async (name: string, description: string) => {
        try {
            await createProject({
                variables: { name, description },
            })
            dispatch(
                showSnackbar({
                    message: `Project "${name}" has been created`,
                    severity: 'success',
                })
            )
            handleCloseDialog()
        } catch (err) {
            console.error('Error creating project:', err)
        }
    }

    return (
        <>
            <Fab
                color="primary"
                aria-label="add"
                onClick={handleOpenDialog}
                sx={{
                    position: 'fixed',
                    bottom: 57,
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

export default CreateProjectContainer
