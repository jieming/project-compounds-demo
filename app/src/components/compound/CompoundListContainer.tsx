import { useQuery } from '@apollo/client/react'
import { gql } from '@apollo/client'
import { useParams } from 'react-router-dom'
import CompoundList from './CompoundList'
import CompoundUploadZoneContainer from './upload-compounds/CompoundUploadContainer'
import type { GetCompoundsData } from './compound-types'
import LoadingIndicator from '../common/loading-indicator/LoadingIndicator'

const GET_COMPOUNDS = gql`
    query GetCompounds($projectId: ID!) {
        compounds(projectId: $projectId) {
            id
            smiles
            mw
            logD
            logP
        }
    }
`

const CompoundListContainer = () => {
    const { projectId } = useParams<{ projectId: string }>()
    const { loading, error, data } = useQuery<GetCompoundsData>(GET_COMPOUNDS, {
        variables: { projectId },
        skip: !projectId,
    })

    if (loading) {
        return <LoadingIndicator />
    }

    if (error) {
        return <div>Error: {error.message}</div>
    }

    const compounds = data ? data.compounds : []

    if (compounds.length === 0) {
        return <CompoundUploadZoneContainer />
    }

    return <CompoundList compounds={compounds} />
}

export default CompoundListContainer
