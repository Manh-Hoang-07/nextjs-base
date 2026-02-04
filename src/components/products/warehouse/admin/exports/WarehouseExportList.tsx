"use client";

import { useAdminListPage } from "@/hooks/useAdminListPage";
import { adminEndpoints } from "@/lib/api/endpoints";
import SkeletonLoader from "@/components/shared/ui/feedback/SkeletonLoader";
import Actions from "@/components/shared/ui/data-display/Actions";
import Pagination from "@/components/shared/ui/data-display/Pagination";
import ExportFilter from "./ExportFilter";
import CreateExportModal from "./CreateExportModal";
import { formatDateTime } from "@/utils/formatters";
import apiClient from "@/lib/api/client";
import { useToastContext } from "@/contexts/ToastContext";
import { useCallback } from "react";
import ConfirmModal from "@/components/shared/ui/feedback/ConfirmModal";
import { WarehouseTransaction } from "@/types/warehouse-documents";
import { useRouter } from "next/navigation";

export default function WarehouseExportList() {
    const { showSuccess, showError } = useToastContext();
    const router = useRouter();
    const {
        items,
        loading,
        pagination,
        filters,
        apiErrors,
        modals,
        selectedItem,
        openCreateModal,
        closeCreateModal,
        openModal,
        closeModal,
        updateFilters,
        changePage,
        handleCreate,
        getSerialNumber,
        hasData,
        refresh,
    } = useAdminListPage({
        endpoints: {
            list: adminEndpoints.warehouseExports.list,
            create: adminEndpoints.warehouseExports.create,
        },
        messages: {
            createSuccess: "Tạo phiếu xuất kho thành công",
        },
        customModals: ["cancel", "approve"],
    });

    const handleApprove = useCallback(async (id: number) => {
        try {
            await apiClient.post(adminEndpoints.warehouseExports.approve(id));
            showSuccess("Đã duyệt phiếu xuất kho");
            refresh();
            closeModal("approve");
        } catch (error: any) {
            showError(error?.response?.data?.message || "Lỗi khi duyệt phiếu");
        }
    }, [refresh, closeModal, showSuccess, showError]);

    const handleCancel = useCallback(async (id: number) => {
        try {
            await apiClient.post(adminEndpoints.warehouseExports.cancel(id));
            showSuccess("Đã hủy phiếu xuất kho");
            refresh();
            closeModal("cancel");
        } catch (error: any) {
            showError(error?.response?.data?.message || "Lỗi khi hủy phiếu");
        }
    }, [refresh, closeModal, showSuccess, showError]);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "pending":
                return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">Chờ duyệt</span>;
            case "approved":
                return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Đã duyệt</span>;
            case "cancelled":
                return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">Đã hủy</span>;
            default:
                return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">{status}</span>;
        }
    };

    return (
        <div className="warehouse-exports">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Quản lý Xuất Kho</h1>
                <button
                    onClick={openCreateModal}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
                >
                    Tạo phiếu xuất
                </button>
            </div>

            <ExportFilter initialFilters={filters} onUpdateFilters={updateFilters} />

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                {loading ? (
                    <SkeletonLoader type="table" rows={5} columns={8} />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kho Xuất</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sản phẩm</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số lượng</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ghi chú</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {items.map((item, index) => (
                                    <tr key={item.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getSerialNumber(index)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {item.from_warehouse?.name || `ID: ${item.from_warehouse_id}`}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {item.variant?.name || item.product_variant?.name || `Variant ID: ${item.product_variant_id}`}
                                            </div>
                                            {(item.variant?.sku || item.product_variant?.sku) && (
                                                <div className="text-xs text-gray-500">SKU: {item.variant?.sku || item.product_variant?.sku}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                                            {item.quantity}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                            {item.notes || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(item.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDateTime(item.created_at)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <Actions
                                                item={item}
                                                showView={true}
                                                onView={() => router.push(`/admin/warehouse-exports/${item.id}`)}
                                                showEdit={false}
                                                showDelete={false}
                                                additionalActions={[
                                                    ...(item.status === 'pending' ? [{
                                                        label: "Duyệt",
                                                        action: () => openModal("approve", item),
                                                        icon: "check",
                                                        className: "text-green-600 hover:text-green-800"
                                                    }, {
                                                        label: "Hủy",
                                                        action: () => openModal("cancel", item),
                                                        icon: "x",
                                                        className: "text-red-600 hover:text-red-800"
                                                    }] : [])
                                                ]}
                                            />
                                        </td>
                                    </tr>
                                ))}
                                {items.length === 0 && (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                                            Không có phiếu xuất nào
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {hasData && (
                <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    totalItems={pagination.totalItems}
                    onPageChange={changePage}
                />
            )}

            {modals.create && (
                <CreateExportModal
                    show={modals.create}
                    onClose={closeCreateModal}
                    onCreated={handleCreate}
                    apiErrors={apiErrors}
                />
            )}

            {selectedItem && (
                <>
                    <ConfirmModal
                        show={modals.approve}
                        title="Duyệt phiếu xuất kho"
                        message={`Bạn có chắc chắn muốn duyệt phiếu xuất "${selectedItem.code}"? Kho hành động này không thể hoàn tác.`}
                        onClose={() => closeModal("approve")}
                        onConfirm={() => handleApprove(selectedItem.id)}
                        confirmText="Duyệt phiếu"
                        confirmButtonClass="bg-green-600 hover:bg-green-700"
                    />

                    <ConfirmModal
                        show={modals.cancel}
                        title="Hủy phiếu xuất kho"
                        message={`Bạn có chắc chắn muốn hủy phiếu này?`}
                        onClose={() => closeModal("cancel")}
                        onConfirm={() => handleCancel(selectedItem.id)}
                        confirmText="Hủy phiếu"
                        confirmButtonClass="bg-red-600 hover:bg-red-700"
                    />
                </>
            )}
        </div>
    );
}


