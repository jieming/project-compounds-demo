import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useMutation } from '@apollo/client/react'
import { gql } from '@apollo/client'
import { useNavigate } from 'react-router-dom'
import IconButton from '@mui/material/IconButton'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import type { RootState } from '../../../store/store'
import { setCurrentProject, showSnackbar } from '../../../store/projectSlice'
import DeleteProjectConfirmDialog from './DeleteProjectConfirmDialog'
import type { Project } from '../project-types'

const DELETE_PROJECT = gql`
    mutation DeleteProject($id: ID!) {
        deleteProject(id: $id) {
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

const DeleteProjectContainer = () => {
    const [dialogOpen, setDialogOpen] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const currentProject = useSelector(
        (state: RootState) => state.project.currentProject
    )

    const [deleteProject] = useMutation<
        { deleteProject: Project },
        { id: string | number }
    >(DELETE_PROJECT, {
        refetchQueries: [{ query: GET_PROJECTS }],
        awaitRefetchQueries: true,
    })

    const handleOpenDialog = () => {
        setDialogOpen(true)
    }

    const handleCloseDialog = () => {
        setDialogOpen(false)
    }

    const handleConfirmDelete = async () => {
        if (!currentProject) return

        try {
            await deleteProject({
                variables: { id: currentProject.id },
            })
            const projectName = currentProject.name
            dispatch(setCurrentProject(undefined))
            dispatch(
                showSnackbar({
                    message: `Project "${projectName}" has been deleted`,
                    severity: 'success',
                })
            )
            handleCloseDialog()
            navigate('/projects')
        } catch (err) {
            console.error('Error deleting project:', err)
        }
    }

    return (
        <>
            <IconButton
                onClick={handleOpenDialog}
                size="small"
                sx={{
                    color: '#d32f2f',
                    '&:hover': {
                        backgroundColor: 'rgba(211, 47, 47, 0.1)',
                    },
                }}
            >
                <DeleteOutlinedIcon />
            </IconButton>
            <DeleteProjectConfirmDialog
                dialogOpen={dialogOpen}
                handleCloseDialog={handleCloseDialog}
                handleConfirmDelete={handleConfirmDelete}
                currentProject={currentProject}
            />
        </>
    )
}

export default DeleteProjectContainer
