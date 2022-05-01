import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Box, Button, Card, CardContent, Divider, Grid, Typography } from '@mui/material';

import { CartList, OrderSummary } from '../../components/cart';
import { ShopLayout } from '../../components/layouts';
import { CartContext } from '../../context';
import { LoadingScreen } from '../../components/ui';

const CartPage = () => {

    const { replace } = useRouter();
    const { isLoaded, cart, numberOfItems, subtotal, taxRate, total } = useContext( CartContext );
    
    useEffect(() => {
        if( isLoaded && cart.length === 0 )
            replace('/cart/empty');

    }, [ isLoaded, cart, replace ]);

    if ( !isLoaded  || cart.length === 0 )
        return (<> <LoadingScreen /> </>);
    
    return (
        <ShopLayout title='Carrito - 3' pageDescription='Carrito de Compras'>
            <Typography variant='h1' component='h1'>
                Carrito
            </Typography>

            <Grid container>
                <Grid item xs={ 12 } sm={ 7 }>
                    <CartList editable />
                </Grid>

                <Grid item xs={ 12 } sm={ 5 }>
                    <Card className='summary-card'>
                        <CardContent>
                            <Typography variant='h2'>
                                Orden
                            </Typography>

                            <Divider sx={{ my:1 }} />

                            <OrderSummary />
                            
                            <Box sx={{ mt: 3 }} >
                                <Button
                                    color='secondary'
                                    className='circular-btn'
                                    fullWidth
                                    href='/checkout/address'
                                >
                                    Checkout
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </ShopLayout>
    )
}

export default CartPage;