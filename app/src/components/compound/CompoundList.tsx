import { DataGrid, GridColumnMenu } from '@mui/x-data-grid'
import type { GridColDef, GridColumnMenuProps } from '@mui/x-data-grid'
import Paper from '@mui/material/Paper'
import type { Compound } from './compound-types'

const CustomColumnMenu = (props: GridColumnMenuProps) => {
    return (
        <GridColumnMenu
            {...props}
            slots={{
                columnMenuColumnsItem: null,
                columnMenuHideItem: null,
            }}
        />
    )
}

interface CompoundListProps {
    compounds: Compound[]
}

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', flex: 1, hideable: false },
    { field: 'smiles', headerName: 'SMILES', flex: 2, hideable: false },
    { field: 'mw', headerName: 'MW', flex: 1, type: 'number', hideable: false },
    {
        field: 'logD',
        headerName: 'LogD',
        flex: 1,
        type: 'number',
        hideable: false,
    },
    {
        field: 'logP',
        headerName: 'LogP',
        flex: 1,
        type: 'number',
        hideable: false,
    },
]

const CompoundList = ({ compounds }: CompoundListProps) => {
    const rows = compounds.map(compound => ({
        id: compound.id,
        smiles: compound.smiles,
        mw: compound.mw,
        logD: compound.logD,
        logP: compound.logP,
    }))

    return (
        <Paper
            sx={{
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <DataGrid
                rows={rows}
                columns={columns}
                pageSizeOptions={[5, 10]}
                disableRowSelectionOnClick
                disableColumnSelector
                slots={{
                    columnMenu: CustomColumnMenu,
                }}
                sx={{
                    flex: 1,
                    minHeight: 0,
                    '& .MuiDataGrid-columnHeaders': {
                        backgroundColor: '#424242',
                        color: 'white',
                    },
                    '& .MuiDataGrid-columnHeader': {
                        backgroundColor: '#424242',
                        color: 'white',
                    },
                    '& .MuiDataGrid-columnHeaderTitle': {
                        color: 'white',
                        fontWeight: 600,
                    },
                }}
            />
        </Paper>
    )
}

export default CompoundList
