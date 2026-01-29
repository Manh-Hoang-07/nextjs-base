"use client";

import { useAdminListPage } from "@/hooks/useAdminListPage";
import { adminEndpoints } from "@/lib/api/endpoints";
import SkeletonLoader from "@/components/ui/feedback/SkeletonLoader";
import Pagination from "@/components/ui/data-display/Pagination";
import UpdateInventoryModal from "./UpdateInventoryModal";
import InventoryFilter from "./InventoryFilter";

interface InventoryItem {
    id: string;
    warehouse_id: string;
    product_id: string;
    product_variant_id: string;
    quantity: number;
    min_quantity: number;
    product: {
        id: string;
        name: string;
        sku: string;
        image: string | null;
    };
    variant: {
        id: string;
        name: string;
        sku: string;
        price: string;
        image: string | null;
    };
}

interface WarehouseInventoryProps {
    warehouseId: string | number;
}

export default function WarehouseInventory({ warehouseId }: WarehouseInventoryProps) {
    const {
        items,
        loading,
        pagination,
        filters,
        apiErrors,
        modals,
        openModal,
        closeModal,
        handleUpdate,
        updateFilters,
        changePage,
        getSerialNumber,
        hasData,
    } = useAdminListPage({
        endpoints: {
            list: adminEndpoints.warehouses.inventory(warehouseId),
            update: () => adminEndpoints.warehouses.updateInventory,
        },
        messages: {
            updateSuccess: "Cập nhật tồn kho thành công",
        },
        customModals: ["update-inventory"],
    });

    const handleUpdateInventory = async (data: any) => {
        // Note: handleUpdate in useAdminListPage expects (id, data)
        // The current updateInventory endpoint is /api/admin/warehouses/inventory/update
        // We pass empty string as ID because the endpoint doesn't need it in the URL
        await handleUpdate("", data);
    };

    return (
        <div className="warehouse-inventory">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold">Danh sách tồn kho</h1>
                <button
                    onClick={() => openModal("update-inventory")}
                    className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none transition-colors"
                >
                    Cập nhật tồn kho
                </button>
            </div>

            <InventoryFilter
                initialFilters={filters}
                onUpdateFilters={updateFilters}
            />

            <div className="overflow-hidden rounded-lg bg-white shadow-md">
                {loading ? (
                    <SkeletonLoader type="table" rows={5} columns={6} />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        STT
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Sản phẩm / Biến thể
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        SKU
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Số lượng
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Tối thiểu
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Trạng thái
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {items.map((item: InventoryItem, index: number) => (
                                    <tr key={item.id}>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                            {getSerialNumber(index)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0">
                                                    {item.variant?.image || item.product?.image ? (
                                                        <img
                                                            className="h-10 w-10 rounded-full object-cover"
                                                            src={item.variant?.image || item.product?.image || ""}
                                                            alt=""
                                                        />
                                                    ) : (
                                                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                                                            No Img
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {item.product?.name}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {item.variant?.name}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                                            <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs">
                                                {item.variant?.sku || item.product?.sku}
                                            </code>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-gray-900">
                                            {item.quantity}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                            {item.min_quantity}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            {item.quantity <= item.min_quantity ? (
                                                <span className="inline-flex rounded-full bg-red-100 px-2 text-xs font-semibold leading-5 text-red-800">
                                                    Sắp hết hàng
                                                </span>
                                            ) : (
                                                <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                                                    Đang còn hàng
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {items.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                                            Không tìm thấy dữ liệu tồn kho nào trong kho này.
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

            {modals["update-inventory"] && (
                <UpdateInventoryModal
                    show={modals["update-inventory"]}
                    warehouseId={warehouseId}
                    onClose={() => closeModal("update-inventory")}
                    onUpdated={handleUpdateInventory}
                    apiErrors={apiErrors}
                />
            )}
        </div>
    );
}
