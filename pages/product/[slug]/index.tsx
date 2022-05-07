import { useContext, useState } from 'react';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { Box, Button, Chip, Grid, Typography } from '@mui/material';

import { ShopLayout } from '../../../components/layouts';
import { ProductSlideshow, SizeSelector } from '../../../components/products';
import { ItemCounter } from '../../../components/ui';

import { getAllProductsSlug, getProductBySlug } from '../../../database';
import { ICartProduct, IProduct, ISize } from '../../../interfaces';
import { useRouter } from 'next/router';
import { CartContext } from '../../../context';


interface Props {
    product: IProduct;
};

const ProductPage: NextPage<Props> = ({ product }) => {

    const { push } = useRouter();
    const { cart, addProductToCart } = useContext(CartContext);

    const [ tempCartProduct, setTempCartProduct ] = useState<ICartProduct>({
        _id: product._id,
        image: product.images[0],
        price: product.price,
        size: undefined,
        slug: product.slug,
        title: product.title,
        gender: product.gender,
        quantity: 1,
    });

    const handleSizeChange = (size: ISize) => {
        setTempCartProduct( currectProduct => ({ ...currectProduct, size }));
    };

    const onUpdateQuantity = ( quantity: number ) => {
        setTempCartProduct( currectProduct => ({ ...currectProduct, quantity }));
    };

    const onAddProduct = () => {
        if( !tempCartProduct.size ) return ;

        addProductToCart( tempCartProduct );
        push( '/cart' );        
    }

    return (
        <ShopLayout title={ product.title } pageDescription={ product.description }>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={7}>
                    <ProductSlideshow images={ product.images } />
                </Grid>

                <Grid item xs={12} sm={5}>
                    <Box display='flex' flexDirection='column'>

                        {/* Titulos */}
                        <Typography variant='h1' component='h1'>
                            { product.title }
                        </Typography>
                        <Typography variant='subtitle1' component='h2'>
                            { `$${ product.price }` }
                        </Typography>

                        {/* Cantidad */}
                        <Box sx={{ my:2 }}>
                            <Typography variant='subtitle1'>
                                Cantidad
                            </Typography>
                            <ItemCounter 
                                maxValue={ product.inStock } 
                                currentValue={ tempCartProduct.quantity }
                                updatedQuantity={ onUpdateQuantity }
                            />
                            <SizeSelector 
                                selectedSize={ tempCartProduct.size } 
                                sizes={ product.sizes }
                                onSelectedSize={ handleSizeChange }
                            />
                        </Box>

                        {/* Agregar al carrito */}
                        {
                            product.inStock > 0 ? (
                                <Button onClick={ onAddProduct } color='secondary' className='circular-btn'>
                                    {
                                        tempCartProduct.size ?
                                            'Agregar al carrito' :
                                            'Seleccione un tamaño primero'
                                    }
                                </Button>
                            ) : (
                                <Chip label="No hay Disponibles" color='error' variant='outlined' />
                            )
                        }

                        {/* Descripcion */}
                        <Box sx={{ mt: 3 }}>
                            <Typography variant='subtitle1'>
                                Descripcion
                            </Typography>
                            <Typography variant='body2'>
                                { product.description }
                            </Typography>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </ShopLayout>
    );
};

export default ProductPage;

/* export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const { slug = '' } = params as { slug: string };
    
    const product = await getProductBySlug( slug );

    if ( !product ) {
        return {
            notFound: true,
        }
    }

    return {
        props: {
            product
        }
    }
} */

export const getStaticPaths: GetStaticPaths = async (ctx) => {

    const productSlugs = await getAllProductsSlug();

    return {
        paths: productSlugs.map( ({slug}) => ({ params: { slug } })),
        fallback: 'blocking',
    };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {

    const { slug = '' } = params as { slug: string };

    const product = await getProductBySlug( slug );

    return {
        props: {
            product
        },
        revalidate: 86400
    };
};