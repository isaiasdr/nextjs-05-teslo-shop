import { ChangeEvent, FC, useEffect, useRef, useState } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Box, Button, capitalize, Card, CardActions, CardMedia, Checkbox, Chip, Divider, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, ListItem, Paper, Radio, RadioGroup, TextField } from '@mui/material';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import UploadOutlinedIcon from '@mui/icons-material/UploadOutlined';
import { useForm } from 'react-hook-form';

import { AdminLayout } from '../../../components/layouts'
import { IProduct } from '../../../interfaces';

import { getProductBySlug } from '../../../database';
import { CustomSnackbar } from '../../../components/ui';
import { tesloApi } from '../../../api';
import { Product } from '../../../models';

const validTypes  = ['shirts','pants','hoodies','hats']
const validGender = ['men','women','kid','unisex']
const validSizes = ['XS','S','M','L','XL','XXL','XXXL']

interface FormData {
    _id?: string;
    description: string;
    images: string[];
    inStock: number;
    price: number;
    sizes: string[];
    slug: string;
    tags: string[];
    title: string;
    type: string;
    gender: string;
}

interface Props {
    product: IProduct;
}
const ProductAdminPage:FC<Props> = ({ product }) => {

    const router = useRouter();
    const [ newTagValue, setNewTagValue ] = useState('');
    const [ success, setSuccess ] = useState(false);
    const [ error, setError ] = useState(false);
    const [ message, setMessage ] = useState('');
    const [ isSaving, setIsSaving ] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const { register, handleSubmit, formState: { errors }, getValues, setValue, watch } = useForm<FormData>({
        defaultValues: product,
    });

    useEffect(() => {
        const subscription = watch(( value, { name, type } ) => {

            if( name === 'title' ) {
                const newSlug = value.title?.trim()
                    .replaceAll(' ', '_')
                    .replaceAll("'", '')
                    .toLocaleLowerCase() || '';


                setValue('slug', newSlug);
            }
        })

      
        return () => subscription.unsubscribe();

    }, [ watch, setValue ]);

    const closeError = () => {
        setError(false);
        setMessage('');
    };

    const closeSuccess = () => {
        setSuccess(false);
        setMessage('');
    };
    
    const onNewTag = () => {
        const currentTags = getValues('tags');

        if( !currentTags.includes( newTagValue ) && newTagValue ) {
            setValue('tags', [...currentTags, newTagValue], { shouldValidate: true });
            setNewTagValue('');
        }
    };

    const onDeleteTag = ( tag: string ) => {
        const updatedTags = getValues('tags').filter( current => current !== tag );
        return setValue('tags', updatedTags, { shouldValidate: true });
    };

    const onFilesSelected = async ({ target }: ChangeEvent<HTMLInputElement> ) => {
        if ( !target.files || target.files.length === 0 )
            return ;

        try {
            for( const file of target.files ) {
                const formData = new FormData();
                formData.append('file', file);
                const { data } = await tesloApi.post<{ message: string }>('/admin/upload', formData);

                const url = data.message;

                const images = getValues('images');
                setValue('images', [...images, url], { shouldValidate: true });

            }
        } catch (error) {
            console.log(error);
        }
    };

    const onDeleteImage = (image: string) => {
        setValue('images', getValues('images').filter( img => img !== image ), { shouldValidate: true });
    }

    const onSubmit = async ( form: FormData ) => {
        
        if ( form.images.length < 2 ) {
            setMessage('Error: debe ingresar al menos 2 imagenes del producto');
            setError( true );
            return ;
        }

        setIsSaving(true);

        try {
            const { data } = await tesloApi({
                url: '/admin/products',
                method: form._id ? 'PUT' : 'POST',
                data: form,
            });

            setSuccess(true);
            setMessage('Producto Actualizado existosamente');

            if( !form._id )
                router.replace(`/admin/product/${ form.slug }`);
            
            setIsSaving(false);

        } catch (error) {
            console.log(error);
            setIsSaving(false);
            setError(true);
            setMessage('No se pudo actualizar el producto');
        }
    }

    const onChangeSize = ( size: string ) => {
        const currentSizes = getValues('sizes');

        if( currentSizes.includes(size) )
            return setValue('sizes', currentSizes.filter( current => current !== size ), { shouldValidate: true });

        return setValue('sizes', [...currentSizes, size], { shouldValidate: true });
    }

    return (
        <AdminLayout 
            title={'Producto'} 
            subTitle={`Editando: ${ product.title }`}
            icon={ <DriveFileRenameOutlineIcon /> }
        >
            <form onSubmit={ handleSubmit( onSubmit ) } >
                <Box display='flex' justifyContent='end' sx={{ mb: 1 }}>
                    <Button 
                        color="secondary"
                        startIcon={ <SaveOutlinedIcon /> }
                        sx={{ width: '150px' }}
                        type="submit"
                        disabled={ isSaving }
                    >
                        Guardar
                    </Button>
                </Box>

                <Grid container spacing={2}>
                    {/* Data */}
                    <Grid item xs={12} sm={ 6 }>

                        <TextField
                            label="Título"
                            variant="filled"
                            fullWidth 
                            sx={{ mb: 1 }}
                            { ...register('title', {
                                required: 'Este campo es requerido',
                                minLength: { value: 2, message: 'Mínimo 2 caracteres' }
                            })}
                            error={ !!errors.title }
                            helperText={ errors.title?.message }
                        />

                        <TextField
                            label="Descripción"
                            variant="filled"
                            fullWidth 
                            multiline
                            sx={{ mb: 1 }}
                            { ...register('description', {
                                required: 'Este campo es requerido',
                            })}
                            error={ !!errors.description }
                            helperText={ errors.description?.message }
                        />

                        <TextField
                            label="Inventario"
                            type='number'
                            variant="filled"
                            fullWidth 
                            sx={{ mb: 1 }}
                            { ...register('inStock', {
                                required: 'Este campo es requerido',
                                min: { value: 0, message: 'Valor minimo 0' },
                            })}
                            error={ !!errors.inStock }
                            helperText={ errors.inStock?.message }
                        />
                        
                        <TextField
                            label="Precio"
                            type='number'
                            variant="filled"
                            fullWidth 
                            sx={{ mb: 1 }}
                            { ...register('price', {
                                required: 'Este campo es requerido',
                                min: { value: 0, message: 'Valor minimo 0' },
                            })}
                            error={ !!errors.price }
                            helperText={ errors.price?.message }
                        />

                        <Divider sx={{ my: 1 }} />

                        <FormControl sx={{ mb: 1 }}>
                            <FormLabel>Tipo</FormLabel>
                            <RadioGroup
                                row
                                value={ getValues('type') }
                                onChange={ ({ target }) => setValue('type', target.value, { shouldValidate: true }) }
                            >
                                {
                                    validTypes.map( option => (
                                        <FormControlLabel 
                                            key={ option }
                                            value={ option }
                                            control={ <Radio color='secondary' /> }
                                            label={ capitalize(option) }
                                        />
                                    ))
                                }
                            </RadioGroup>
                        </FormControl>

                        <FormControl sx={{ mb: 1 }}>
                            <FormLabel>Género</FormLabel>
                            <RadioGroup
                                row
                                value={ getValues('gender') }
                                onChange={ ({ target }) => setValue('gender', target.value, { shouldValidate: true }) }
                            >
                                {
                                    validGender.map( option => (
                                        <FormControlLabel 
                                            key={ option }
                                            value={ option }
                                            control={ <Radio color='secondary' /> }
                                            label={ capitalize(option) }
                                        />
                                    ))
                                }
                            </RadioGroup>
                        </FormControl>

                        <FormGroup>
                            <FormLabel>Tallas</FormLabel>
                            {
                                validSizes.map(size => (
                                    <FormControlLabel 
                                        key={size} 
                                        control={<Checkbox checked={ getValues('sizes').includes(size) } />} 
                                        label={ size }
                                        onChange={ () => onChangeSize(size) }
                                    />
                                ))
                            }
                        </FormGroup>

                    </Grid>

                    {/* Tags e imagenes */}
                    <Grid item xs={12} sm={ 6 }>
                        <TextField
                            label="Slug - URL"
                            variant="filled"
                            fullWidth
                            sx={{ mb: 1 }}
                            { ...register('slug', {
                                required: 'Este campo es requerido',
                                validate: (val) => val.trim().includes(' ') ? 'No puede tener espacios en blanco': undefined
                            })}
                            error={ !!errors.slug }
                            helperText={ errors.slug?.message }
                        />

                        <TextField
                            label="Etiquetas"
                            variant="filled"
                            fullWidth 
                            sx={{ mb: 1 }}
                            helperText="Presiona [spacebar] para agregar"
                            value={ newTagValue }
                            onChange = { ({target}) => setNewTagValue(target.value.trim()) }
                            onKeyUp={ ({ code }) => code === 'Space' && onNewTag() }
                        />
                        
                        <Box sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            listStyle: 'none',
                            p: 0,
                            m: 0,
                        }}
                        component="ul">
                            {
                                getValues('tags').map((tag) => {

                                return (
                                    <Chip
                                        key={tag}
                                        label={tag}
                                        onDelete={ () => onDeleteTag(tag)}
                                        color="primary"
                                        size='small'
                                        sx={{ ml: 1, mt: 1}}
                                    />
                                );
                            })}
                        </Box>

                        <Divider sx={{ my: 2  }}/>
                        
                        <Box display='flex' flexDirection="column">
                            <FormLabel sx={{ mb:1}}>Imágenes</FormLabel>
                            <Button
                                color="secondary"
                                fullWidth
                                startIcon={ <UploadOutlinedIcon /> }
                                sx={{ mb: 3 }}
                                onClick = { () => fileInputRef.current?.click() }
                            >
                                Cargar imagen
                            </Button>

                            <input
                                ref={ fileInputRef }
                                type='file'
                                multiple
                                accept='image/jpeg, image/gif, image/png'
                                style={{ display: 'none' }}
                                onChange={ onFilesSelected }
                            />

                            <Chip 
                                label="Es necesario al 2 imagenes"
                                color='error'
                                variant='outlined'
                                sx={{ display: getValues('images').length < 2 ? 'flex' : 'none' }}
                            />

                            <Grid container spacing={2} mt={2}>
                                {
                                    getValues('images').map( img => (
                                        <Grid item xs={4} sm={3} key={img}>
                                            <Card>
                                                <CardMedia 
                                                    component='img'
                                                    className='fadeIn'
                                                    image={ img }
                                                    alt={ img }
                                                />
                                                <CardActions>
                                                    <Button 
                                                        fullWidth 
                                                        color="error"
                                                        onClick={ () => onDeleteImage(img) }
                                                    >
                                                        Borrar
                                                    </Button>
                                                </CardActions>
                                            </Card>
                                        </Grid>
                                    ))
                                }
                            </Grid>

                        </Box>

                    </Grid>

                </Grid>
            </form>

            <CustomSnackbar 
                isOpen={ error } 
                severity='error' 
                closeSnackbar={ closeError } 
                message='Error al actualizar el producto'
            />

            <CustomSnackbar 
                isOpen={ success } 
                severity='success' 
                closeSnackbar={ closeSuccess } 
                message='Producto actualizado correctamente'
            />
        </AdminLayout>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
    
    const { slug = '' } = query;

    let product: IProduct | null;

    if( slug === 'new' ) {
        const tempProduct = JSON.parse( JSON.stringify( new Product() ) );
        delete tempProduct._id;
        tempProduct.images = [ 'img1.jpg', 'img2.jpg' ];
        product = tempProduct;
    }
    
    else
        product = await getProductBySlug(slug.toString());

    if ( !product ) {
        return {
            redirect: {
                destination: '/admin/products',
                permanent: false,
            }
        }
    }
    

    return {
        props: {
            product
        }
    }
}


export default ProductAdminPage