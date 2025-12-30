import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial'
import UpdateProjectContainer from './update-project/UpdateProjectContainer'
import type { CSSProperties } from 'react'
import type { SxProps, Theme } from '@mui/material/styles'
import NotFoundRoute from '../common/not-found-page/NotFoundRoute'
import { setCurrentProject } from '../../store/projectSlice'
import type { Project } from './project-types'
import DeleteProjectContainer from './delete-project/DeleteProjectContainer'

const styles: Record<string, CSSProperties> = {
    container: {
        position: 'relative',
        width: '100%',
        height: '100%',
    },
    closeLink: {
        position: 'absolute',
        top: '1rem',
        right: '1rem',
        color: '#1976d2',
        textDecoration: 'underline',
        cursor: 'pointer',
        zIndex: 10,
    },
    paper: {
        padding: '1rem',
        height: '160px',
        marginTop: '3rem',
        backgroundColor: 'white',
        border: '1px solid white',
        borderRadius: 0,
        position: 'relative',
    },
    titleContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '1rem',
    },
    folderIcon: {
        fontSize: '1.5rem',
    },
    description: {
        fontStyle: 'italic',
        wordWrap: 'break-word',
        overflowWrap: 'break-word',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        maxHeight: '4.5rem',
    },
    actionButtons: {
        position: 'absolute',
        bottom: '0.5rem',
        right: '0.5rem',
        display: 'flex',
        gap: '0.5rem',
        opacity: 0,
    },
}

const paperSx: SxProps<Theme> = {
    ...styles.paper,
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
        backgroundColor: '#e8f5e9',
        color: '#333',
        border: '1px solid #b0b0b0',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        '& .action-buttons': {
            opacity: 1,
        },
    },
}

const folderIconSx: SxProps<Theme> = {
    ...styles.folderIcon,
    color: 'inherit',
}

const actionButtonsSx: SxProps<Theme> = {
    ...styles.actionButtons,
    transition: 'opacity 0.2s ease-in-out',
}

const ProjectDetails = ({ project }: { project: Project | undefined }) => {
    const dispatch = useDispatch()

    useEffect(() => {
        if (project) {
            dispatch(setCurrentProject(project))
        } else {
            dispatch(setCurrentProject(undefined))
        }
    }, [project, dispatch])

    const handleClose = () => {
        dispatch(setCurrentProject(undefined))
    }

    return project ? (
        <div style={styles.container}>
            <Link to="/projects" onClick={handleClose} style={styles.closeLink}>
                Close
            </Link>
            <Paper sx={paperSx}>
                <Box sx={styles.titleContainer}>
                    <FolderSpecialIcon sx={folderIconSx} />
                    <Typography variant="h5" component="h1">
                        {project.name}
                    </Typography>
                </Box>
                <Typography
                    variant="body1"
                    component="p"
                    sx={styles.description}
                >
                    {project.description}
                </Typography>
                <Box className="action-buttons" sx={actionButtonsSx}>
                    <UpdateProjectContainer />
                    <DeleteProjectContainer />
                </Box>
            </Paper>
        </div>
    ) : (
        <NotFoundRoute />
    )
}

export default ProjectDetails
