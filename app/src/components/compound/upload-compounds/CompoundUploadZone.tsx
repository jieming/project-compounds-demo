import { useDropzone } from 'react-dropzone'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import CircularProgress from '@mui/material/CircularProgress'
import type { SxProps, Theme } from '@mui/material/styles'

const uploadZoneSx: SxProps<Theme> = {
    border: '2px dashed #ccc',
    borderRadius: 0,
    padding: 4,
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    backgroundColor: '#fafafa',
    '&:hover': {
        borderColor: '#1976d2',
        backgroundColor: '#f5f5f5',
    },
}

const CompoundUploadZone = ({
    onDrop,
    uploading,
}: {
    onDrop: (acceptedFiles: File[]) => void
    uploading: boolean
}) => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'text/csv': ['.csv'],
            'application/vnd.ms-excel': ['.xls'],
        },
        disabled: uploading,
    })

    return (
        <Paper
            sx={{
                height: '100%',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 2,
                borderRadius: 0,
                backgroundColor: '#e3f2fd',
            }}
        >
            <Box
                {...getRootProps()}
                sx={{
                    ...uploadZoneSx,
                    ...(isDragActive && {
                        borderColor: '#1976d2',
                        backgroundColor: '#e3f2fd',
                    }),
                }}
            >
                <input {...getInputProps()} />
                {uploading ? (
                    <CircularProgress sx={{ mb: 2 }} />
                ) : (
                    <CloudUploadIcon
                        sx={{ fontSize: 48, color: '#1976d2', mb: 2 }}
                    />
                )}
                <Typography variant="h6" component="p" gutterBottom>
                    {uploading
                        ? 'Uploading compounds...'
                        : 'No project compounds found'}
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                >
                    {uploading
                        ? 'Please wait while we process your file'
                        : isDragActive
                        ? 'Drop files here to upload...'
                        : 'Please upload compound files to get started'}
                </Typography>
                {!uploading && (
                    <Typography variant="body2" color="text.secondary">
                        Drag & drop files here or click to browse
                    </Typography>
                )}
                <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 2, display: 'block' }}
                >
                    Supported formats: CSV
                </Typography>
            </Box>
        </Paper>
    )
}

export default CompoundUploadZone
