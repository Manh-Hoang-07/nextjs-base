"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { adminEndpoints } from "@/lib/api/endpoints";
import apiClient from "@/lib/api/client";
import { useToastContext } from "@/contexts/ToastContext";
import SkeletonLoader from "@/components/shared/ui/feedback/SkeletonLoader";
import { formatDateTime } from "@/utils/formatters";
import ConfirmModal from "@/components/shared/ui/feedback/ConfirmModal";
import { WarehouseTransaction } from "@/types/warehouse-documents";

interface ImportDetailProps {
    id: number | string;
}

export default function ImportDetail({ id }: ImportDetailProps) {
    const router = useRouter();
    const { showSuccess, showError } = useToastContext();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<WarehouseTransaction | null>(null);
    const [activeModal, setActiveModal] = useState<"approve" | "cancel" | null>(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const res = await apiClient.get(adminEndpoints.warehouseImports.show(id));
            setData(res.data.data);
        } catch (error: any) {
            showError("Không thể tải thông tin phiếu nhập");
            router.push("/admin/warehouse-imports");
        } finally {
            setLoading(false);
        }
    }, [id, showError, router]);

    useEffect(() => {
        if (id) fetchData();
    }, [id, fetchData]);

    const handleApprove = async () => {
        try {
            await apiClient.post(adminEndpoints.warehouseImports.approve(id));
            showSuccess("Đã duyệt phiếu nhập kho");
            setActiveModal(null);
            fetchData();
        } catch (error: any) {
            showError(error?.response?.data?.message || "Lỗi khi duyệt phiếu");
        }
    };

    const handleCancel = async () => {
        try {
            await apiClient.post(adminEndpoints.warehouseImports.cancel(id));
            showSuccess("Đã hủy phiếu nhập kho");
            setActiveModal(null);
            fetchData();
        } catch (error: any) {
            showError(error?.response?.data?.message || "Lỗi khi hủy phiếu");
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "pending":
                return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">Chờ duyệt</span>;
            case "approved":
                return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Đã duyệt</span>;
            case "cancelled":
                return <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">Đã hủy</span>;
            default:
                return <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">{status}</span>;
        }
    };

    if (loading) return <SkeletonLoader type="card" />;
    if (!data) return null;

    return (
        <div className="import-detail">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        title="Quay lại"
                    >
                        <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-3">
                            Chi tiết nhập kho #{data.id}
                            {getStatusBadge(data.status)}
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">
                            Ngày tạo: {formatDateTime(data.created_at)}
                        </p>
                    </div>
                </div>

                <div className="flex gap-2">
                    {data.status === 'pending' && (
                        <>
                            <button
                                onClick={() => setActiveModal("approve")}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                Duyệt phiếu
                            </button>
                            <button
                                onClick={() => setActiveModal("cancel")}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Hủy phiếu
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800">Thông tin chi tiết</h3>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm text-gray-500 mb-1">Kho Nhập</label>
                        <div className="font-medium text-gray-900 border p-3 rounded bg-gray-50">
                            {data.to_warehouse?.name || `Warehouse ID: ${data.to_warehouse_id}`}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-500 mb-1">Sản phẩm</label>
                        <div className="font-medium text-gray-900 border p-3 rounded bg-gray-50">
                            {data.variant?.name || data.product_variant?.name || `Product Variant ID: ${data.product_variant_id}`}
                            {(data.variant?.sku || data.product_variant?.sku) && (
                                <span className="text-gray-500 ml-2">({data.variant?.sku || data.product_variant?.sku})</span>
                            )}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-500 mb-1">Số lượng nhập</label>
                        <div className="font-medium text-gray-900 text-lg">
                            {data.quantity}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-500 mb-1">Loại giao dịch</label>
                        <div className="font-medium text-gray-900 capitalize">
                            {data.type}
                        </div>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm text-gray-500 mb-1">Ghi chú</label>
                        <div className="font-medium text-gray-900 bg-gray-50 p-3 rounded min-h-[60px]">
                            {data.notes || "Không có ghi chú"}
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmModal
                show={activeModal === "approve"}
                title="Duyệt phiếu nhập kho"
                message={`Bạn có chắc chắn muốn duyệt phiếu nhập này? Tồn kho sẽ được cập nhật.`}
                onClose={() => setActiveModal(null)}
                onConfirm={handleApprove}
                confirmText="Duyệt phiếu"
                confirmButtonClass="bg-green-600 hover:bg-green-700"
            />

            <ConfirmModal
                show={activeModal === "cancel"}
                title="Hủy phiếu nhập kho"
                message={`Bạn có chắc chắn muốn hủy phiếu này? Hành động này không thể hoàn tác.`}
                onClose={() => setActiveModal(null)}
                onConfirm={handleCancel}
                confirmText="Hủy phiếu"
                confirmButtonClass="bg-red-600 hover:bg-red-700"
            />
        </div>
    );
}
