import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import type { CSSProperties } from 'react'
import NotFoundRoute from '../common/not-found-page/NotFoundRoute'
import { setCurrentProject } from '../../store/projectSlice'
import type { Project } from './project-types'

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
    heading: {},
    description: {},
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
            <h1 style={styles.heading}>{project.name}</h1>
            <p style={styles.description}>{project.description}</p>
        </div>
    ) : (
        <NotFoundRoute />
    )
}

export default ProjectDetails
