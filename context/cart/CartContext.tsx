import { ICartProduct, ShippingAddress } from '@component/interfaces';
import { createContext } from 'react';


interface ContextProps {
    isLoaded: boolean;
    cart: ICartProduct[];
    numberOfItems: number;
    subTotal: number;
    tax: number;
    total: number;

    shippingAddress?: ShippingAddress;

    //Mehods
    addProductToCart: (product: ICartProduct) => void;
    updateCartQuantity: (product: ICartProduct) => void;
    removeProductInCart: (product: ICartProduct) => void;
    updateAddress: (address: ShippingAddress) => void;

    //Orders
    createOrder: () => Promise<{ hasError: boolean; message: string; }>;
}


export const CartContext = createContext({} as ContextProps);