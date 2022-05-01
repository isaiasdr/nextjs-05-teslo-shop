import { useEffect, useState } from 'react';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import useSWR from 'swr';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Grid, MenuItem, Select } from '@mui/material';

import { AdminLayout } from '../../components/layouts'
import { LoadingScreen } from '../../components/ui';
import { IUser } from '../../interfaces';
import { tesloApi } from '../../api';

const roles = [ 'admin', 'client', 'super-user', 'SEO' ];

const UsersPage = () => {

    const { data, error } = useSWR<IUser[]>('/api/admin/users');
    const [ users, setUsers ] = useState<IUser[]>([]);
    
    useEffect(() => {  
        if( data )
            setUsers(data);
    }, [data]);

    if( !data && !error ) return <LoadingScreen />;

    const onRoleUpdated = async ( userId: string, newRole: string ) => {

        const previousUsers = users.map( user => ({ ...user }) );
        const updatedUsers = users.map( user => ({
            ...user,
            role: userId === user._id ? newRole : user.role
        }));

        setUsers(updatedUsers);

        try {
            await tesloApi.put('/admin/users', { userId, role: newRole });

        } catch (error) {
            console.log(error);
            setUsers( previousUsers );
        }
    }

    const columns: GridColDef[] = [
        { field: 'email', headerName: 'Correo', width: 250 },
        { field: 'name', headerName: 'Nombre completo', width: 300 },
        { 
            field: 'role', 
            headerName: 'Rol', 
            width: 300,
            renderCell: ({row}: GridValueGetterParams) => {
                return (
                    <Select
                        value={ row.role }
                        label='Rol'
                        onChange={ ({ target }) => onRoleUpdated( row.id, target.value ) }
                        sx={{ width: '300px' }}
                    >
                        {
                            roles.map( role => ( <MenuItem value={role} key={role} > {role.toUpperCase()} </MenuItem> ) )
                        }
                    </Select>
                )
            }
        },
    ]

    const rows = users.map( user => ({
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
    }));

    return (
        <AdminLayout
            title='Usuarios'
            subTitle='Mantenimiento de usuarios'
            icon={ <PeopleOutlineIcon /> }
        >
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
    )
}

export default UsersPage;