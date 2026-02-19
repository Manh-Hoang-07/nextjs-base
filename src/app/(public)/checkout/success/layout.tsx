import { Metadata } from "next";
import { Suspense } from "react";
import CheckoutSuccessPage from "./page";

export const metadata: Metadata = {
    title: "Đặt hàng thành công | Ecommerce",
    description: "Đơn hàng của bạn đã được xác nhận",
};

export default function SuccessPageWrapper() {
    return (
        <main className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Xác nhận đơn hàng</h1>
                <Suspense fallback={null}>
                    <CheckoutSuccessPage />
                </Suspense>
            </div>
        </main>
    );
}
