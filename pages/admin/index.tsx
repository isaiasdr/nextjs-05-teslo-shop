import useSWR from 'swr';
import { Grid, Typography } from '@mui/material';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import CreditCardOffOutlinedIcon from '@mui/icons-material/CreditCardOffOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import CancelPresentationOutlinedIcon from '@mui/icons-material/CancelPresentationOutlined';
import ProductionQuantityLimitsOutlinedIcon from '@mui/icons-material/ProductionQuantityLimitsOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';

import { AdminLayout } from '../../components/layouts';
import { SummaryTile } from '../../components/admin';
import { DashboardSummaryResponse } from '../../interfaces';
import { LoadingScreen } from '../../components/ui';
import { useEffect, useState } from 'react';

const DashboardPage = () => {

    const { data, error } = useSWR<DashboardSummaryResponse>('/api/admin/dashboard', {
        refreshInterval: 30000 //30s
    });

    const [ refreshIn, setRefreshIn ] = useState(30);

    useEffect(() => {
        
        const interval = setInterval( () => {
            setRefreshIn( refreshIn => refreshIn > 0 ? refreshIn -1: 30 );
        }, 1000);

    
        return () => clearInterval(interval)
    }, []);
    

    if( !error && !data )
        return <LoadingScreen />

    if( error ) {
        console.log(error);
        return <Typography> Error al carga la informacion </Typography>
    }

    const { numberOfOrders, paidOrders, noPaidOrders, numberOfClients, numberOfProducts, productsWithNoInventory, lowInventory } = data!;

    return (
        <AdminLayout title="Dashboard" subTitle="Estadisticas Generales" icon={ <DashboardOutlinedIcon /> } >
            <Grid container spacing={2}>
                <SummaryTile 
                    title={ numberOfOrders }
                    subTitle='Ordenes totales'
                    icon={ <CreditCardOutlinedIcon color='secondary' sx={{ fontSize: 40 }} /> }
                />

                <SummaryTile 
                    title={ paidOrders }
                    subTitle='Ordenes pagadas'
                    icon={ <AttachMoneyOutlinedIcon color='success' sx={{ fontSize: 40 }} /> }
                />

                <SummaryTile 
                    title={ noPaidOrders }
                    subTitle='Ordenes pendientes'
                    icon={ <CreditCardOffOutlinedIcon color='error' sx={{ fontSize: 40 }} /> }
                />

                <SummaryTile 
                    title={ numberOfClients }
                    subTitle='Clientes'
                    icon={ <GroupOutlinedIcon color='primary' sx={{ fontSize: 40 }} /> }
                />

                <SummaryTile 
                    title={ numberOfProducts }
                    subTitle='Productos'
                    icon={ <CategoryOutlinedIcon color='warning' sx={{ fontSize: 40 }} /> }
                />

                <SummaryTile 
                    title={ productsWithNoInventory }
                    subTitle='Sin existencias'
                    icon={ <CancelPresentationOutlinedIcon color='error' sx={{ fontSize: 40 }} /> }
                />

                <SummaryTile 
                    title={ lowInventory }
                    subTitle='Bajo Inventario'
                    icon={ <ProductionQuantityLimitsOutlinedIcon color='warning' sx={{ fontSize: 40 }} /> }
                />

                <SummaryTile 
                    title={ refreshIn }
                    subTitle='Actualzacion en: '
                    icon={ <AccessTimeOutlinedIcon color='secondary' sx={{ fontSize: 40 }} /> }
                />
            </Grid>
        </AdminLayout>
    )
}

export default DashboardPage