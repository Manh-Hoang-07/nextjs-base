"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import { usePayments } from "@/hooks/usePayments";
import { Loader2, XCircle, CheckCircle2, ShoppingBag, Home } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/utils/formatters";

export default function PaymentVerifyPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const { verifyPayment, isLoading } = usePayments();
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const gateway = params.gateway as string;
        if (!gateway) return;

        // Convert searchParams to an object
        const queryParams: Record<string, string> = {};
        searchParams.forEach((value, key) => {
            queryParams[key] = value;
        });

        const verify = async () => {
            try {
                const data = await verifyPayment(gateway, queryParams);
                setResult(data);
            } catch (err: any) {
                setError(err.message || "Xác minh thanh toán thất bại");
            }
        };

        verify();
    }, [params.gateway, searchParams, verifyPayment]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <Loader2 className="w-16 h-16 text-primary animate-spin" />
                <h1 className="mt-6 text-2xl font-bold text-gray-900">Đang xác minh thanh toán...</h1>
                <p className="mt-2 text-gray-500 text-center px-4">Đừng đóng trình duyệt, quá trình này có thể mất vài giây.</p>
            </div>
        );
    }

    if (error || (result && result.payment_status === "failed")) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 text-center">
                <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-red-100 p-8">
                    <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
                    <h1 className="text-3xl font-black text-gray-900 mb-2">Thanh toán thất bại</h1>
                    <p className="text-gray-500 mb-8">
                        {error || "Giao dịch không thành công hoặc đã bị hủy."}
                    </p>

                    <div className="space-y-3">
                        <button
                            onClick={() => router.push("/checkout")}
                            className="w-full flex items-center justify-center gap-2 bg-primary text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-primary/20 hover:shadow-xl transition-all"
                        >
                            Thử thanh toán lại
                        </button>
                        <Link
                            href="/"
                            className="w-full flex items-center justify-center gap-2 bg-white text-gray-600 font-bold py-4 px-6 rounded-2xl border border-gray-200 hover:bg-gray-50 transition-all font-bold"
                        >
                            <Home className="w-5 h-5" />
                            Về trang chủ
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (result) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 text-center">
                <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-green-100 p-8">
                    <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
                    <h1 className="text-3xl font-black text-gray-900 mb-2">Thanh toán thành công!</h1>
                    <p className="text-gray-500 mb-6">
                        Đơn hàng <span className="font-bold text-gray-900">#{result.order_number}</span> đã được thanh toán thành công.
                    </p>

                    <div className="bg-gray-50 rounded-2xl p-4 mb-8 text-left space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Mã giao dịch:</span>
                            <span className="font-mono font-medium">{result.transaction_id || "N/A"}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Số tiền:</span>
                            <span className="font-bold text-primary">{formatCurrency(Number(result.amount))}</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Link
                            href={`/user/orders/${result.order_id}`}
                            className="w-full flex items-center justify-center gap-2 bg-primary text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-primary/20 hover:shadow-xl transition-all"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            Xem chi tiết đơn hàng
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
