import { Typography } from '@mui/material';

import { ShopLayout } from '../../components/layouts';
import { ProductsList } from '../../components/products';
import { LoadingScreen } from '../../components/ui';
import { useProducts } from '../../hooks';


const MenPage = () => {
    const { products = [], isLoading, isError } = useProducts('/products?gender=men');

    return (
        <>
            {
                isLoading ? <LoadingScreen /> : (
                    <ShopLayout title='Productos para hombres' pageDescription='Productos para hombres'>
                        <Typography variant='h1' component='h1'> Hombres </Typography>
                        <Typography variant='h2' sx={{ mb: 1 }}> Todos para ellos </Typography>

                        <ProductsList products={ products } />
                    </ShopLayout>

                )
            }
        </>
    );
};

export default MenPage;