import { Metadata } from "next";
import CheckoutPageContent from "@/app/(public)/checkout/CheckoutPageContent";

export const metadata: Metadata = {
    title: "Thanh toán | Ecommerce",
    description: "Hoàn tất đơn hàng của bạn",
};

export default function CheckoutPage() {
    return (
        <main className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Thanh toán</h1>
                <CheckoutPageContent />
            </div>
        </main>
    );
}
