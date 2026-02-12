"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { CartItem } from "@/lib/api/public/cart";
import { formatCurrency } from "@/utils/formatters";
import { useState, useEffect, useRef } from "react";

interface CartItemRowProps {
    item: CartItem;
    onUpdateQuantity: (id: number | string, newQuantity: number) => void;
    onRemove: (id: number | string) => void;
    updating: boolean;
}

export const CartItemRow = ({ item, onUpdateQuantity, onRemove, updating }: CartItemRowProps) => {
    const [qty, setQty] = useState(item.quantity);
    const debounceTimer = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        setQty(item.quantity);
    }, [item.quantity]);

    // Cleanup timer on unmount
    useEffect(() => {
        return () => {
            if (debounceTimer.current) clearTimeout(debounceTimer.current);
        };
    }, []);

    const handleDecrease = () => {
        if (qty > 1) {
            const newQty = qty - 1;
            setQty(newQty);
            onUpdateQuantity(item.id, newQty);
        }
    };

    const handleIncrease = () => {
        // removed stock check
        const newQty = qty + 1;
        setQty(newQty);
        onUpdateQuantity(item.id, newQty);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value);

        // Clear existing timer
        if (debounceTimer.current) clearTimeout(debounceTimer.current);

        if (!isNaN(val) && val >= 1) {
            let newQty = val;

            setQty(newQty);

            // Debounce API call
            debounceTimer.current = setTimeout(() => {
                onUpdateQuantity(item.id, newQty);
            }, 500);
        }
    };

    return (
        <div className="grid grid-cols-12 gap-4 items-center py-6 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors">
            {/* Product Info (Cols 1-5 or 6 depending on layout) */}
            <div className="col-span-12 md:col-span-5 flex gap-4">
                {/* Image */}
                <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                    <Image
                        src={item.product?.image || item.variant?.image || "/placeholder-product.png"}
                        alt={item.product_name}
                        fill
                        className="object-cover"
                    />
                </div>

                {/* Details */}
                <div className="flex flex-col justify-center">
                    <Link
                        href={item.product?.slug ? `/products/${item.product.slug}` : '#'}
                        className="font-medium text-gray-900 hover:text-primary transition-colors line-clamp-2"
                    >
                        {item.product_name}
                    </Link>

                    {(item.variant_name) && ( // Removed is_digital check for now if not in new interface or add it back if needed
                        <div className="mt-1 flex flex-wrap gap-2 text-sm text-gray-500">
                            {item.variant_name && <span>{item.variant_name}</span>}
                        </div>
                    )}

                    {/* Stock Alert (Optional) */}
                    {/* Assuming stock info might not be available in top level item anymore, removed or need specific field */}
                </div>
            </div>

            {/* Unit Price (Cols) */}
            <div className="col-span-4 md:col-span-2 hidden md:flex items-center text-gray-600 font-medium">
                {formatCurrency ? formatCurrency(Number(item.unit_price)) : `${Number(item.unit_price).toLocaleString('vi-VN')}đ`}
            </div>

            {/* Quantity Control */}
            <div className="col-span-6 md:col-span-2 flex items-center">
                <div className="flex items-center border border-gray-300 rounded-md bg-white">
                    <button
                        type="button"
                        onClick={handleDecrease}
                        disabled={qty <= 1 || updating}
                        className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Minus className="w-4 h-4 text-gray-600" />
                    </button>
                    <input
                        type="number"
                        min="1"
                        // removed max={item.stock_quantity} as it's not in the new interface
                        value={qty}
                        onChange={handleInputChange}
                        disabled={updating}
                        className="w-12 text-center text-sm font-medium border-0 focus:ring-0 p-0 text-gray-900 [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <button
                        type="button"
                        onClick={handleIncrease}
                        disabled={updating} // removed stock check
                        className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Plus className="w-4 h-4 text-gray-600" />
                    </button>
                </div>
            </div>

            {/* Total Price & Remove */}
            <div className="col-span-6 md:col-span-3 flex items-center justify-between pl-4">
                <span className="font-bold text-gray-900 text-lg">
                    {formatCurrency ? formatCurrency(Number(item.total_price)) : `${Number(item.total_price).toLocaleString('vi-VN')}đ`}
                </span>

                <button
                    onClick={() => onRemove(item.id)}
                    disabled={updating}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                    title="Xóa sản phẩm"
                >
                    <Trash2 className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};
