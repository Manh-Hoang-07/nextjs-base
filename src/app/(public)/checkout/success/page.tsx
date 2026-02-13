"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ShoppingBag, ArrowRight } from "lucide-react";

export default function CheckoutSuccessPage() {
    const searchParams = useSearchParams();
    const orderCode = searchParams.get("orderCode");

    return (
        <main className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-8 text-center">
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <div className="absolute inset-0 bg-green-100 rounded-full scale-150 animate-pulse"></div>
                        <CheckCircle2 className="w-20 h-20 text-green-500 relative z-10" />
                    </div>
                </div>

                <h1 className="text-3xl font-black text-gray-900 mb-2">Đặt hàng thành công!</h1>
                <p className="text-gray-500 mb-8">
                    Đơn hàng <span className="font-bold text-gray-900">#{orderCode}</span> của bạn đã được xác nhận và đang được xử lý.
                </p>

                <div className="space-y-3">
                    <Link
                        href={`/user/orders?search=${orderCode || ""}`}
                        className="w-full flex items-center justify-center gap-2 bg-primary text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-primary/20 hover:shadow-xl hover:translate-y-[-2px] transition-all"
                    >
                        <ShoppingBag className="w-5 h-5" />
                        Xem đơn hàng của tôi
                    </Link>

                    <Link
                        href="/"
                        className="w-full flex items-center justify-center gap-2 bg-white text-gray-600 font-bold py-4 px-6 rounded-2xl border border-gray-200 hover:bg-gray-50 transition-all"
                    >
                        Quay về trang chủ
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>

                <p className="mt-8 text-xs text-gray-400">
                    Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của chúng tôi!
                </p>
            </div>
        </main>
    );
}
