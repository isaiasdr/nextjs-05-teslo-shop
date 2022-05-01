import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { useForm } from 'react-hook-form';
import { Box, Button, FormControl, FormHelperText, Grid, MenuItem, TextField, Typography } from '@mui/material';

import { ShopLayout } from '../../components/layouts';
import { countries } from '../../utils';
import { CartContext } from '../../context';


type FormData = {
    firstName: string;
    lastName: string;
    address: string;
    address2?: string;
    zip: string;
    city: string;
    country: string;
    phone: string;
}

const AddressPage = () => {

    const { push } = useRouter();
    const { updateShippingAddress } = useContext( CartContext );
    const [ defaultCountry, setDefaultCountry ] = useState('');

    const getAddressFromCookies = (): FormData => {

        return {
            firstName: Cookies.get('firstName') || '',
            lastName: Cookies.get('lastName') || '',
            address: Cookies.get('address') || '',
            address2: Cookies.get('address2') || '',
            zip: Cookies.get('zip') || '',
            city: Cookies.get('city') || '',
            country: Cookies.get('country') || countries[0].code,
            phone: Cookies.get('phone') || '',
        }
    };
    
    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
        defaultValues: {
            firstName: '',
            lastName: '',
            address: '',
            address2: '',
            zip: '',
            city: '',
            country: countries[0].code,
            phone: '',
        }
    });

    useEffect(() => {
        const addressFromCookies = getAddressFromCookies();
        reset(getAddressFromCookies());

        setDefaultCountry( addressFromCookies.country );
    }, [ reset ]);

    const onAddressSubmit = ( data : FormData ) => {
        updateShippingAddress(data);
        push('/checkout/summary');
    };

    return (
        <ShopLayout title='Direccion' pageDescription='Confirmar direccion del destino'>
            <Typography variant='h1' component='h1'>
                Direccion
            </Typography>

            <form onSubmit={ handleSubmit(onAddressSubmit) } noValidate >
                <Grid container spacing={2} sx={{ mt: 2 }} >
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label='Nombre'
                            variant='filled'
                            fullWidth
                            { ...register('firstName', {
                                required: 'El Campo es requerido'
                            }) }
                            error={ !!errors.firstName }
                            helperText={ errors.firstName?.message }
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label='Apellido'
                            variant='filled'
                            fullWidth
                            { ...register('lastName', {
                                required: 'El Campo es requerido'
                            }) }
                            error={ !!errors.lastName }
                            helperText={ errors.lastName?.message }
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label='Direccion'
                            variant='filled'
                            fullWidth
                            { ...register('address', {
                                required: 'El Campo es requerido'
                            }) }
                            error={ !!errors.address }
                            helperText={ errors.address?.message }
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label='Direccion 2 (opcional)'
                            variant='filled'
                            fullWidth
                            { ...register('address2') }
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label='Codigo Postal'
                            variant='filled'
                            fullWidth
                            { ...register('zip', {
                                required: 'El Campo es requerido'
                            }) }
                            error={ !!errors.zip }
                            helperText={ errors.zip?.message }
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label='Ciudad'
                            variant='filled'
                            fullWidth
                            { ...register('city', {
                                required: 'El Campo es requerido'
                            }) }
                            error={ !!errors.city }
                            helperText={ errors.city?.message }
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>

                            {
                                !!defaultCountry && (
                                    <TextField
                                        select
                                        variant='filled'
                                        label='Pais'
                                        defaultValue={ defaultCountry }
                                        { ...register('country', {
                                            required: 'El Campo es requerido',
                                        }) }
                                        error={ !!errors.country }
                                        helperText={ errors.country?.message }
                                    >
                                        {
                                            countries.map( country => (
                                                <MenuItem value={ country.code } key={ country.code }  > { country.name } </MenuItem>
                                            ))
                                        }
                                    </TextField>
                                )
                            }
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label='Telefono'
                            variant='filled'
                            fullWidth
                            { ...register('phone', {
                                required: 'El Campo es requerido'
                            }) }
                            error={ !!errors.phone }
                            helperText={ errors.phone?.message }
                        />
                    </Grid>
                </Grid>

                <Box sx={{ mt:3 }} display='flex' justifyContent='center'>
                    <Button
                        color='secondary'
                        className='circular-btn'
                        size='large'
                        type='submit'
                    >
                        Revisar Pedido
                    </Button>
                </Box>
            </form>
        </ShopLayout>
    );
};

export default AddressPage;