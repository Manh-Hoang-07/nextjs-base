"use client";

import { useSearchParams } from "next/navigation";
import { useAdminListPage } from "@/hooks/useAdminListPage";
import { adminEndpoints } from "@/lib/api/endpoints";
import SkeletonLoader from "@/components/UI/Feedback/SkeletonLoader";
import ConfirmModal from "@/components/UI/Feedback/ConfirmModal";
import Actions from "@/components/UI/DataDisplay/Actions";
import Pagination from "@/components/UI/DataDisplay/Pagination";
import DigitalAssetsFilter from "./DigitalAssetsFilter";
import ImportDigitalAssets from "./ImportDigitalAssets";
import EditDigitalAsset from "./EditDigitalAsset";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface DigitalAsset {
    id: string | number;
    product_id: number;
    product_variant_id?: number;
    status: "available" | "sold";
    content?: string;
    created_at: string;
    product?: {
        name: string;
    };
    variant?: {
        name: string;
    };
}

interface AdminDigitalAssetsProps {
    title?: string;
    createButtonText?: string;
}

export default function AdminDigitalAssets({
    title = "Số dư sản phẩm số (Keys/Accounts)",
    createButtonText = "Nhập hàng loạt",
}: AdminDigitalAssetsProps) {
    const searchParams = useSearchParams();
    const productIdParam = searchParams.get("product_id");

    const {
        items,
        loading,
        pagination,
        filters,
        apiErrors,
        modals,
        selectedItem,
        openDeleteModal,
        closeDeleteModal,
        openEditModal,
        closeEditModal,
        updateFilters,
        changePage,
        handleDelete,
        getSerialNumber,
        hasData,
        openModal,
        closeModal,
        refresh,
    } = useAdminListPage({
        endpoints: {
            list: adminEndpoints.productDigitalAssets.list,
            delete: (id) => adminEndpoints.productDigitalAssets.delete(id),
            update: (id) => adminEndpoints.productDigitalAssets.update(id),
        },
        messages: {
            deleteSuccess: "Đã xóa tài sản số thành công",
            updateSuccess: "Cập nhật tài sản số thành công",
        },
        customModals: ["import"],
    });

    return (
        <div className="admin-digital-assets">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">{title}</h1>
                <button
                    onClick={() => openModal("import")}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
                >
                    {createButtonText}
                </button>
            </div>

            <DigitalAssetsFilter
                initialFilters={filters}
                onUpdateFilters={updateFilters}
            />

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                {loading ? (
                    <SkeletonLoader type="table" rows={10} columns={6} />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        STT
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Sản phẩm
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Biến thể
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Trạng thái
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ngày tạo
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {items.map((asset: DigitalAsset, index) => (
                                    <tr key={asset.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {getSerialNumber(index)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {asset.product?.name || `Product #${asset.product_id}`}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">
                                                {asset.variant?.name ||
                                                    (asset.product_variant_id
                                                        ? `Variant #${asset.product_variant_id}`
                                                        : "-")}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${asset.status === "available"
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-gray-100 text-gray-800"
                                                    }`}
                                            >
                                                {asset.status === "available" ? "Sẵn có" : "Đã bán"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {asset.created_at
                                                ? format(new Date(asset.created_at), "HH:mm dd/MM/yyyy", {
                                                    locale: vi,
                                                })
                                                : "-"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <Actions
                                                item={asset}
                                                onEdit={() => openEditModal(asset)}
                                                onDelete={() => openDeleteModal(asset)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                                {items.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                                            Không có dữ liệu
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

            {modals.import && (
                <ImportDigitalAssets
                    show={modals.import}
                    onClose={() => closeModal("import")}
                    onSuccess={() => {
                        refresh();
                    }}
                    initialProductId={productIdParam ? Number(productIdParam) : undefined}
                />
            )}

            {modals.edit && selectedItem && (
                <EditDigitalAsset
                    show={modals.edit}
                    asset={selectedItem}
                    onClose={closeEditModal}
                    onSuccess={() => {
                        refresh();
                    }}
                />
            )}

            {selectedItem && (
                <ConfirmModal
                    show={modals.delete}
                    title="Xác nhận xóa"
                    message={`Bạn có chắc chắn muốn xóa tài sản số này? Hành động này không thể hoàn tác.`}
                    onClose={closeDeleteModal}
                    onConfirm={() => handleDelete(selectedItem.id)}
                />
            )}
        </div>
    );
}
