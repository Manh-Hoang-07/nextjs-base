"use client";

import { CartItem } from "@/lib/api/public/cart";
import { CartItemRow } from "./CartItemRow";

interface CartListProps {
    items: CartItem[];
    onUpdateQuantity: (id: number | string, quantity: number) => void;
    onRemove: (id: number | string) => void;
    isLoading: boolean;
}

export const CartList = ({ items, onUpdateQuantity, onRemove, isLoading }: CartListProps) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-100 text-sm font-medium text-gray-500 uppercase tracking-wider">
                <div className="col-span-12 md:col-span-5">Sản phẩm</div>
                <div className="col-span-4 md:col-span-2 text-center">Đơn giá</div>
                <div className="col-span-6 md:col-span-2 text-center">Số lượng</div>
                <div className="col-span-6 md:col-span-3 text-right pr-4">Thành tiền</div>
            </div>

            <div className={`p-6 space-y-4 ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
                {items.map((item) => (
                    <CartItemRow
                        key={item.id}
                        item={item}
                        onUpdateQuantity={onUpdateQuantity}
                        onRemove={onRemove}
                        updating={isLoading}
                    />
                ))}
            </div>
        </div>
    );
};
