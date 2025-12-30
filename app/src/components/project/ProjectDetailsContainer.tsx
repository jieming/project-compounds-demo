import { useQuery } from '@apollo/client/react'
import { gql } from '@apollo/client'
import { useParams } from 'react-router-dom'
import ProjectDetails from './ProjectDetails'
import type { GetProjectsData } from './project-types'
import LoadingIndicator from '../common/loading-indicator/LoadingIndicator'

const GET_PROJECT = gql`
    query GetProject($id: ID!) {
        projects(id: $id) {
            id
            name
            description
        }
    }
`

const ProjectDetailsContainer = () => {
    const { projectId } = useParams<{ projectId: string }>()
    const { loading, error, data } = useQuery<GetProjectsData>(GET_PROJECT, {
        variables: { id: projectId },
        skip: !projectId,
    })

    if (loading) {
        return <LoadingIndicator />
    }

    if (error) {
        return <div>Error: {error.message}</div>
    }

    const project = data?.projects?.[0]

    return <ProjectDetails project={project} />
}

export default ProjectDetailsContainer
