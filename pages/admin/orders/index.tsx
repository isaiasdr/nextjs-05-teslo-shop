import React from 'react'
import { Chip, Grid } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';

import { AdminLayout } from '../../../components/layouts';
import useSWR from 'swr';
import { IOrder } from '../../../interfaces/order';
import { LoadingScreen } from '../../../components/ui';
import { IUser } from '../../../interfaces/user';

const columns: GridColDef[] = [
    { field: 'id', headerName: 'Order ID', width: 250 },
    { field: 'email', headerName: 'Correo', width: 250 },
    { field: 'name', headerName: 'Nombre', width: 300 },
    { field: 'total', headerName: 'Total', width: 300 },
    { 
        field: 'isPaid', 
        headerName: 'Pagado', 
        renderCell: ({ row }: GridValueGetterParams) => {
            return row.isPaid 
                ? ( <Chip variant='outlined' label='Pagada' color='success' /> )
                : ( <Chip variant='outlined' label='Pendiente' color='error' /> )

        }
    },
    { field: 'noProducts', headerName: 'No. Productos', align: 'center' },
    { 
        field: 'check', 
        headerName: 'Ver Orden', 
        renderCell: ({ row }: GridValueGetterParams) => {
            return (
                <a href={ `/admin/orders/${ row.id }`} target='_blank' rel='noreferrer'>
                    Ver Orden
                </a>
            )
        }
    },
    { field: 'createdAt', headerName: 'creada en' },
];

const OrdersPage = () => {

    const { data, error } = useSWR<IOrder[]>('/api/admin/orders');
    
    if( !data && !error ) return <LoadingScreen />

    const rows = data!.map( order => ({ 
        id: order._id,
        email: (order.user as IUser ).email,
        name: (order.user as IUser ).name,
        total: order.total,
        isPaid: order.isPaid,
        noProducts: order.numberOfItems,
        createdAt: order.createdAt
    }));

    return (
        <AdminLayout title='Ordenes' subTitle='Mantenimiento de ordenes' icon={ <ConfirmationNumberOutlinedIcon /> } >
            <Grid container className='fadeIn'>
                <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
                    <DataGrid
                        rows={ rows }
                        columns={ columns }
                        pageSize={ 10 }
                        rowsPerPageOptions={ [10] }
                    />
                </Grid>
            </Grid>
        </AdminLayout>
    );
};

export default OrdersPage;