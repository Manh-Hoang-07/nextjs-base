import { CartPage } from "@/components/Features/Ecommerce/Cart/CartPage";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Giỏ hàng | E-commerce Store",
    description: "Xem và quản lý các sản phẩm trong giỏ hàng của bạn.",
};

export default function Page() {
    return (
        <div className="bg-gray-50 min-h-screen">
            <CartPage />
        </div>
    );
}
