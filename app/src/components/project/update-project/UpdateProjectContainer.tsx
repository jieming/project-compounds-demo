import IconButton from '@mui/material/IconButton'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'

const handleEdit = () => {
    console.log('Edit project')
}

const UpdateProjectContainer = () => {
    return (
        <IconButton
            onClick={handleEdit}
            size="small"
            sx={{
                color: '#1976d2',
                '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.1)',
                },
            }}
        >
            <EditOutlinedIcon />
        </IconButton>
    )
}

export default UpdateProjectContainer
