"use client";

import { useState } from "react";
import Modal from "@/components/ui/feedback/Modal";
import apiClient from "@/lib/api/client";
import { adminEndpoints } from "@/lib/api/endpoints";
import { useToastContext } from "@/contexts/ToastContext";

interface OrderDetailProps {
    show: boolean;
    order: any;
    onClose: () => void;
    statusEnums: Array<{ value: string; label: string; class: string }>;
}

export default function OrderDetail({ show, order, onClose, statusEnums }: OrderDetailProps) {
    const [updating, setUpdating] = useState(false);
    const [currentStatus, setCurrentStatus] = useState(order?.status);
    const { showSuccess, showError } = useToastContext();

    const handleStatusChange = async (newStatus: string) => {
        try {
            setUpdating(true);
            await apiClient.put(adminEndpoints.orders.updateStatus(order.id), { status: newStatus });
            setCurrentStatus(newStatus);
            showSuccess("Cập nhật trạng thái đơn hàng thành công");
        } catch (error: any) {
            showError(error?.response?.data?.message || "Không thể cập nhật trạng thái");
        } finally {
            setUpdating(false);
        }
    };

    const formatCurrency = (value?: number) => {
        if (value === undefined || value === null) return "-";
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(value);
    };

    if (!order) return null;

    return (
        <Modal
            show={show}
            title={`Chi tiết đơn hàng: ${order.order_number || `#${order.id}`}`}
            onClose={onClose}
            size="xl"
            loading={updating}
        >
            <div className="space-y-8 p-1">
                {/* STATUS BAR SECTION */}
                <section className="bg-gradient-to-r from-gray-50 to-indigo-50/30 p-6 rounded-2xl border border-indigo-100 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-6">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-white rounded-xl shadow-sm border border-indigo-100">
                                <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-1">Trạng thái hiện tại</p>
                                <span className={`inline-flex rounded-full px-4 py-1.5 text-sm font-bold shadow-sm ${statusEnums.find(s => s.value === currentStatus)?.class}`}>
                                    {statusEnums.find(s => s.value === currentStatus)?.label || currentStatus}
                                </span>
                            </div>
                        </div>

                        <div className="flex-1 min-w-[300px]">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Cập nhật trạng thái mới</p>
                            <div className="flex flex-wrap gap-2">
                                {statusEnums.map((status) => (
                                    <button
                                        key={status.value}
                                        onClick={() => handleStatusChange(status.value)}
                                        disabled={updating || currentStatus === status.value}
                                        className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all duration-200 ${currentStatus === status.value
                                            ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                                            : "bg-white border-indigo-200 text-indigo-600 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 hover:shadow-md active:scale-95"
                                            }`}
                                    >
                                        {status.label}
                                    </button>
                                ))}
                                {(currentStatus === "pending" || currentStatus === "confirmed") && (
                                    <button
                                        onClick={() => handleStatusChange("cancelled")}
                                        disabled={updating}
                                        className="px-4 py-2 text-xs font-bold rounded-xl border border-red-200 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 hover:shadow-md active:scale-95 bg-white"
                                    >
                                        Hủy đơn hàng
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* CUSTOMER INFO SECTION */}
                    <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                        <header className="flex items-center space-x-3 pb-3 border-b border-gray-50">
                            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <h4 className="font-bold text-gray-900 uppercase text-xs tracking-widest">Thông tin khách hàng</h4>
                        </header>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between items-center group">
                                <span className="text-gray-500">Họ tên:</span>
                                <span className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{order.customer_name}</span>
                            </div>
                            <div className="flex justify-between items-center group">
                                <span className="text-gray-500">Số điện thoại:</span>
                                <span className="font-mono font-bold text-gray-900">{order.customer_phone}</span>
                            </div>
                            <div className="flex justify-between items-center group">
                                <span className="text-gray-500">Email:</span>
                                <span className="text-gray-900 italic">{order.customer_email || "Chưa cung cấp"}</span>
                            </div>
                            <div className="pt-2 border-t border-gray-50">
                                <p className="text-gray-500 mb-1">Ghi chú từ khách hàng:</p>
                                <div className="p-3 bg-yellow-50/50 rounded-xl border border-yellow-100 text-yellow-800 italic">
                                    {order.notes || "Không có ghi chú nào"}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* SHIPPING ADDRESS SECTION */}
                    <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                        <header className="flex items-center space-x-3 pb-3 border-b border-gray-50">
                            <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <h4 className="font-bold text-gray-900 uppercase text-xs tracking-widest">Địa chỉ giao hàng</h4>
                        </header>
                        <div className="text-sm space-y-3">
                            {order.shipping_address ? (
                                <>
                                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <p className="font-bold text-gray-900 mb-1">{order.shipping_address.name}</p>
                                        <p className="text-gray-600 mb-2 font-mono">{order.shipping_address.phone}</p>
                                        <p className="text-gray-700 leading-relaxed">
                                            {order.shipping_address.address}, {order.shipping_address.ward}, {order.shipping_address.district}, {order.shipping_address.city}
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <p className="text-gray-400 italic">Không tìm thấy thông tin địa chỉ</p>
                            )}
                        </div>
                    </section>
                </div>

                {/* ORDER ITEMS TABLE SECTION */}
                <section className="space-y-4">
                    <header className="flex items-center space-x-3">
                        <div className="p-2 bg-green-50 rounded-lg text-green-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <h4 className="font-bold text-gray-900 uppercase text-xs tracking-widest">Sản phẩm đã đặt</h4>
                    </header>

                    <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm bg-white">
                        <table className="min-w-full divide-y divide-gray-100 text-sm">
                            <thead className="bg-gray-50">
                                <tr className="text-gray-500 uppercase text-[10px] font-bold tracking-widest">
                                    <th className="px-6 py-4 text-left">Sản phẩm</th>
                                    <th className="px-6 py-4 text-center">Số lượng</th>
                                    <th className="px-6 py-4 text-right">Đơn giá</th>
                                    <th className="px-6 py-4 text-right">Thành tiền</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 font-medium">
                                {order.items?.map((item: any) => (
                                    <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900">{item.product_name}</div>
                                            {item.variant_label && (
                                                <span className="mt-1 inline-flex text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full border border-gray-200 uppercase font-bold tracking-tighter">
                                                    {item.variant_label}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center font-mono text-gray-700">{item.quantity}</td>
                                        <td className="px-6 py-4 text-right font-mono text-gray-700">{formatCurrency(item.price)}</td>
                                        <td className="px-6 py-4 text-right font-mono font-bold text-gray-900">{formatCurrency(item.price * item.quantity)}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="bg-gray-50/50">
                                <tr>
                                    <td colSpan={3} className="px-6 py-3 text-right text-gray-500 font-bold">Tạm tính:</td>
                                    <td className="px-6 py-3 text-right font-mono text-gray-700">{formatCurrency(order.subtotal)}</td>
                                </tr>
                                {order.discount_amount > 0 && (
                                    <tr className="text-green-600">
                                        <td colSpan={3} className="px-6 py-3 text-right font-bold">Giảm giá {order.coupon_code && `(${order.coupon_code})`}:</td>
                                        <td className="px-6 py-3 text-right font-mono font-bold">-{formatCurrency(order.discount_amount)}</td>
                                    </tr>
                                )}
                                <tr>
                                    <td colSpan={3} className="px-6 py-3 text-right text-gray-500 font-bold">Phí vận chuyển:</td>
                                    <td className="px-6 py-3 text-right font-mono text-gray-700">{formatCurrency(order.shipping_fee)}</td>
                                </tr>
                                <tr className="border-t border-indigo-100 bg-indigo-50/50">
                                    <td colSpan={3} className="px-6 py-2 text-right">
                                        <span className="text-indigo-600 font-black text-sm uppercase tracking-widest">Tổng cộng thanh toán:</span>
                                    </td>
                                    <td className="px-6 py-2 text-right font-mono font-black text-indigo-700 text-lg">
                                        {formatCurrency(order.total_amount)}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </section>

                {/* MODAL FOOTER */}
                <div className="flex justify-end pt-4">
                    <button
                        onClick={onClose}
                        className="px-10 py-3 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all active:scale-95 shadow-sm"
                    >
                        Đóng cửa sổ
                    </button>
                </div>
            </div>
        </Modal>
    );
}
