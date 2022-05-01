import { GetServerSideProps, NextPage } from 'next';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { Alert, Box, Card, CardContent, Chip, Divider, Grid, Link, Snackbar, Typography, CircularProgress } from '@mui/material';
import CreditCardOffIcon from '@mui/icons-material/CreditCardOff';
import CreditScoreIcon from '@mui/icons-material/CreditScore';

import { CartList, OrderSummary } from '../../components/cart';
import { ShopLayout } from '../../components/layouts';
import { dbOrders } from '../../database';
import { IOrder } from '../../interfaces/order';
import { countries } from '../../utils';
import { getSession } from 'next-auth/react';
import { useState } from 'react';
import { tesloApi } from '../../api';
import { useRouter } from 'next/router';

export type OrderResponseBody = {
    id: string;
    status:
        | "COMPLETED"
        | "SAVED"
        | "APPROVED"
        | "VOIDED"
        | "PAYER_ACTION_REQUIRED";
};


interface Props {
    order: IOrder;
};

const OrderPage: NextPage<Props> = ({ order }) => {

    const router = useRouter();
    const [error, setError] = useState(false);
    const [isPaying, setIsPaying] = useState(false);

    const { _id, numberOfItems, shippingAddress, subTotal, total, tax, isPaid, orderItems } = order;
    const { firstName, lastName, address, address2, city, country, phone, zip } = shippingAddress;

    const countryName = countries.find( c => c.code === country );

    const summaryOrder = {
        numberOfItems,
        subtotal: subTotal,
        taxRate: tax,
        total
    };

    const onOrderCompleted = async ( details: OrderResponseBody ) => {
        if( details.status !== 'COMPLETED' )
            return setError(true);
            
        setIsPaying(true);
        
        try {
            const { data } = await tesloApi.post('orders/pay', {
                transactionId: details.id,
                orderId: order._id
            });

            router.reload();
        } catch (error) {
            console.log(error);
            setError(true);
            setIsPaying(false);
        }
    }

    return (
        <ShopLayout title={ `Resumen de orden ${ _id }` } pageDescription='Resumen de la orden'>
            <Typography variant='h1' component='h1' sx={{ mb: 2 }}>
                Order: { _id }
            </Typography>

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
                                <Box 
                                    justifyContent='center'
                                    className='fadeIn'
                                    sx={{ display: isPaying ? 'flex' : 'none' }}
                                >
                                    <CircularProgress />
                                </Box>

                                <Box sx={{ display: isPaying ? 'none' : 'flex', flex: 1 }} flexDirection='column' >
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
                                            <PayPalButtons
                                                createOrder={(data, actions) => {
                                                    return actions.order.create({
                                                        purchase_units: [
                                                            {
                                                                amount: {
                                                                    value: order.total.toString(),
                                                                },
                                                            },
                                                        ],
                                                    });
                                                }}
                                                onApprove={(data, actions) => {
                                                    return actions.order!.capture().then((details) => {
                                                        onOrderCompleted(details);
                                                    });
                                                }}
                                            />
                                        )
                                    }
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Snackbar open={error} autoHideDuration={6000} onClose={() => setError(false)}>
                <Alert onClose={() => setError(false)} severity="error" sx={{ width: '100%' }}>
                    El pago no se procesado correctamente
                </Alert>
            </Snackbar>
        </ShopLayout>
    );
};

export default OrderPage;

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
    
    const { id = '' } = query as { id: string };
    const session:any = await getSession({ req });

    if( !session ) {
        return {
            redirect: {
                destination: `/auth/login?p=/orders/${ id }`,
                permanent: false,
            }
        }
    }
    
    const order = await dbOrders.getOrderbyId( id );

    if ( !order || order.user !== session.user._id ) {
        return {
            redirect: {
                destination: '/orders/history',
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