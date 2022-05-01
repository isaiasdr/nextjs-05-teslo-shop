import { GetServerSideProps, NextPage } from 'next'
import NextLink from 'next/link';
import { getSession } from 'next-auth/react';

import { Chip, Grid, Link, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRowsProp, GridValueGetterParams } from '@mui/x-data-grid';

import { ShopLayout } from '../../components/layouts';
import { dbOrders } from '../../database';
import { IOrder } from '../../interfaces';


const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'fullname', headerName: 'Nombre Completado', width: 300 },
    { 
        field: 'paid',
        headerName: 'Pagada',
        description: 'Muestra informacion si esta pagada o no',
        width: 200,
        renderCell: (params: GridValueGetterParams) => {
            return (
                params.row.paid
                    ? <Chip color='success' label='Pagada' variant='outlined' />
                    : <Chip color='error' label='No Pagada' variant='outlined' />
            )
        }
    },
    { 
        field: 'order',
        headerName:'Ver Orden',
        sortable: false,
        renderCell: (params: GridValueGetterParams) => {
        return (
            <NextLink href={`/orders/${params.row.orderId}`} passHref>
                <Link underline='always'>
                    ver orden
                </Link>
            </NextLink>
        )
    } }
];


interface Props {
    orders: IOrder[];
};

const HistoryPage: NextPage<Props> = ({ orders }) => {

    const rows: GridRowsProp = orders.map( (order, index) => {
        const { firstName, lastName } = order.shippingAddress;

        return {
            id: index+1,
            paid: order.isPaid,
            fullname: `${firstName} ${lastName}`,
            orderId: order._id
        };
    });

    return (
        <ShopLayout title='Historial de Ordenes' pageDescription='Historial de ordenes del cliente'>
            <Typography variant='h1' component='h1'>
                Historial de Ordenes
            </Typography>

            <Grid container className='fadeIn'>
                <Grid item xs={12} sx={{ height:650, width: '100%' }}>
                    <DataGrid 
                        rows= { rows }
                        columns={ columns }
                        pageSize={ 10 }
                        rowsPerPageOptions={ [10] }
                    />
                </Grid>
            </Grid>
            
        </ShopLayout>
    );
};

export default HistoryPage;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    
    const session: any = await getSession({ req });

    if( !session ) {
        return {
            redirect: {
                destination: '/auth/login?p=/orders/history',
                permanent: false
            }
        }
    }

    const orders = await dbOrders.getOrdersByUser( session.user._id );

    return {
        props: {
            orders
        }
    }
}