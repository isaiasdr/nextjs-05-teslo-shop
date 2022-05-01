import { Typography } from '@mui/material';
import React from 'react'
import { ShopLayout } from '../../components/layouts';
import { ProductsList } from '../../components/products';
import { LoadingScreen } from '../../components/ui';
import { useProducts } from '../../hooks';

const WomenPage = () => {
    const { products = [], isLoading, isError } = useProducts('/products?gender=women');

    return (
        <>
            {
                isLoading ? <LoadingScreen /> : (
                    <ShopLayout title='Productos para mujeres' pageDescription='Productos para mujeres'>
                        <Typography variant='h1' component='h1'> Mujeres </Typography>
                        <Typography variant='h2' sx={{ mb: 1 }}> Todo para ellas </Typography>

                        <ProductsList products={ products } />
                    </ShopLayout>
                )
            }
        </>
    );
};

export default WomenPage;