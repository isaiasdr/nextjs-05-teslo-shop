import NextLink from 'next/link';
import { Box, Link, Typography } from "@mui/material";
import { ShopLayout } from "../../components/layouts";

import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';


const emptyPage = () => {
    return (
        <ShopLayout title="carrito vacio" pageDescription="no hay articulos en el carrito de compras">
            <Box 
                display='flex'
                justifyContent='center'
                alignItems='center'
                height='calc(100vh - 200px)'
                sx={{ flexDirection: { xs: 'column', sm: 'row' } }}
            >
                <RemoveShoppingCartIcon sx={{ fontSize: 100 }} />
                <Box display='flex' flexDirection='column' alignItems='center'>
                    <Typography>
                        Su carrito esta vacio
                    </Typography>

                    <NextLink href='/' passHref>
                        <Link typography='h4' color='secondary'>
                            Regresar
                        </Link>
                    </NextLink>
                </Box>

            </Box>
        </ShopLayout>
    );
};

export default emptyPage;