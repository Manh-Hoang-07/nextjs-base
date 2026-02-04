"use client";

import { useState } from "react";
import { useAdminListPage } from "@/hooks/useAdminListPage";
import { adminEndpoints } from "@/lib/api/endpoints";
import apiClient from "@/lib/api/client";
import SkeletonLoader from "@/components/shared/ui/feedback/SkeletonLoader";
import ConfirmModal from "@/components/shared/ui/feedback/ConfirmModal";
import Actions from "@/components/shared/ui/data-display/Actions";
import Pagination from "@/components/shared/ui/data-display/Pagination";
import ProductVariantsFilter from "./ProductVariantsFilter";
import CreateProductVariant from "./CreateProductVariant";
import EditProductVariant from "./EditProductVariant";
import FormField from "@/components/shared/ui/forms/FormField";

interface ProductVariant {
  id: number;
  product_id: number;
  name: string;
  slug?: string;
  sku: string;
  price: string;
  sale_price?: string;
  cost_price?: string;
  stock_quantity: number;
  weight?: string;
  image?: string;
  is_active?: boolean;
  deleted_at?: string | null;
}

export default function AdminProductVariants({
  title = "Quản lý biến thể sản phẩm",
  createButtonText = "Thêm biến thể mới",
}: {
  title?: string;
  createButtonText?: string;
}) {
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
    openEditModal,
    closeEditModal,
    openDeleteModal,
    closeDeleteModal,
    updateFilters,
    changePage,
    handleCreate,
    handleUpdate,
    handleDelete,
    refresh,
    getSerialNumber,
    hasData,
    showSuccess,
    showError,
  } = useAdminListPage({
    endpoints: {
      list: adminEndpoints.productVariants.list,
      create: adminEndpoints.productVariants.create,
      update: (id) => adminEndpoints.productVariants.update(id),
      delete: (id) => adminEndpoints.productVariants.delete(id),
      show: (id) => adminEndpoints.productVariants.show(id),
    },
    messages: {
      createSuccess: "Đã tạo biến thể thành công",
      updateSuccess: "Đã cập nhật biến thể thành công",
      deleteSuccess: "Đã xóa biến thể thành công",
    },
    fetchDetailBeforeEdit: true,
    customModals: ["restore", "skuLookup"],
  });

  const [skuLookup, setSkuLookup] = useState("");
  const [skuLookupLoading, setSkuLookupLoading] = useState(false);
  const [skuLookupResult, setSkuLookupResult] = useState<any>(null);

  const formatMoney = (val?: string) => {
    const n = Number(val || 0);
    if (!n) return "—";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(n);
  };

  const isDeleted = (v: ProductVariant) => !!(v as any)?.deleted_at;

  const openRestoreModal = (variant: ProductVariant) => {
    // useAdminListPage provides openModal, but not needed here: we reuse ConfirmModal slot with selectedItem+modals.delete.
    // We'll repurpose delete modal only for delete; restore uses a local state by calling openModal from hook:
    // However hook doesn't expose openModal in destructuring above; keep simple with local state via selectedItem+modals.
    // We'll just use the generic openDeleteModal? No.
  };

  const [restoreModal, setRestoreModal] = useState<null | ProductVariant>(null);

  const handleRestore = async (id: number) => {
    try {
      await apiClient.put(adminEndpoints.productVariants.restore(id));
      showSuccess("Đã khôi phục biến thể");
      setRestoreModal(null);
      refresh();
    } catch (e: any) {
      showError(e?.response?.data?.message || "Khôi phục thất bại");
    }
  };

  const doSkuLookup = async () => {
    const sku = skuLookup.trim();
    if (!sku) {
      showError("Vui lòng nhập SKU");
      return;
    }
    setSkuLookupLoading(true);
    setSkuLookupResult(null);
    try {
      const response = await apiClient.get(adminEndpoints.productVariants.bySku(sku));
      const data = response.data?.data ?? response.data;
      setSkuLookupResult(data);
      showSuccess("Đã tìm thấy biến thể theo SKU");
    } catch (e: any) {
      setSkuLookupResult(null);
      showError(e?.response?.data?.message || "Không tìm thấy biến thể theo SKU");
    } finally {
      setSkuLookupLoading(false);
    }
  };

  return (
    <div className="admin-product-variants">
      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-bold">{title}</h1>
        <button
          onClick={openCreateModal}
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none"
        >
          {createButtonText}
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <FormField
            label="Tra cứu theo SKU"
            value={skuLookup}
            onChange={(e) => setSkuLookup(e.target.value)}
            placeholder="ATN001-RED-M"
          />
          <div className="md:col-span-2 flex items-center gap-2 justify-end">
            <button
              onClick={doSkuLookup}
              disabled={skuLookupLoading}
              className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-sm disabled:opacity-50"
            >
              {skuLookupLoading ? "Đang tra cứu..." : "Tra cứu"}
            </button>
            {skuLookupResult?.id && (
              <button
                onClick={() => openEditModal(skuLookupResult)}
                className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 text-sm"
              >
                Mở chỉnh sửa
              </button>
            )}
          </div>
        </div>
        {skuLookupResult && (
          <div className="mt-3 text-sm text-gray-700">
            Kết quả: <span className="font-mono">{skuLookupResult?.sku}</span> —{" "}
            {skuLookupResult?.name || "—"} (ID: {skuLookupResult?.id || "—"})
          </div>
        )}
      </div>

      <ProductVariantsFilter initialFilters={filters} onUpdateFilters={updateFilters} />

      <div className="overflow-hidden rounded-lg bg-white shadow-md">
        {loading ? (
          <SkeletonLoader type="table" rows={5} columns={9} />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    STT
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Tên
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Giá
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Giá sale
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Tồn kho
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {items.map((variant: ProductVariant, index) => (
                  <tr key={variant.id}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {getSerialNumber(index)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                      <code className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">
                        {variant.sku}
                      </code>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {variant.name}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                      {formatMoney(variant.price)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                      {variant.sale_price ? formatMoney(variant.sale_price) : "—"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                      {variant.stock_quantity}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {isDeleted(variant) ? (
                        <span className="inline-flex rounded-full px-2 text-xs font-semibold leading-5 bg-red-100 text-red-800">
                          Đã xoá
                        </span>
                      ) : (
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${variant.is_active === false
                              ? "bg-gray-100 text-gray-800"
                              : "bg-green-100 text-green-800"
                            }`}
                        >
                          {variant.is_active === false ? "Ngừng" : "Hoạt động"}
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                      <Actions
                        item={variant}
                        onEdit={() => openEditModal(variant)}
                        onDelete={() => openDeleteModal(variant)}
                        additionalActions={
                          isDeleted(variant)
                            ? [
                              {
                                label: "Khôi phục",
                                icon: "check",
                                action: () => setRestoreModal(variant),
                              },
                            ]
                            : []
                        }
                      />
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-6 py-4 text-center text-gray-500">
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

      {modals.create && (
        <CreateProductVariant
          show={modals.create}
          apiErrors={apiErrors}
          onClose={closeCreateModal}
          onCreated={handleCreate}
        />
      )}

      {modals.edit && selectedItem && (
        <EditProductVariant
          show={modals.edit}
          variant={selectedItem}
          apiErrors={apiErrors}
          onClose={closeEditModal}
          onUpdated={(data) => handleUpdate(selectedItem.id, data)}
        />
      )}

      {selectedItem && (
        <ConfirmModal
          show={modals.delete}
          title="Xác nhận xóa"
          message={`Bạn có chắc chắn muốn xóa biến thể ${(selectedItem as ProductVariant).sku || ""}?`}
          onClose={closeDeleteModal}
          onConfirm={() => handleDelete(selectedItem.id)}
        />
      )}

      {restoreModal && (
        <ConfirmModal
          show={!!restoreModal}
          title="Xác nhận khôi phục"
          message={`Bạn có chắc chắn muốn khôi phục biến thể ${restoreModal.sku}?`}
          onClose={() => setRestoreModal(null)}
          onConfirm={() => handleRestore(restoreModal.id)}
        />
      )}
    </div>
  );
}


