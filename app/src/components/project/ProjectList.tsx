import { DataGrid } from '@mui/x-data-grid'
import type { GridColDef } from '@mui/x-data-grid'
import Paper from '@mui/material/Paper'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import type { CSSProperties } from 'react'
import type { SxProps, Theme } from '@mui/material/styles'
import type { Project } from './project-types'
import CreateProjectContainer from './create-project/CreateProjectContainer'

const styles: Record<string, CSSProperties> = {
    container: {
        display: 'flex',
        height: '100vh',
        width: '100%',
    },
    tableContainer: {
        width: '40%',
        paddingRight: '0.5rem',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
    },
    outletContainer: {
        width: '60%',
        height: '100%',
        padding: '1rem',
        boxSizing: 'border-box',
        backgroundColor: '#d0d0d0',
        color: '#333',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    outletContent: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    placeholderContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
    },
    placeholderText: {
        color: '#666',
        fontSize: '1.2rem',
    },
    projectLink: {
        color: '#1976d2',
        textDecoration: 'underline',
        cursor: 'pointer',
    },
    projectLinkActive: {
        color: '#b8860b',
        fontWeight: 'bold',
        textDecoration: 'underline',
        cursor: 'pointer',
    },
    loadingContainer: {
        padding: '2rem',
        textAlign: 'center',
    },
    errorContainer: {
        padding: '2rem',
        textAlign: 'center',
        color: 'red',
    },
    placeholderImage: {
        width: '400px',
        height: '400px',
    },
}

const paperSx: SxProps<Theme> = {
    height: '100vh',
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    borderRadius: 0,
}

const dataGridSx: SxProps<Theme> = {
    border: 'none',
    width: '100%',
    flex: 1,
    '& .MuiDataGrid-root': {
        borderRadius: 0,
    },
    '& .MuiDataGrid-cell': {
        color: '#212121',
    },
    '& .MuiDataGrid-columnHeader': {
        color: '#212121',
        fontWeight: 600,
    },
}

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID' },
    {
        field: 'name',
        headerName: 'Name',
        renderCell: params => (
            <NavLink
                to={`/projects/${params.row.id}`}
                style={({ isActive }) =>
                    isActive ? styles.projectLinkActive : styles.projectLink
                }
            >
                {params.value}
            </NavLink>
        ),
    },
    { field: 'description', headerName: 'Description', flex: 1 },
]

const paginationModel = {
    page: 0,
    pageSize: 10,
}

const ProjectList = ({ projects }: { projects: Project[] }) => {
    const location = useLocation()
    const hasProjectId = location.pathname !== '/projects'

    return (
        <div style={styles.container}>
            <div style={styles.tableContainer}>
                <Paper sx={paperSx}>
                    <DataGrid
                        columns={columns}
                        rows={projects}
                        paginationModel={paginationModel}
                        sx={dataGridSx}
                    />
                </Paper>
            </div>
            <div style={styles.outletContainer}>
                {hasProjectId ? (
                    <Outlet />
                ) : (
                    <div style={styles.outletContent}>
                        <div style={styles.placeholderContainer}>
                            <img
                                src="/project-placeholder.svg"
                                alt="Select a project"
                                style={styles.placeholderImage}
                            />
                            <p style={styles.placeholderText}>
                                Select a project to view details
                            </p>
                        </div>
                    </div>
                )}
            </div>
            <CreateProjectContainer />
        </div>
    )
}

export default ProjectList
