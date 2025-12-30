import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'

const LoadingIndicator = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%',
            }}
        >
            <CircularProgress size={300} />
        </Box>
    )
}

export default LoadingIndicator
