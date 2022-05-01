import { Box, Typography } from '@mui/material';
import React from 'react'
import { ShopLayout } from '../components/layouts';

const Custom404 = () => {
    return (
        <ShopLayout title='Page Not Found' pageDescription='No fue entrada la pagina :c'>
            <Box 
                display='flex'
                justifyContent='center'
                alignItems='center'
                height='calc(100vh - 200px)'
                sx={{ flexDirection: { xs: 'column', sm: 'row' } }}
            >
                <Typography
                    variant='h1'
                    component='h1'
                    sx={{ 
                        fontSize: { xs: 15, sm: 25, md: 40 },
                        fontWeight: { xs: 100, sm: 150, md: 200 }
                    }}
                > 
                    404 | 
                </Typography>
                <Typography 
                    marginLeft={2} 
                    sx={{ 
                        fontSize: { xs: 15, sm: 25, md: 40 }, 
                        fontWeight: { xs: 100, sm: 150, md: 200 }
                    }}
                >
                    No encontramos una pagina por aca
                </Typography>
            </Box>
        </ShopLayout>
    );
};

export default Custom404;
