import React from 'react';

import { Typography } from '@mui/material';
import { ShopLayout } from '../../components/layouts';
import { ProductsList } from '../../components/products';
import { useProducts } from '../../hooks';
import { LoadingScreen } from '../../components/ui';

const KidPage = () => {
    const { products = [], isLoading, isError } = useProducts('/products?gender=kid');

    return (
        <>
            {
                isLoading ? <LoadingScreen /> : (
                    <ShopLayout title='Productos para niños' pageDescription='Productos para niños'>
                        <Typography variant='h1' component='h1'> Niños </Typography>
                        <Typography variant='h2' sx={{ mb: 1 }}> Todo para los pequeños </Typography>

                        <ProductsList products={ products } />
                    </ShopLayout>

                )
            }
        </>
    );
};

export default KidPage;