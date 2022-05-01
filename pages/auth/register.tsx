import { useContext, useState } from "react";
import { GetServerSideProps } from 'next';
import { getSession, signIn } from 'next-auth/react';
import { useRouter } from "next/router";
import NextLink from "next/link";
import validator from 'validator';
import { Box, Button, Chip, Grid, Link, TextField, Typography } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useForm } from "react-hook-form";

import { AuthLayout } from '../../components/layouts';
import { AuthContext } from "../../context";

type formData = {
    email: string;
    password: string;
    name: string;
}

const RegisterApp = () => {

    const { replace, query } = useRouter();
    const { registerUser } = useContext( AuthContext );

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<formData>();
    const [ showError, setShowError ] = useState(false);
    const [ messageError, setMessageError ] = useState('');

    const onRegisterForm = async ( { email, password, name }: formData ) => {

        setShowError( false );

        const { hasError, message } = await registerUser( email, password, name );

        if( hasError ) {
            setMessageError( message! );
            setShowError( true );
            setTimeout( () => setShowError(false), 3000 );
            return ;
        }

        await signIn('credentials', { email, password });
        
        /* const destination = query.p?.toString() || '/';
        replace(destination); */
    }

    return (
        <AuthLayout title='Registrarse'>
            <Box sx={{ width: 350, padding:'10px 20px' }}>
                <form onSubmit={ handleSubmit(onRegisterForm) } noValidate >
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant='h1' component='h1'>
                                Registrarse
                            </Typography>

                            <Chip
                                label={ messageError }
                                color='error'
                                icon={ <ErrorOutlineIcon /> }
                                className='fadeIn'
                                sx={{ mt: 2, display: showError ? 'flex' : 'none' }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label='Nombre'
                                variant='filled'
                                fullWidth
                                { ...register('name', {
                                    required: 'Este campo es requerido',
                                    minLength: { value: 2, message: 'Son necesarios al menos 2 caracteres' }
                                }) }
                                error = { !!errors.name }
                                helperText = { errors.name?.message }
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label='Correo'
                                variant='filled'
                                fullWidth
                                type='email'
                                { ...register('email', {
                                    required: 'Este campo es requerido',
                                    validate: ( value ) => {
                                        if( !validator.isEmail( value ) )
                                            return 'email no tiene formato valido';
                                    }
                                }) }
                                error = { !!errors.email }
                                helperText = { errors.email?.message }
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label='Password'
                                variant='filled'
                                fullWidth
                                type='password'
                                { ...register('password', {
                                    required: 'Este campo es requerido',
                                    minLength: { value: 6, message: 'Son necesarios al menos 6 caracteres' }
                                }) }
                                error = { !!errors.password }
                                helperText = { errors.password?.message }
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Button
                                color='secondary'
                                className='circular-btn'
                                size='large'
                                fullWidth
                                type='submit'
                            >
                                Registrarse
                            </Button>
                        </Grid>

                        <Grid item xs={12} display='flex' justifyContent='end'>
                            <NextLink
                                href={ query.p?.toString() ? `/auth/login?p=${ query.p?.toString() }` : '/auth/login'}
                                passHref
                            >
                                <Link underline='always'>
                                    ¿Ya tienes Cuenta?
                                </Link>
                            </NextLink>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </AuthLayout>
    );
};

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
    
    const session = await getSession({ req });
    const { p = '/' } = query; 

    if ( session ) {
        return {
            redirect: {
                destination: p.toString(),
                permanent: false
            }
        }
    }

    return {
        props: {
            
        }
    }
}


export default RegisterApp;