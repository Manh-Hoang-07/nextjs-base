"use client";

import { useState, useEffect } from "react";
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

export default function OrderDetail({ show, order: initialOrder, onClose, statusEnums }: OrderDetailProps) {
    const [order, setOrder] = useState(initialOrder);
    const [updating, setUpdating] = useState(false);
    const [loading, setLoading] = useState(false);
    const { showSuccess, showError } = useToastContext();

    useEffect(() => {
        if (show && initialOrder?.id) {
            fetchOrderDetail();
        }
    }, [show, initialOrder?.id]);

    const fetchOrderDetail = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get(adminEndpoints.orders.show(initialOrder.id));
            if (response.data.success) {
                setOrder(response.data.data);
            }
        } catch (error: any) {
            showError(error?.response?.data?.message || "Không thể tải chi tiết đơn hàng");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (newStatus: string) => {
        try {
            setUpdating(true);
            await apiClient.patch(adminEndpoints.orders.updateStatus(order.id), {
                status: newStatus,
                notes: ""
            });
            showSuccess("Cập nhật trạng thái đơn hàng thành công");
            await fetchOrderDetail();
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

    const formatDate = (dateString?: string) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getCurrentStatusInfo = () => {
        const statusCode = typeof order?.status === 'object' ? order.status?.code : order?.status;
        const statusInfo = order?.all_order_statuses?.find((s: any) => s.value === statusCode);

        if (statusInfo) {
            const classInfo = statusEnums.find(e => e.value === statusCode);
            return {
                label: statusInfo.label,
                class: classInfo?.class || "bg-gray-100 text-gray-800"
            };
        }
        return {
            label: statusCode || "-",
            class: "bg-gray-100 text-gray-800"
        };
    };

    if (!order) return null;

    const currentStatus = getCurrentStatusInfo();
    const availableStatuses = order.available_statuses || [];
    const canChangeStatus = availableStatuses.length > 0;

    return (
        <Modal
            show={show}
            title={`Đơn hàng: ${order.order_number || `#${order.id}`}`}
            onClose={onClose}
            size="xl"
            loading={updating || loading}
        >
            <div className="space-y-6 pb-4">
                {/* Tổng quan đơn hàng */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border rounded-lg overflow-hidden bg-white">
                    <div className="p-4 border-r border-b md:border-b-0">
                        <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Mã đơn hàng</p>
                        <p className="text-lg font-bold text-gray-900">{order.order_number}</p>
                    </div>
                    <div className="p-4 border-r border-b md:border-b-0">
                        <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Ngày đặt</p>
                        <p className="text-base font-medium text-gray-900">{formatDate(order.created_at)}</p>
                    </div>
                    <div className="p-4 bg-gray-50/50">
                        <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Tổng cộng</p>
                        <p className="text-lg font-bold text-blue-600">{formatCurrency(order.total_amount)}</p>
                    </div>
                </div>

                {/* Quản lý trạng thái */}
                <div className="bg-white border rounded-lg p-5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium text-gray-600">Trạng thái hiện tại:</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${currentStatus.class}`}>
                                {currentStatus.label}
                            </span>
                        </div>

                        {canChangeStatus && (
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-sm font-medium text-gray-600 mr-2">Chuyển sang:</span>
                                {availableStatuses.map((status: any) => (
                                    <button
                                        key={status.value}
                                        onClick={() => handleStatusChange(status.value)}
                                        disabled={updating}
                                        className="px-3 py-1.5 bg-blue-50 text-blue-600 border border-blue-200 rounded text-xs font-bold hover:bg-blue-600 hover:text-white transition-colors"
                                    >
                                        {status.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Tiến trình và Thông tin khách hàng */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Timeline */}
                        <div className="bg-white border rounded-lg p-5">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Tiến trình</h4>
                            <div className="space-y-0">
                                {order.all_order_statuses
                                    ?.filter((s: any) => s.value !== 'cancelled')
                                    .map((status: any, index: number, array: any[]) => {
                                        const isActive = status.value === order.status;
                                        const isPassed = array.findIndex((s: any) => s.value === order.status) >= index;

                                        return (
                                            <div key={status.value} className="flex gap-3 min-h-[50px]">
                                                <div className="flex flex-col items-center">
                                                    <div className={`w-3 h-3 rounded-full mt-1.5 ${isActive ? 'bg-blue-600 ring-4 ring-blue-100' : isPassed ? 'bg-blue-400' : 'bg-gray-200'
                                                        }`} />
                                                    {index < array.length - 1 && (
                                                        <div className={`w-0.5 flex-1 ${isPassed ? 'bg-blue-100' : 'bg-gray-100'}`} />
                                                    )}
                                                </div>
                                                <div className="pb-4">
                                                    <p className={`text-sm font-medium ${isActive ? 'text-blue-600 font-bold' : isPassed ? 'text-gray-700' : 'text-gray-400'}`}>
                                                        {status.label}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>

                        {/* Thông tin khách hàng */}
                        <div className="bg-white border rounded-lg p-5 space-y-3">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Khách hàng</h4>
                            <div>
                                <p className="text-sm font-bold text-gray-900">{order.customer_name}</p>
                                <p className="text-sm font-mono text-gray-500">{order.customer_phone}</p>
                                <p className="text-xs text-gray-400 italic mt-1">{order.customer_email || "Không có email"}</p>
                            </div>
                            {order.notes && (
                                <div className="mt-2 pt-2 border-t text-xs">
                                    <span className="text-gray-400 block mb-1 font-semibold">Ghi chú:</span>
                                    <p className="text-gray-600 italic">{order.notes}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Địa chỉ và Sản phẩm */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Địa chỉ & Vận chuyển */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white border rounded-lg p-5">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Địa chỉ giao hàng</h4>
                                {order.shipping_address ? (
                                    <div className="text-sm">
                                        <p className="font-semibold text-gray-800 mb-1">{order.shipping_address.name}</p>
                                        <p className="text-gray-600 leading-relaxed italic">
                                            {order.shipping_address.address}, {order.shipping_address.ward}, {order.shipping_address.district}, {order.shipping_address.city}
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-400 italic">Trống</p>
                                )}
                            </div>
                            <div className="bg-white border rounded-lg p-5">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Thanh toán & VC</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Thanh toán:</span>
                                        <span className="font-medium text-gray-900">
                                            {typeof order.payment_method === 'object' ? order.payment_method?.name : (order.payment_method || "-")}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Vận chuyển:</span>
                                        <span className="font-medium text-gray-900">
                                            {typeof order.shipping_method === 'object' ? order.shipping_method?.name : (order.shipping_method || "-")}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sản phẩm */}
                        <div className="bg-white border rounded-lg overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-5 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sản phẩm</th>
                                        <th className="px-5 py-3 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">SL</th>
                                        <th className="px-5 py-3 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Đơn giá</th>
                                        <th className="px-5 py-3 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Thành tiền</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {order.items?.map((item: any) => (
                                        <tr key={item.id}>
                                            <td className="px-5 py-3 text-sm">
                                                <p className="font-medium text-gray-900">{item.product_name}</p>
                                                {item.variant_label && <span className="text-[10px] text-gray-500 font-medium uppercase">{item.variant_label}</span>}
                                            </td>
                                            <td className="px-5 py-3 text-center text-sm font-medium text-gray-700">{item.quantity}</td>
                                            <td className="px-5 py-3 text-right text-sm font-mono text-gray-600">{formatCurrency(item.price)}</td>
                                            <td className="px-5 py-3 text-right text-sm font-mono font-bold text-gray-900">{formatCurrency(item.price * item.quantity)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-gray-50/50 text-sm">
                                    <tr>
                                        <td colSpan={3} className="px-5 py-2 text-right text-gray-500">Tạm tính:</td>
                                        <td className="px-5 py-2 text-right font-mono text-gray-700">{formatCurrency(order.subtotal)}</td>
                                    </tr>
                                    {order.discount_amount > 0 && (
                                        <tr className="text-green-600">
                                            <td colSpan={3} className="px-5 py-1 text-right font-medium">Giảm giá:</td>
                                            <td className="px-5 py-1 text-right font-mono font-bold">-{formatCurrency(order.discount_amount)}</td>
                                        </tr>
                                    )}
                                    <tr>
                                        <td colSpan={3} className="px-5 py-1 text-right text-gray-500">Phí ship:</td>
                                        <td className="px-5 py-1 text-right font-mono text-gray-700">{formatCurrency(order.shipping_fee)}</td>
                                    </tr>
                                    <tr className="text-lg font-bold">
                                        <td colSpan={3} className="px-5 py-4 text-right text-gray-900 uppercase text-xs tracking-wider">Tổng cộng:</td>
                                        <td className="px-5 py-4 text-right text-blue-700 font-mono italic underline">{formatCurrency(order.total_amount)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-2">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-800 text-white font-bold rounded hover:bg-black transition-colors text-sm"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </Modal>
    );
}
