import { CartState } from './';
import { ICartProduct, ShippingAddress} from '../../interfaces';

type SummaryType = {
    numberOfItems: number;
    subtotal: number;
    taxRate: number;
    total: number;
}

type CartActionType = 
| { type: '[Cart] - LoadCart from cookies | storage', payload: ICartProduct[] }
| { type: '[Cart] - Update Products in cart', payload: ICartProduct[] }
| { type: '[Cart] - Change cart quantity', payload: ICartProduct[] }
| { type: '[Cart] - Remove product in cart', payload: ICartProduct }
| { type: '[Cart] - Update Order Summary', payload: SummaryType }
| { type: '[Cart] - LoadAddress from cookies', payload: ShippingAddress }
| { type: '[Cart] - Update ShippingAddress', payload: ShippingAddress }
| { type: '[Cart] - Order complete' }

export const cardReducer = ( state: CartState, action: CartActionType ): CartState => {

    switch (action.type) {
        case '[Cart] - LoadCart from cookies | storage':
            return {
                ...state,
                cart: [ ...action.payload ],
                isLoaded: true,
            };

        case '[Cart] - Update Products in cart':
            return {
                ...state,
                cart: [ ...action.payload ]
            }

        case '[Cart] - Change cart quantity':
            return {
                ...state,
                cart: [ ...action.payload ]
            }

        case '[Cart] - Remove product in cart':
            return {
                ...state,
                cart: state.cart.filter( product => !(product._id === action.payload._id && product.size === action.payload.size) )
            }

        case '[Cart] - Update Order Summary':
            return {
                ...state,
                ...action.payload
            }

        case '[Cart] - Update ShippingAddress':
            return {
                ...state,
                shippingAddress: action.payload
            }
            
        case '[Cart] - LoadAddress from cookies':
            return {
                ...state,
                shippingAddress: action.payload
            }

        case '[Cart] - Order complete':
            return {
                ...state,
                cart: [],
                numberOfItems: 0,
                subtotal: 0,
                taxRate: 0,
                total: 0
            }

        default:
            return state;
    };
};