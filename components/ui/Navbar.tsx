import { useContext, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

import { AppBar, Badge, Box, Button, IconButton, Input, InputAdornment, Link, Toolbar, Typography } from '@mui/material';

import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';

import { CartContext, UIContext } from '../../context';

export const Navbar = () => {

    const { asPath, push } = useRouter();
    const { toogleSideMenu } = useContext( UIContext );
    const { numberOfItems } = useContext( CartContext );

    const [ searchTerm, setSearchTerm ] = useState('');
    const [ isSearchVisible, setIsSearchVisible ] = useState(false);

    const navagateTo = ( url: string ) => {
        toogleSideMenu();
        push( url );
    };

    const onSearchTerm = () => {
        if( searchTerm.trim().length === 0 ) return;

        navagateTo( `/search/${ searchTerm }` );
    };

    const clearSearchTerm = () => {
        setSearchTerm('');
        setIsSearchVisible( false );
    };
    
    return (
        <AppBar>
            <Toolbar>
                <NextLink href='/' passHref>
                    <Link display='flex' alignItems='center' >
                        <Typography variant='h6'> Teslo |</Typography>
                        <Typography sx={{ ml: 0.5 }}> Shop </Typography>
                    </Link>
                </NextLink>

                <Box flex='1' />

                <Box className='fadeIn' sx={{ display: isSearchVisible ? 'none' : { xs: 'none', sm: 'block' } }}>
                    <NextLink href='/category/men' passHref>
                        <Link>
                            <Button color={ asPath === '/category/men' ? 'primary' : 'info' }> Hombres </Button>
                        </Link>
                    </NextLink>
                    
                    <NextLink href='/category/women' passHref>
                        <Link>
                            <Button color={ asPath === '/category/women' ? 'primary' : 'info' } > Mujeres </Button>
                        </Link>
                    </NextLink>
                    
                    <NextLink href='/category/kid' passHref>
                        <Link>
                            <Button color={ asPath === '/category/kid' ? 'primary' : 'info' } > Niños </Button>
                        </Link>
                    </NextLink>
                </Box>
                
                <Box flex='1' />

                {
                    isSearchVisible 
                        ? (
                            <Input
                                sx={{ display: { xs:'none', sm:'flex' } }}
                                className='fadeIn'
                                type='text'
                                placeholder="Buscar..."
                                value={ searchTerm }
                                onChange={ (e) => setSearchTerm( e.target.value ) }
                                onKeyPress={ (e) => e.key === 'Enter' && onSearchTerm() }
                                autoFocus
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={ () => clearSearchTerm() }
                                        >
                                            <ClearOutlinedIcon />
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        )
                        : (
                            <IconButton
                                sx={{ display: { xs:'none', sm:'flex' } }}
                                onClick={ () => setIsSearchVisible( true ) }
                                className='fadeIn'
                            >
                                <SearchOutlinedIcon />
                            </IconButton>
                        )
                }
                
                {/* Pantalla pequeña */}
                <IconButton
                    sx={{ display: { xs: 'flex', sm: 'none' } }}
                    onClick = { () => toogleSideMenu() }
                >
                    <SearchOutlinedIcon />
                </IconButton>

                <NextLink href='/cart' passHref>
                    <Link>
                        <Badge color='secondary' badgeContent={ numberOfItems > 9 ? '+9' : numberOfItems }>
                            <ShoppingCartOutlinedIcon />
                        </Badge>
                    </Link>
                </NextLink>

                <Button onClick = { () => toogleSideMenu() } >
                    Menu
                </Button>
                
            </Toolbar>
        </AppBar>
    );
};
