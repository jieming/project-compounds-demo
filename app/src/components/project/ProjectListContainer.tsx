import { useQuery } from '@apollo/client/react'
import { gql } from '@apollo/client'
import ProjectList from './ProjectList'
import type { GetProjectsData } from './project-types'
import LoadingIndicator from '../common/loading-indicator/LoadingIndicator'

const GET_PROJECTS = gql`
    query GetProjects {
        projects {
            id
            name
            description
        }
    }
`

const ProjectListContainer = () => {
    const { loading, error, data } = useQuery<GetProjectsData>(GET_PROJECTS)

    if (loading) {
        return <LoadingIndicator />
    }

    if (error) {
        return <div>Error: {error.message}</div>
    }

    return <ProjectList projects={data ? data.projects : []} />
}

export default ProjectListContainer
