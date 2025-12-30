import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useMutation } from '@apollo/client/react'
import { gql } from '@apollo/client'
import IconButton from '@mui/material/IconButton'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import type { RootState } from '../../../store/store'
import { showSnackbar } from '../../../store/projectSlice'
import UpdateProjectDialog from './UpdateProjectDialog'
import type { Project } from '../project-types'

const UPDATE_PROJECT = gql`
    mutation UpdateProject($id: ID!, $name: String!, $description: String!) {
        updateProject(id: $id, name: $name, description: $description) {
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

const UpdateProjectContainer = () => {
    const [dialogOpen, setDialogOpen] = useState(false)
    const dispatch = useDispatch()

    const currentProject = useSelector(
        (state: RootState) => state.project.currentProject
    )

    const [updateProject] = useMutation<
        { updateProject: Project },
        { id: string | number; name: string; description: string }
    >(UPDATE_PROJECT, {
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
        if (!currentProject) return

        try {
            await updateProject({
                variables: {
                    id: currentProject.id,
                    name,
                    description,
                },
            })
            dispatch(
                showSnackbar({
                    message: `Project "${name}" has been updated`,
                    severity: 'success',
                })
            )
            handleCloseDialog()
        } catch (err) {
            console.error('Error updating project:', err)
        }
    }

    return (
        <>
            <IconButton
                onClick={handleOpenDialog}
                size="small"
                sx={{
                    color: '#1976d2',
                    '&:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.1)',
                    },
                }}
            >
                <EditOutlinedIcon />
            </IconButton>
            <UpdateProjectDialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                onSubmit={handleSubmit}
                initialName={currentProject?.name || ''}
                initialDescription={currentProject?.description || ''}
            />
        </>
    )
}

export default UpdateProjectContainer
