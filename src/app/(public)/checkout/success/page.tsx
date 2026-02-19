"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
    CheckCircle2, MapPin, Truck, CreditCard, Package,
    Loader2, ArrowLeft, ShoppingBag, ArrowRight
} from "lucide-react";
import apiClient from "@/lib/api/client";
import { publicEndpoints } from "@/lib/api/endpoints";
import { formatCurrency } from "@/utils/formatters";

interface OrderItem {
    product_name: string;
    variant_name?: string;
    quantity: number;
    unit_price: number | string;
    total_price: number | string;
    image?: string;
}

interface OrderDetail {
    order_number: string;
    status: string;
    order_type: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    shipping_address: any;
    subtotal: number | string;
    shipping_amount: number | string;
    discount_amount: number | string;
    total_amount: number | string;
    currency: string;
    created_at: string;
    payment_method: { name: string; type: "online" | "offline" };
    shipping_method: { name: string };
    items: OrderItem[];
}

export default function CheckoutSuccessPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const orderCode = searchParams.get("orderCode");
    const hashKey = searchParams.get("hashKey");

    const [order, setOrder] = useState<OrderDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!orderCode) { router.push("/"); return; }
        (async () => {
            try {
                setLoading(true);
                const res = await apiClient.get(publicEndpoints.orders.access, {
                    params: { orderCode, hashKey },
                });
                if (res.data.success) setOrder(res.data.data);
                else setError("Không tìm thấy thông tin đơn hàng");
            } catch (err: any) {
                setError(err.response?.data?.message || "Đã có lỗi xảy ra");
            } finally {
                setLoading(false);
            }
        })();
    }, [orderCode, hashKey, router]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <p className="text-gray-400 text-sm">Đang tải thông tin đơn hàng...</p>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
                <Package className="w-14 h-14 text-gray-200" />
                <h2 className="text-lg font-bold text-gray-800">Không tìm thấy đơn hàng</h2>
                <p className="text-gray-500 text-sm">{error}</p>
                <Link href="/" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
                    <ArrowLeft className="w-4 h-4" /> Quay về trang chủ
                </Link>
            </div>
        );
    }

    const addr = (() => {
        const a = order.shipping_address;
        if (typeof a === "object" && a !== null) return a;
        try { return JSON.parse(a); } catch { return { address: a }; }
    })();

    const fullAddress = [
        addr.address_line_1 || addr.address,
        addr.ward,
        addr.district,
        addr.city || addr.province,
    ].filter(Boolean).join(", ");

    const statusMap: Record<string, { label: string; color: string }> = {
        pending: { label: "Chờ xác nhận", color: "text-amber-600 bg-amber-50" },
        processing: { label: "Đang xử lý", color: "text-blue-600 bg-blue-50" },
        shipping: { label: "Đang giao", color: "text-indigo-600 bg-indigo-50" },
        completed: { label: "Hoàn thành", color: "text-green-600 bg-green-50" },
        cancelled: { label: "Đã huỷ", color: "text-gray-600 bg-gray-100" },
    };
    const status = statusMap[order.status] ?? { label: order.status, color: "text-gray-600 bg-gray-100" };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* ──────────── Left: 8 cols ──────────── */}
            <div className="lg:col-span-8 space-y-6">

                {/* Success banner */}
                <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-5">
                    <div className="flex-shrink-0 w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
                        <CheckCircle2 className="w-8 h-8 text-green-500" />
                    </div>
                    <div className="flex-grow min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h1 className="text-xl font-bold text-gray-900">Đặt hàng thành công!</h1>
                            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${status.color}`}>
                                {status.label}
                            </span>
                        </div>
                        <p className="text-sm text-gray-500">
                            Mã đơn hàng: <span className="font-semibold text-gray-800">#{order.order_number}</span>
                            &nbsp;· Cảm ơn <span className="font-semibold text-gray-800">{order.customer_name}</span>!
                        </p>
                    </div>
                </section>

                {/* Recipient info */}
                <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        Thông tin nhận hàng
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Người nhận</p>
                            <p className="font-semibold text-gray-900">{order.customer_name}</p>
                            <p className="text-sm text-gray-500">{order.customer_phone}</p>
                            {order.customer_email && (
                                <p className="text-sm text-gray-400">{order.customer_email}</p>
                            )}
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Địa chỉ giao hàng</p>
                            <p className="text-sm text-gray-700 leading-relaxed">{fullAddress}</p>
                        </div>
                    </div>
                </section>

                {/* Shipping & Payment */}
                <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-base font-bold text-gray-900 mb-5">Phương thức</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
                            <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
                                <Truck className="w-4 h-4 text-gray-600" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Vận chuyển</p>
                                <p className="text-sm font-semibold text-gray-800">{order.shipping_method.name}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
                            <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
                                <CreditCard className="w-4 h-4 text-gray-600" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Thanh toán</p>
                                <p className="text-sm font-semibold text-gray-800">{order.payment_method.name}</p>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    {order.payment_method.type === "online"
                                        ? "Đã thanh toán online"
                                        : "Thanh toán khi nhận hàng"}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Product list */}
                <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4 text-primary" />
                        <h2 className="text-base font-bold text-gray-900">
                            Sản phẩm đã đặt
                            <span className="ml-2 text-sm font-normal text-gray-400">
                                ({order.items.reduce((s, i) => s + i.quantity, 0)} món)
                            </span>
                        </h2>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {order.items.map((item, i) => (
                            <div key={i} className="flex gap-4 px-6 py-4">
                                <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 flex-shrink-0 overflow-hidden">
                                    {(item as any).image
                                        ? <img src={(item as any).image} alt={item.product_name} className="w-full h-full object-cover" />
                                        : <div className="w-full h-full flex items-center justify-center"><Package className="w-5 h-5 text-gray-300" /></div>
                                    }
                                </div>
                                <div className="flex-grow min-w-0 py-0.5">
                                    <p className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug">{item.product_name}</p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {item.variant_name || "Mặc định"} · x{item.quantity}
                                    </p>
                                </div>
                                <div className="text-right py-0.5 flex-shrink-0">
                                    <p className="text-sm font-bold text-gray-900">{formatCurrency(Number(item.total_price))}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{formatCurrency(Number(item.unit_price))}/cái</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Back link */}
                <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Quay về trang chủ
                </Link>
            </div>

            {/* ──────────── Right: 4 cols ──────────── */}
            <div className="lg:col-span-4">
                <div className="sticky top-24 space-y-4">

                    {/* Price summary */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100">
                            <h2 className="text-base font-bold text-gray-900">Tổng kết đơn hàng</h2>
                        </div>
                        <div className="p-6 space-y-3">
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Tạm tính</span>
                                <span className="font-medium text-gray-900">{formatCurrency(Number(order.subtotal))}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Phí vận chuyển</span>
                                <span className="font-medium text-gray-900">{formatCurrency(Number(order.shipping_amount))}</span>
                            </div>
                            {Number(order.discount_amount) > 0 && (
                                <div className="flex justify-between text-sm text-green-600">
                                    <span>Giảm giá</span>
                                    <span className="font-medium">-{formatCurrency(Number(order.discount_amount))}</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                <span className="text-base font-bold text-gray-900">Tổng cộng</span>
                                <span className="text-2xl font-black text-primary">
                                    {formatCurrency(Number(order.total_amount))}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* CTA buttons */}
                    <Link
                        href="/products"
                        className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold py-4 px-6 rounded-2xl shadow-xl shadow-primary/20 hover:shadow-2xl hover:-translate-y-0.5 transition-all"
                    >
                        Tiếp tục mua sắm
                        <ArrowRight className="w-4 h-4" />
                    </Link>

                    <Link
                        href="/user/orders"
                        className="w-full flex items-center justify-center gap-2 bg-white text-gray-600 font-bold py-4 px-6 rounded-2xl border border-gray-200 hover:bg-gray-50 transition-all text-sm"
                    >
                        <ShoppingBag className="w-4 h-4" />
                        Xem lịch sử đơn hàng
                    </Link>

                    <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Bảo mật thanh toán 100%
                    </p>
                </div>
            </div>
        </div>
    );
}
