import type { NextPage } from 'next';
import { Typography } from '@mui/material';

import { useProducts } from '../hooks';

import { ShopLayout } from '../components/layouts';
import { ProductsList } from '../components/products';
import { LoadingScreen } from '../components/ui';


const HomePage: NextPage = () => {
    
    const { products = [], isLoading, isError } = useProducts('/products');

    return (
        <>
            {
                isLoading ? <LoadingScreen /> : (

                    <ShopLayout title={'Teslo-Shop - Home'} pageDescription={'Encuentra lo mejores productos del mundo aca'} >

                        <Typography variant='h1' component='h1'> Tienda </Typography>
                        <Typography variant='h2' sx={{ mb: 1 }}> Todos los Productos </Typography>

                        <ProductsList products={ products } />

                    </ShopLayout>
                )
            }
        </>
    );
};

export default HomePage;
