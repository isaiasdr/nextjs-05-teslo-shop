import { GetServerSideProps, NextPage } from 'next';
import { Box, Card, CardContent, Chip, Divider, Grid, Typography } from '@mui/material';
import CreditCardOffIcon from '@mui/icons-material/CreditCardOff';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';

import { CartList, OrderSummary } from '../../../components/cart';
import { AdminLayout } from '../../../components/layouts';
import { IOrder } from '../../../interfaces/order';
import { countries } from '../../../utils';
import { dbOrders } from '../../../database';

interface Props {
    order: IOrder;
};

const OrderPage: NextPage<Props> = ({ order }) => {

    const { _id, numberOfItems, shippingAddress, subTotal, total, tax, isPaid, orderItems } = order;
    const { firstName, lastName, address, address2, city, country, phone, zip } = shippingAddress;

    const countryName = countries.find( c => c.code === country );

    const summaryOrder = {
        numberOfItems,
        subtotal: subTotal,
        taxRate: tax,
        total
    };

    return (
        <AdminLayout title={ `Resumen de orden ${ _id }` } subTitle='Resumen de la orden' icon={ <ConfirmationNumberOutlinedIcon /> }>
            {
                isPaid ? (
                    <Chip
                        sx={{ my:2 }}
                        label='Orden ya fue pagada'
                        variant='outlined'
                        color='success'
                        icon={ <CreditScoreIcon /> }
                    />
                ) : (
                    <Chip
                        sx={{ my:2 }}
                        label='Pendiente de Pago'
                        variant='outlined'
                        color='error'
                        icon={ <CreditCardOffIcon /> }
                    />
                )
            }

            <Grid container className='fadeIn'>
                <Grid item xs={ 12 } sm={ 7 }>
                    <CartList
                        products={ orderItems }
                    />
                </Grid>

                <Grid item xs={ 12 } sm={ 5 }>
                    <Card className='summary-card'>
                        <CardContent>
                            <Typography variant='h2'>
                                Resumen ({ numberOfItems } { numberOfItems > 1 ? 'Productos' : 'Producto' })
                            </Typography>

                            <Divider sx={{ my:1 }} />                    

                            <Typography> { `${ firstName } ${lastName}` } </Typography>
                            <Typography> { address }{ address2 ? `, ${address2}` : '' } </Typography>
                            <Typography> { city }, { zip } </Typography>
                            <Typography> { countryName!.name } </Typography>
                            <Typography> { phone } </Typography>
                            
                            <Divider sx={{ my:1 }} />

                            <OrderSummary
                                orderValues={ summaryOrder }
                            />

                            <Box sx={{ mt: 3 }} display='flex' flexDirection='column'>
                                <Box sx={{ flex: 1 }} flexDirection='column' >
                                    {
                                        isPaid ? (
                                            <Chip
                                                sx={{ my:2 }}
                                                label='Orden ya fue pagada'
                                                variant='outlined'
                                                color='success'
                                                icon={ <CreditScoreIcon /> }
                                            />
                                        ) : (
                                            <Chip
                                                sx={{ my:2 }}
                                                label='Pendiente por pagar'
                                                variant='outlined'
                                                color='error'
                                                icon={ <CreditCardOffIcon /> }
                                            />
                                        )
                                    }
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </AdminLayout>
    );
};

export default OrderPage;

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
    
    const { id = '' } = query as { id: string };
    const order = await dbOrders.getOrderbyId( id );

    if ( !order ) {
        return {
            redirect: {
                destination: '/admin/orders',
                permanent: false,
            }
        }
    }

    return {
        props: {
            order
        }
    }
}