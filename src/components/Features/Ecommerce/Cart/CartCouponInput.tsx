"use client";

import { useState } from "react";
import { useDiscount } from "@/hooks/useDiscount";
import { Tag, X, CheckCircle2 } from "lucide-react";

interface CartCouponInputProps {
    cartUuid: string;
    cartId?: number;
    onApplied?: (data: any) => void;
    onRemoved?: () => void;
    initialCoupon?: any;
}

export default function CartCouponInput({
    cartUuid,
    cartId,
    onApplied,
    onRemoved,
    initialCoupon,
}: CartCouponInputProps) {
    const [couponCode, setCouponCode] = useState("");
    const { applyCoupon, removeCoupon, isLoading, appliedCoupon } = useDiscount();

    const handleApply = async () => {
        if (!couponCode.trim()) return;
        try {
            const result = await applyCoupon(cartUuid, couponCode, cartId);
            if (result && onApplied) {
                onApplied(result);
                setCouponCode("");
            }
        } catch (error) {
            // Error handled by hook
        }
    };

    const handleRemove = async () => {
        try {
            await removeCoupon(cartId || cartUuid);
            if (onRemoved) {
                onRemoved();
            }
        } catch (error) {
            // Error handled by hook
        }
    };

    // Use either appliedCoupon from hook or initialCoupon if hook hasn't loaded it yet
    const currentCoupon = appliedCoupon || initialCoupon;

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Tag className="w-4 h-4" />
                Mã giảm giá
            </div>

            {currentCoupon ? (
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <div>
                            <div className="font-bold text-green-800 uppercase">
                                {currentCoupon.coupon_code || currentCoupon.code}
                            </div>
                            <div className="text-xs text-green-700">
                                Đã áp dụng mã giảm giá
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleRemove}
                        className="p-1 hover:bg-green-100 rounded-full text-green-800 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            ) : (
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Nhập mã giảm giá..."
                        className="flex-grow px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all uppercase"
                        onKeyDown={(e) => e.key === "Enter" && handleApply()}
                    />
                    <button
                        onClick={handleApply}
                        disabled={isLoading || !couponCode.trim()}
                        className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-all shadow-sm"
                    >
                        {isLoading ? "Đang áp dụng..." : "Áp dụng"}
                    </button>
                </div>
            )}
        </div>
    );
}
