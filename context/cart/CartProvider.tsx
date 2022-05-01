import { FC, useEffect, useReducer } from 'react';
import Cookies from 'js-cookie';
import { ICartProduct, IOrder, ShippingAddress } from '../../interfaces';

import { CartContext, cardReducer } from './';
import { countries } from '../../utils';
import { tesloApi } from '../../api';
import axios from 'axios';

export interface CartState {
    cart: ICartProduct[];
    numberOfItems: number;
    subtotal: number;
    taxRate: number;
    total: number;
    isLoaded: boolean;
    shippingAddress?: ShippingAddress;
};

const CART_INITIAL_STATE: CartState = {
    cart: [],
    numberOfItems: 0,
    subtotal: 0,
    taxRate: 0,
    total: 0,
    isLoaded: false,
    shippingAddress: undefined
};

export const CartProvider:FC = ({ children }) => {

    const [ state, dispatch ] = useReducer( cardReducer , CART_INITIAL_STATE );
    
    useEffect(() => {

        try {
            const cookiesProducts = JSON.parse( Cookies.get('cart') || '[]' );
            loadProductsFromCookies( cookiesProducts );
            
        } catch (error) {
            loadProductsFromCookies( [] );
        }

    }, []);

    useEffect(() => {
        if ( Cookies.get('firstName') ) {
            const shippingAddress = {
                firstName: Cookies.get('firstName') || '',
                lastName: Cookies.get('lastName') || '',
                address: Cookies.get('address') || '',
                address2: Cookies.get('address2') || '',
                zip: Cookies.get('zip') || '',
                city: Cookies.get('city') || '',
                country: Cookies.get('country') || countries[0].code,
                phone: Cookies.get('phone') || '',
            };

            return dispatch({
                type: '[Cart] - LoadAddress from cookies',
                payload: shippingAddress
            });
        }
    }, []);
    

    useEffect(() => {
        Cookies.set('cart', JSON.stringify( state.cart ));
    }, [ state.cart ]);

    useEffect(() => {
        
        const numberOfItems = state.cart.reduce( ( prev, current ) => current.quantity + prev, 0 );
        const subtotal = state.cart.reduce( ( prev, current ) => (current.price * current.quantity)  + prev, 0 );
        const taxRate = subtotal * Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);
        const total = subtotal + taxRate;

        const orderSummary = {
            numberOfItems,
            subtotal,
            taxRate,
            total
        };

        return dispatch({
            type: '[Cart] - Update Order Summary',
            payload: orderSummary
        })
    }, [ state.cart ]);

    const loadProductsFromCookies = ( products: ICartProduct[] ) => {

        return dispatch({
            type: '[Cart] - LoadCart from cookies | storage',
            payload: products
        });
    }

    const addProductToCart = ( product: ICartProduct ) => {

        const productInCart = state.cart.some( p => p._id === product._id && p.size === product.size );

        if ( !productInCart ) {
            return dispatch({
                type: '[Cart] - Update Products in cart',
                payload : [ ...state.cart, product ]
            });
        }

        const updatedProducts = state.cart.map( productInCart => {
            if ( productInCart._id !== product._id )
                return productInCart;

            if ( productInCart.size !== product.size )
                return productInCart;

            productInCart.quantity += product.quantity;
            return productInCart;
        });

        return dispatch({
            type: '[Cart] - Update Products in cart',
            payload : updatedProducts
        });
    };

    const updateCartQuantity = ( product: ICartProduct ) => {

        const cartUpdated = state.cart.map( p => {
            if( p._id !== product._id )
                return p;

            if( p.size !== product.size )
                return p;

            p.quantity = product.quantity
            return p;
        });
        
        return dispatch({
            type: '[Cart] - Change cart quantity',
            payload: cartUpdated
        });
    };

    const removeCartProduct = ( product: ICartProduct ) => {
        return dispatch({
            type: '[Cart] - Remove product in cart',
            payload: product
        })
    };

    const updateShippingAddress = ( address: ShippingAddress ) => {

        Cookies.set('firstName', address.firstName);
        Cookies.set('lastName', address.lastName);
        Cookies.set('address', address.address);
        Cookies.set('address2', address.address2 || '');
        Cookies.set('zip', address.zip);
        Cookies.set('city', address.city);
        Cookies.set('country', address.country);
        Cookies.set('phone', address.phone);

        return dispatch({
            type: '[Cart] - Update ShippingAddress',
            payload: address
        });
    };

    const createOrder = async (): Promise<{ hasError: boolean; message: string; }> => {

        if(  !state.shippingAddress )
            throw new Error('No hay direccion de entrega');

        const body: IOrder = {
            orderItems: state.cart.map( p => ({
                ...p,
                size: p.size!
            })),
            shippingAddress: state.shippingAddress,
            numberOfItems: state.numberOfItems,
            subTotal: state.subtotal,
            tax: state.taxRate,
            total: state.total,
            isPaid: false,
        };

        try {
            
            const { data } = await tesloApi.post<IOrder>('/orders', body);

            dispatch({
                type: '[Cart] - Order complete'
            });

            return {
                hasError: false,
                message: data._id!
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
                message: 'Error no controlado, comuniquese con el administrador'
            }


        }


    };

    return (
        <CartContext.Provider value = {{
            ...state,

            //methods
            addProductToCart,
            removeCartProduct,
            updateCartQuantity,
            updateShippingAddress,
            createOrder,
        }}>
            { children }
        </CartContext.Provider>
    );
};