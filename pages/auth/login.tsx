import { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { signIn, getSession, getProviders } from 'next-auth/react';
import NextLink from 'next/link';
import validator from 'validator';
import { Box, Button, Chip, Divider, Grid, Link, TextField, Typography } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

import { AuthLayout } from '../../components/layouts';
import { useForm } from 'react-hook-form';


type formData = {
    email: string;
    password: string;
}

const LoginPage = () => {

    const { query } = useRouter();
    const { register, handleSubmit, formState: { errors } } = useForm<formData>();
    const [ showError, setShowError ] = useState(false);
    const [ providers, setProviders ] = useState<any>({});

    useEffect(() => {
      
        getProviders().then( prov => {
            setProviders(prov); 
        });
      
    }, []);

    const onLoginUser = async ( { email, password }: formData ) => {
        
        setShowError( false );

        await signIn('credentials', { email, password });

        /* const isValidLogin = await loginUser( email, password );

        if( !isValidLogin ) {
            setShowError( true );
            setTimeout( () => setShowError(false), 3000 );
            return ;
        }
        
        const destination = query.p?.toString() || '/';
        replace(destination); */
    }

    return (
        <AuthLayout title='Ingresar'>
            <form onSubmit={ handleSubmit(onLoginUser) } noValidate>
                <Box sx={{ width: 350, padding:'10px 20px' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant='h1' component='h1'>
                                Iniciar Sesion
                            </Typography>

                            <Chip
                                label='No reconocemos ese usuario / contraseña'
                                color='error'
                                icon={ <ErrorOutlineIcon /> }
                                className='fadeIn'
                                sx={{ mt: 2, display: showError ? 'flex' : 'none' }}
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
                                    validate: (value) => {
                                        if(!validator.isEmail(value))
                                            return 'email no tiene formato valido';
                                    }
                                }) }
                                error={ !!errors.email }
                                helperText={ errors.email?.message }
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label='Password'
                                type='password'
                                variant='filled'
                                fullWidth
                                { ...register('password', {
                                    required: 'Este campo es requerido',
                                    minLength: { value: 6, message: 'Minimo 6 caracteres' }
                                }) }
                                error={ !!errors.password }
                                helperText={ errors.password?.message }
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Button 
                                type='submit'
                                color='secondary' 
                                className='circular-btn' 
                                size='large' 
                                fullWidth
                            >
                                Ingresar
                            </Button>
                        </Grid>

                        <Grid item xs={12} display='flex' justifyContent='end'>
                            <NextLink
                                href={ query.p?.toString() ? `/auth/register?p=${ query.p?.toString() }` : '/auth/register'}
                                passHref
                            >
                                <Link underline='always'>
                                    ¿No tienes Cuenta?
                                </Link>
                            </NextLink>
                        </Grid>


                        <Grid item xs={12} display='flex' flexDirection='column' justifyContent='end'>
                            <Divider sx={{ width: '100%', mb: 2 }} />

                            {
                                Object.values( providers ).map( (provider: any) => {

                                    if( provider.id === 'credentials' )
                                        return ( <div key='credentials'></div> );

                                    return (
                                        <Button
                                            key={ provider.id }
                                            variant='outlined'
                                            fullWidth
                                            color='primary'
                                            sx={{ mb: 1 }}
                                            onClick={ () => signIn(provider.id) }
                                        >
                                            { provider.name }
                                        </Button>
                                    )
                                })
                            }
                        </Grid>
                    </Grid>
                </Box>
            </form>
        </AuthLayout>
    );
};

export const getServerSideProps: GetServerSideProps = async ({ req, query}) => {
    
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


export default LoginPage;