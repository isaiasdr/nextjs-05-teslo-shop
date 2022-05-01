import type { GetServerSideProps, NextPage } from 'next';
import { Box, Typography } from '@mui/material';

import { ShopLayout } from '../../components/layouts';
import { ProductsList } from '../../components/products';
import { IProduct } from '../../interfaces';
import { getAllProducts, getProductByTerm } from '../../database';


interface Props {
    products: IProduct[];
    query: string;
    foundProducts: boolean;
}

const SearchPage: NextPage<Props> = ({ products, foundProducts, query }) => {

    return (
        <ShopLayout title={'Teslo-Shop - Search'} pageDescription={'Encuentra lo mejores productos del mundo aca'} >

            <Typography variant='h1' component='h1'> Buscar </Typography>

            {
                foundProducts
                ? <Typography variant='h2' sx={{ mb: 1 }}> Termino: { query } </Typography>
                : (
                    <Box display='flex'>
                        <Typography variant='h2' sx={{ mb: 1 }}> No encontramos productos segun su busqueda </Typography>
                        <Typography variant='h2' sx={{ ml: 1 }} color='secondary' textTransform='capitalize'>{ query }</Typography>
                    </Box>
                )
            }

            <ProductsList products={ products } />

        </ShopLayout>
    );
};

export default SearchPage;


export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    
    const { query = '' } = params as { query: string };

    let products = await getProductByTerm( query );

    const foundProducts = products.length > 0 ? true : false;

    if( !foundProducts )
        products = await getAllProducts();

    return {
        props: {
            products,
            query,
            foundProducts
        }
    }
}

