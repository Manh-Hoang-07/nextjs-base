import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { MoveRight } from "lucide-react";

export const EmptyCart = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-white rounded-xl shadow-sm border border-gray-100 animate-in fade-in zoom-in duration-300">
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping opacity-20 duration-1000" />
                <div className="relative w-32 h-32 flex items-center justify-center bg-gray-50 rounded-full border-2 border-dashed border-gray-200">
                    <ShoppingCart className="w-16 h-16 text-gray-300" />
                </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Giỏ hàng của bạn đang trống
            </h2>

            <p className="text-gray-500 max-w-md mx-auto mb-8 text-lg">
                Bạn chưa thêm sản phẩm nào vào giỏ. Hãy dạo một vòng và chọn cho mình những món đồ ưng ý nhé!
            </p>

            <Link
                href="/"
                className="inline-flex items-center gap-2 px-8 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-full shadow-lg shadow-primary/20 hover:shadow-xl hover:translate-y-[-2px] transition-all"
            >
                Tiếp tục mua sắm
                <MoveRight className="w-5 h-5" />
            </Link>
        </div>
    );
};
