"use client";

import { useAdminListPage } from "@/hooks/useAdminListPage";
import { adminEndpoints } from "@/lib/api/endpoints";
import SkeletonLoader from "@/components/shared/ui/feedback/SkeletonLoader";
import Actions from "@/components/shared/ui/data-display/Actions";
import Pagination from "@/components/shared/ui/data-display/Pagination";
import TransferFilter from "./TransferFilter";
import CreateTransferModal from "./CreateTransferModal";
import { useRouter } from "next/navigation";
import { formatDateTime } from "@/utils/formatters";
import apiClient from "@/lib/api/client";
import { useToastContext } from "@/contexts/ToastContext";
import { useCallback } from "react";
import ConfirmModal from "@/components/shared/ui/feedback/ConfirmModal";

export interface WarehouseTransfer {
    id: number;
    from_warehouse_id: number;
    to_warehouse_id: number;
    product_variant_id: number;
    quantity: number;
    status: 'pending' | 'approved' | 'completed' | 'cancelled';
    notes?: string;
    created_at: string;
    from_warehouse?: { name: string; id: number };
    to_warehouse?: { name: string; id: number };
    variant?: { name: string; sku: string; id: number };
    updated_user_id?: number;
}

export default function WarehouseTransferList() {
    const router = useRouter();
    const { showSuccess, showError } = useToastContext();
    const {
        items,
        loading,
        pagination,
        filters,
        apiErrors,
        modals,
        // Use 'activeModal' if I implement custom modals logic or just reuse 'create'/'edit'.
        // Since 'approve' / 'complete' / 'cancel' are actions, I might not need full modals unless I want confirmation.
        // I'll use ConfirmModal for critical actions.
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
            list: adminEndpoints.warehouses.transfers.list,
            create: adminEndpoints.warehouses.transfers.create,
        },
        messages: {
            createSuccess: "Tạo phiếu chuyển kho thành công",
        },
        // Custom logic for modals
        customModals: ["cancel", "approve", "complete"],
    });

    const handleApprove = useCallback(async (id: number) => {
        try {
            await apiClient.put(adminEndpoints.warehouses.transfers.approve(id));
            showSuccess("Đã duyệt phiếu chuyển kho");
            refresh();
            closeModal("approve");
        } catch (error: any) {
            showError(error?.response?.data?.message || "Lỗi khi duyệt phiếu");
        }
    }, [refresh, closeModal, showSuccess, showError]);

    const handleComplete = useCallback(async (id: number) => {
        try {
            await apiClient.put(adminEndpoints.warehouses.transfers.complete(id));
            showSuccess("Đã hoàn tất phiếu chuyển kho");
            refresh();
            closeModal("complete");
        } catch (error: any) {
            showError(error?.response?.data?.message || "Lỗi khi hoàn tất phiếu");
        }
    }, [refresh, closeModal, showSuccess, showError]);

    const handleCancel = useCallback(async (id: number) => {
        try {
            await apiClient.put(adminEndpoints.warehouses.transfers.cancel(id));
            showSuccess("Đã hủy phiếu chuyển kho");
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
                return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">Đang chuyển</span>;
            case "completed":
                return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Hoàn tất</span>;
            case "cancelled":
                return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">Đã hủy</span>;
            default:
                return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">{status}</span>;
        }
    };

    return (
        <div className="warehouse-transfers">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Quản lý Chuyển kho</h1>
                <button
                    onClick={openCreateModal}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
                >
                    Tạo phiếu chuyển
                </button>
            </div>

            <TransferFilter initialFilters={filters} onUpdateFilters={updateFilters} />

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                {loading ? (
                    <SkeletonLoader type="table" rows={5} columns={8} />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kho Nguồn</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kho Đích</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sản phẩm</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số lượng</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {items.map((transfer: WarehouseTransfer, index) => (
                                    <tr key={transfer.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getSerialNumber(index)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                            {transfer.from_warehouse?.name || `ID: ${transfer.from_warehouse_id}`}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                            {transfer.to_warehouse?.name || `ID: ${transfer.to_warehouse_id}`}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">{transfer.variant?.name || `ID: ${transfer.product_variant_id}`}</div>
                                            {transfer.variant?.sku && <div className="text-xs text-gray-500">SKU: {transfer.variant.sku}</div>}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                                            {transfer.quantity}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(transfer.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDateTime(transfer.created_at)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <Actions
                                                item={transfer}
                                                showView={false}
                                                showEdit={false}
                                                showDelete={false} // No delete normally, only cancel
                                                additionalActions={[
                                                    // Pending Actions
                                                    ...(transfer.status === 'pending' ? [{
                                                        label: "Duyệt",
                                                        action: () => openModal("approve", transfer),
                                                        icon: "check",
                                                        className: "text-green-600 hover:text-green-800"
                                                    }] : []),
                                                    // Pending or Approved Actions -> Cancel
                                                    ...(transfer.status === 'pending' || transfer.status === 'approved' ? [{
                                                        label: "Hủy",
                                                        action: () => openModal("cancel", transfer),
                                                        icon: "x",
                                                        className: "text-red-600 hover:text-red-800"
                                                    }] : []),
                                                    // Approved Actions -> Complete
                                                    ...(transfer.status === 'approved' ? [{
                                                        label: "Hoàn tất",
                                                        action: () => openModal("complete", transfer),
                                                        icon: "check-circle",
                                                        className: "text-blue-600 hover:text-blue-800"
                                                    }] : []),
                                                ]}
                                            />
                                        </td>
                                    </tr>
                                ))}
                                {items.length === 0 && (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                                            Không có phiếu chuyển nào
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
                <CreateTransferModal
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
                        title="Duyệt phiếu chuyển kho"
                        message={`Bạn có chắc chắn muốn duyệt phiếu chuyển từ kho "${selectedItem.from_warehouse?.name}" sang "${selectedItem.to_warehouse?.name}" với số lượng ${selectedItem.quantity}?`}
                        onClose={() => closeModal("approve")}
                        onConfirm={() => handleApprove(selectedItem.id)}
                        confirmText="Duyệt phiếu"
                        confirmButtonClass="bg-green-600 hover:bg-green-700"
                    />

                    <ConfirmModal
                        show={modals.complete}
                        title="Hoàn tất phiếu chuyển kho"
                        message={`Xác nhận kho đích đã nhận đủ hàng?`}
                        onClose={() => closeModal("complete")}
                        onConfirm={() => handleComplete(selectedItem.id)}
                        confirmText="Hoàn tất"
                        confirmButtonClass="bg-blue-600 hover:bg-blue-700"
                    />

                    <ConfirmModal
                        show={modals.cancel}
                        title="Hủy phiếu chuyển kho"
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


