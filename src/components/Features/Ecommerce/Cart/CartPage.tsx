"use client";

import { useEffect, useState } from "react";
import { CartData, cartApi, setCartUuid } from "@/lib/api/public/cart";
import { CartList } from "./CartList";
import { CartSummary } from "./CartSummary";
import { EmptyCart } from "./EmptyCart";
import { LoadingSpinner } from "@/components/UI/Loading/LoadingSpinner";
import { useToastContext } from "@/contexts/ToastContext";

export const CartPage = () => {
    const [cart, setCart] = useState<CartData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const toast = useToastContext();
    // ...
    // ...
    // ...
    // ...

    const fetchCart = async () => {
        try {
            const response = await cartApi.getCart();
            // Assuming response.data is the ApiResponse wrapper
            if (response.data.success && response.data.data) {
                setCart(response.data.data);
                if (response.data.data.cart_uuid) {
                    setCartUuid(response.data.data.cart_uuid);
                }
            } else {
                setCart(null); // Or handle error
            }
        } catch (error) {
            console.error("Failed to fetch cart:", error);
        } finally {
            setIsLoading(false);
            setIsUpdating(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const handleUpdateQuantity = async (id: number | string, quantity: number) => {
        setIsUpdating(true);
        try {
            await cartApi.updateCartItem(id, quantity);
            await fetchCart();
        } catch (error) {
            console.error("Failed to update cart:", error);
            setIsUpdating(false);
            toast.showError("Không thể cập nhật số lượng. Vui lòng thử lại.");
        }
    };

    const handleRemoveItem = async (id: number | string) => {
        if (!confirm("Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?")) return;

        setIsUpdating(true);
        try {
            await cartApi.removeCartItem(id);
            await fetchCart();
            toast.showSuccess("Đã xóa sản phẩm khỏi giỏ hàng");
        } catch (error) {
            console.error("Failed to remove item:", error);
            setIsUpdating(false);
            toast.showError("Không thể xóa sản phẩm. Vui lòng thử lại.");
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <LoadingSpinner />
            </div>
        );
    }

    if (!cart || !cart.items || cart.items.length === 0) {
        return <EmptyCart />;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-gray-900 border-l-4 border-primary pl-4">
                Giỏ hàng của bạn
                <span className="ml-2 text-lg font-normal text-gray-500">
                    ({cart.items.length} sản phẩm)
                </span>
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
                {/* Loading Overlay when updating */}
                {isUpdating && <LoadingSpinner variant="local" />}

                {/* Left Column: Cart Items */}
                <div className="lg:col-span-8">
                    <CartList
                        items={cart.items}
                        onUpdateQuantity={handleUpdateQuantity}
                        onRemove={handleRemoveItem}
                        isLoading={isUpdating}
                    />
                </div>

                {/* Right Column: Summary */}
                <div className="lg:col-span-4">
                    <CartSummary
                        subtotal={cart.subtotal ? Number(cart.subtotal) : 0}
                        isLoading={isUpdating}
                    />
                </div>
            </div>
        </div>
    );
};
