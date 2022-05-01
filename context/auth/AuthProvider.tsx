import { FC, useReducer, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { signOut, useSession } from 'next-auth/react';

import { AuthContext, authReducer } from './';
import { IUser } from '../../interfaces';
import tesloApi from '../../api/tesloApi';



export interface AuthState {
    isLoggedIn: boolean;
    user?: IUser;
};

const AUTH_INITIAL_STATE: AuthState = {
    isLoggedIn: false,
    user: undefined
};

export const AuthProvider:FC = ({ children }) => {

    const [ state, dispatch ] = useReducer( authReducer , AUTH_INITIAL_STATE );
    const { data, status } = useSession();

    useEffect(() => {
        if( status === 'authenticated' ) {
            dispatch({
                type: '[Auth] - Login',
                payload: data?.user as IUser
            });
        }
    }, [status, data]);
    

    /* useEffect(() => {
        checkToken();
    }, []); */

    const checkToken = async() => {

        if( !Cookies.get('token') ) return ;


        try {
            const { data } = await tesloApi.get('/user/validate-token');
            const { token, user } = data;
            Cookies.set('token', token);
            dispatch({
                type: '[Auth] - Login',
                payload: user
            });

        } catch (error) {
            Cookies.remove('token');
            dispatch({
                type: '[Auth] - Logout'
            });
        }
    }

    const loginUser = async ( email: string, password: string ): Promise<boolean> => {
        
        try {
            const { data } = await tesloApi.post('/user/login', { email, password });
            const { token, user } = data;

            Cookies.set('token', token); 
            dispatch({
                type: '[Auth] - Login',
                payload: user
            });

            return true;

        } catch (error) {
            return false;
        }
    };

    const logout = () => {

        Cookies.remove('cart');

        Cookies.remove('firstName');
        Cookies.remove('lastName');
        Cookies.remove('address');
        Cookies.remove('address2');
        Cookies.remove('zip');
        Cookies.remove('city');
        Cookies.remove('country');
        Cookies.remove('phone');

        signOut();
    }

    const registerUser = async ( email: string, password: string, name: string ): Promise<{hasError: boolean; message?: string}> => {
        try {
            const { data } = await tesloApi.post('/user/register', { email, password, name });
            const { token, user } = data;

            Cookies.set('token', token); 
            dispatch({
                type: '[Auth] - Login',
                payload: user
            });

            return {
                hasError: false
            }

        } catch (error) {
            if( axios.isAxiosError(error) ) {
                return {
                    hasError: true,
                    message: error.response?.data.message
                }
            }

            return {
                hasError: true,
                message: 'No se pudo crear el usuario - intente de nuevo'
            }
        }
    }


    return (
        <AuthContext.Provider value = {{
            ...state,

            //methods
            loginUser,
            registerUser,
            logout,

        }}>
            { children }
        </AuthContext.Provider>
    );
};