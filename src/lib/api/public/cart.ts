import { api } from "../client";
import { publicEndpoints } from "@/lib/api/endpoints";
import Cookies from "js-cookie";

const CART_UUID_KEY = "cart_uuid";

export const getCartUuid = () => {
    return Cookies.get(CART_UUID_KEY) || null;
};

export const setCartUuid = (uuid: string) => {
    Cookies.set(CART_UUID_KEY, uuid, { expires: 30, sameSite: 'Lax', path: '/' });
};

export interface CartProduct {
    name: string;
    image?: string | null;
    sku?: string;
    slug?: string; // Assuming API returns this or we need to derive/fetch it. If missing, links might break.
}

export interface CartVariant {
    name: string;
    image?: string | null;
    sku?: string;
    price?: string | number;
}

export interface CartItem {
    id: number; // cart_item_id
    cart_header_id: number;
    product_id: number;
    product_variant_id?: number | null;
    product_name: string;
    variant_name?: string;
    quantity: number;
    unit_price: string | number;
    total_price: string | number;

    // Relations
    product?: CartProduct;
    variant?: CartVariant;
}

export interface CartData {
    cart_id: number;
    cart_uuid: string;
    subtotal: string | number;
    total_amount: string | number;
    items: CartItem[];
}

// Wrapper for the standard API response format provided by user
export interface ApiCartResponse {
    success: boolean;
    message: string;
    data: CartData;
}

export interface AddToCartPayload {
    product_id: number;
    product_variant_id?: number;
    quantity: number;
    cart_uuid?: string | null;
}

export const cartApi = {
    getCart: () => {
        const uuid = getCartUuid();
        return api.get<ApiCartResponse>(publicEndpoints.cart.get, {
            params: { cart_uuid: uuid },
        });
    },

    addToCart: (payload: Omit<AddToCartPayload, "cart_uuid">) => {
        const uuid = getCartUuid();
        return api.post<ApiCartResponse>(publicEndpoints.cart.add, {
            ...payload,
            cart_uuid: uuid
        });
    },

    updateCartItem: (cart_item_id: number | string, quantity: number) => {
        const uuid = getCartUuid();
        return api.put<ApiCartResponse>(publicEndpoints.cart.update(cart_item_id), { quantity }, {
            params: { cart_uuid: uuid }
        });
    },

    removeCartItem: (cart_item_id: number | string) => {
        const uuid = getCartUuid();
        return api.delete<ApiCartResponse>(publicEndpoints.cart.remove(cart_item_id), {
            params: { cart_uuid: uuid }
        });
    },

    clearCart: () => {
        const uuid = getCartUuid();
        return api.delete<ApiCartResponse>(publicEndpoints.cart.clear, {
            params: { cart_uuid: uuid }
        });
    },
};
