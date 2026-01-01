import { useMutation } from '@apollo/client/react'
import { gql } from '@apollo/client'
import { useParams } from 'react-router-dom'
import { useState, useCallback } from 'react'
import CompoundUploadZone from './CompoundUploadZone'
import { parseCSV } from './file-parser-utils'

const BULK_CREATE_COMPOUNDS = gql`
    mutation BulkCreateCompounds(
        $projectId: ID!
        $compounds: [CompoundInput!]!
    ) {
        bulkCreateCompounds(projectId: $projectId, compounds: $compounds) {
            id
            smiles
            mw
            logD
            logP
        }
    }
`

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

const CompoundUploadContainer = () => {
    const { projectId } = useParams<{ projectId: string }>()
    const [uploading, setUploading] = useState(false)

    const [bulkCreateCompounds] = useMutation(BULK_CREATE_COMPOUNDS, {
        refetchQueries: [
            {
                query: GET_COMPOUNDS,
                variables: { projectId },
            },
        ],
        awaitRefetchQueries: true,
    })

    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            if (!projectId || acceptedFiles.length === 0) return

            const file = acceptedFiles[0]
            setUploading(true)

            try {
                // Read file as text
                const text = await file.text()
                const compounds = parseCSV(text)

                if (compounds.length === 0) {
                    console.error('No compounds found in file')
                    setUploading(false)
                    return
                }

                await bulkCreateCompounds({
                    variables: {
                        projectId,
                        compounds,
                    },
                })
            } catch (err) {
                console.error('Error uploading compounds:', err)
            } finally {
                setUploading(false)
            }
        },
        [projectId, bulkCreateCompounds]
    )

    return <CompoundUploadZone onDrop={onDrop} uploading={uploading} />
}

export default CompoundUploadContainer
