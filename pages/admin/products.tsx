import NextLink from 'next/link';
import useSWR from 'swr';
import { Box, Button, CardMedia, Grid, Link } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import InventoryIcon from '@mui/icons-material/Inventory';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

import { AdminLayout } from '../../components/layouts';
import { LoadingScreen } from '../../components/ui';
import { IProduct } from '../../interfaces';
import { currency } from '../../utils';

const columns: GridColDef[] = [
    {
        field: 'img', 
        headerName: 'Foto',
        renderCell: ({row}: GridValueGetterParams) => {
            return (
                <a href={`/product/${ row.slug }`} target='_blank'>
                    <CardMedia 
                        component='img'
                        alt={ row.title }
                        className='fadeIn'
                        image={ row.img }
                    />
                </a>
            )
        }
    },
    { 
        field: 'title', 
        headerName: 'Title', 
        width: 250,
        renderCell: ({row}: GridValueGetterParams) => {
            return (
                <NextLink href={`/admin/products/${ row.slug }`} passHref>
                    <Link underline='always'>
                        { row.title }
                    </Link>
                </NextLink>
            )
        }
    },
    { field: 'gender', headerName: 'Genero' },
    { field: 'type', headerName: 'Tipo' },
    { field: 'inStock', headerName: 'Inventario' },
    { field: 'price', headerName: 'Precio' },
    { field: 'sizes', headerName: 'tallas', width: 250 },
];

const ProductsPage = () => {

    const { data, error } = useSWR<IProduct[]>('/api/admin/products');
    
    if( !data && !error ) return <LoadingScreen />

    const rows = data!.map( product => ({ 
        id: product._id,
        img: product.images[0],
        title: product.title,
        gender: product.gender,
        type: product.type,
        inStock: product.inStock,
        price: currency.format(product.price),
        sizes: product.sizes.join(', '),
        slug: product.slug,
    }));

    return (
        <AdminLayout 
            title={`Productos ${ data?.length }`} 
            subTitle='Mantenimiento de productos' 
            icon={ <InventoryIcon /> } 
        >
            <Box display='flex' justifyContent='end' sx={{ mb: 2 }} >
                <Button 
                    startIcon={ <AddOutlinedIcon /> }
                    color='secondary'
                    href='/admin/products/new'
                >
                    Crear Producto
                </Button>
            </Box>
            <Grid container className='fadeIn'>
                <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
                    <DataGrid
                        rows={ rows }
                        columns={ columns }
                        pageSize={ 10 }
                        rowsPerPageOptions={ [10] }
                    />
                </Grid>
            </Grid>
        </AdminLayout>
    );
};

export default ProductsPage;