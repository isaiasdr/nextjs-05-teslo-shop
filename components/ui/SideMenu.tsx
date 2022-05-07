import { ChangeEvent, useContext, useState } from "react";
import { Box, Divider, Drawer, IconButton, Input, InputAdornment, List, ListItem, ListItemIcon, ListItemText, ListSubheader } from "@mui/material"

import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';
import EscalatorWarningOutlinedIcon from '@mui/icons-material/EscalatorWarningOutlined';
import FemaleOutlinedIcon from '@mui/icons-material/FemaleOutlined';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import MaleOutlinedIcon from '@mui/icons-material/MaleOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';

import { AuthContext, UIContext } from "../../context";
import { useRouter } from 'next/router';

export const SideMenu = () => {

    const { push, asPath } = useRouter();
    const { isMenuOpen, toogleSideMenu } = useContext( UIContext );
    const { user, isLoggedIn, logout } = useContext( AuthContext );
    const [ searchTerm, setSearchTerm ] = useState('');

    const navigateTo = ( url: string ) => {
        toogleSideMenu();
        push( url );
    };

    const onSearchTerm = () => {
        if( searchTerm.trim().length === 0 ) return;

        navigateTo( `/search/${ searchTerm }` );
    };

    /* const handleSearchChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement> ) => {
        e.preventDefault();
        setSearchTerm( e.target.value );
    }; */

    return (
        <Drawer
            open={ isMenuOpen }
            onClose = { () => toogleSideMenu() }
            anchor='right'
            sx={{ backdropFilter: 'blur(4px)', transition: 'all 0.5s ease-out' }}
        >
            <Box sx={{ width: 250, paddingTop: 5 }}>
                
                <List>

                    <ListItem>
                        <Input
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
                                        onClick={ onSearchTerm }
                                    >
                                        <SearchOutlinedIcon />
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </ListItem>

                    {
                        isLoggedIn && (
                            <>
                                <ListItem button>
                                    <ListItemIcon>
                                        <AccountCircleOutlinedIcon/>
                                    </ListItemIcon>
                                    <ListItemText primary={'Perfil'} />
                                </ListItem>

                                <ListItem button onClick={ () => navigateTo('/orders/history') }>
                                    <ListItemIcon>
                                        <ConfirmationNumberOutlinedIcon/>
                                    </ListItemIcon>
                                    <ListItemText primary={'Mis Ordenes'} />
                                </ListItem>
                            </>
                        )
                    }

                    <ListItem onClick={ () => navigateTo('/category/men') } button sx={{ display: { xs: '', sm: 'none' } }}>
                        <ListItemIcon>
                            <MaleOutlinedIcon/>
                        </ListItemIcon>
                        <ListItemText primary={'Hombres'} />
                    </ListItem>

                    <ListItem onClick={ () => navigateTo('/category/women') } button sx={{ display: { xs: '', sm: 'none' } }}>
                        <ListItemIcon>
                            <FemaleOutlinedIcon/>
                        </ListItemIcon>
                        <ListItemText primary={'Mujeres'} />
                    </ListItem>

                    <ListItem onClick={ () => navigateTo('/category/kid') } button sx={{ display: { xs: '', sm: 'none' } }}>
                        <ListItemIcon>
                            <EscalatorWarningOutlinedIcon/>
                        </ListItemIcon>
                        <ListItemText primary={'Niños'} />
                    </ListItem>

                    {
                        isLoggedIn ? (
                            <ListItem button onClick = { () => logout() } >
                                <ListItemIcon>
                                    <LoginOutlinedIcon/>
                                </ListItemIcon>
                                <ListItemText primary={'Salir'} />
                            </ListItem>            
                        ) : (
                            <ListItem button onClick={ () => navigateTo(`/auth/login?p=${ asPath }`) } >
                                <ListItemIcon>
                                    <VpnKeyOutlinedIcon/>
                                </ListItemIcon>
                                <ListItemText primary={'Ingresar'} />
                            </ListItem>
                        )
                    }

                    {
                        user?.role === 'admin' && (
                            <>
                                {/* Admin */}
                                <Divider />
                                <ListSubheader>Admin Panel</ListSubheader>

                                <ListItem button onClick={ () => navigateTo('/admin') } >
                                    <ListItemIcon>
                                        <DashboardOutlinedIcon/>
                                    </ListItemIcon>
                                    <ListItemText primary={'Dashboard'} />
                                </ListItem>

                                <ListItem button onClick={ () => navigateTo('/admin/products') }>
                                    <ListItemIcon>
                                        <CategoryOutlinedIcon/>
                                    </ListItemIcon>
                                    <ListItemText primary={'Productos'} />
                                </ListItem>
                                
                                <ListItem button onClick={ () => navigateTo('/admin/orders') }>
                                    <ListItemIcon>
                                        <ConfirmationNumberOutlinedIcon/>
                                    </ListItemIcon>
                                    <ListItemText primary={'Ordenes'} />
                                </ListItem>

                                <ListItem button onClick={ () => navigateTo('/admin/users') }>
                                    <ListItemIcon>
                                        <AdminPanelSettingsIcon/>
                                    </ListItemIcon>
                                    <ListItemText primary={'Usuarios'} />
                                </ListItem>
                            </>
                        )
                    }

                </List>
            </Box>
        </Drawer>
    )
}
