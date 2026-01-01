import { useMutation } from '@apollo/client/react'
import { gql } from '@apollo/client'
import { useParams } from 'react-router-dom'
import { useState, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import CompoundUploadZone from './CompoundUploadZone'
import { parseCSV } from './file-parser-utils'
import { showSnackbar } from '../../../store/projectSlice'

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
    const dispatch = useDispatch()

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

                const compoundCount = compounds.length
                dispatch(
                    showSnackbar({
                        message: `Successfully uploaded ${compoundCount} compound${
                            compoundCount !== 1 ? 's' : ''
                        }`,
                        severity: 'success',
                    })
                )
            } catch (err) {
                console.error('Error uploading compounds:', err)
            } finally {
                setUploading(false)
            }
        },
        [projectId, bulkCreateCompounds, dispatch]
    )

    return <CompoundUploadZone onDrop={onDrop} uploading={uploading} />
}

export default CompoundUploadContainer
