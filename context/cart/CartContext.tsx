import { createContext } from 'react';
import { ICartProduct, ShippingAddress } from '../../interfaces';


interface ContextProps {
    cart: ICartProduct[];
    numberOfItems: number;
    subtotal: number;
    taxRate: number;
    total: number;
    isLoaded: boolean;
    
    shippingAddress?: ShippingAddress;

    addProductToCart: (product: ICartProduct) => void;
    updateCartQuantity: (product: ICartProduct) => void;
    removeCartProduct: (product: ICartProduct) => void;
    updateShippingAddress: (address: ShippingAddress) => void;
    createOrder: () => Promise<{
        hasError: boolean;
        message: string;
    }>;
};

export const CartContext = createContext( {} as ContextProps );