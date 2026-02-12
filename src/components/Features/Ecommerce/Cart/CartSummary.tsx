"use client";

import { ArrowRight } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import Link from "next/link"; // Changed to use Link for checkout
import { useRouter } from "next/navigation";

interface CartSummaryProps {
    subtotal: number;
    isLoading: boolean;
}

export const CartSummary = ({
    subtotal,
    isLoading,
}: CartSummaryProps) => {
    const router = useRouter();

    return (
        <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24 transition-opacity duration-200 ${isLoading ? 'opacity-60 pointer-events-none' : ''}`}>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Tổng tiền giỏ hàng</h2>

            {/* Pricing Details */}
            <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center text-gray-900 font-medium text-lg">
                    <span>Tạm tính</span>
                    <span>
                        {formatCurrency ? formatCurrency(subtotal) : `${subtotal.toLocaleString()}đ`}
                    </span>
                </div>
            </div>

            <div className="bg-blue-50 text-blue-800 text-sm p-3 rounded-lg mb-6">
                Phí vận chuyển và mã giảm giá sẽ được tính ở bước Thanh toán.
            </div>

            {/* Checkout Button */}
            <button
                onClick={() => router.push('/checkout')}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:translate-y-[-1px] transition-all disabled:opacity-70 disabled:cursor-not-allowed text-lg"
            >
                {isLoading ? (
                    "Đang xử lý..."
                ) : (
                    <>
                        Tiến hành thanh toán
                        <ArrowRight className="w-5 h-5" />
                    </>
                )}
            </button>

            {/* Security Note */}
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Bảo mật thanh toán 100%
            </div>
        </div>
    );
};
