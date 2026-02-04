"use client";

import { useCallback } from "react";
import { useAdminListPage } from "@/hooks/useAdminListPage";
import { adminEndpoints } from "@/lib/api/endpoints";
import apiClient from "@/lib/api/client";
import SkeletonLoader from "@/components/shared/ui/feedback/SkeletonLoader";
import ConfirmModal from "@/components/shared/ui/feedback/ConfirmModal";
import Actions from "@/components/shared/ui/data-display/Actions";
import Pagination from "@/components/shared/ui/data-display/Pagination";
import ShippingMethodsFilter from "./ShippingMethodsFilter";
import CreateShippingMethod from "./CreateShippingMethod";
import EditShippingMethod from "./EditShippingMethod";

export interface AdminShippingMethod {
  id: number;
  name: string;
  code: string;
  status: "active" | "inactive" | string;
  description?: string | null;
  price?: string | null; // Decimal từ DB (string)
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

interface AdminShippingMethodsProps {
  title?: string;
  createButtonText?: string;
}

const formatDate = (dateStr?: string): string => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? "-" : date.toLocaleString("vi-VN");
};

const formatCurrency = (value?: string | number | null): string => {
  if (value == null) return "-";
  const numValue = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(numValue)) return "-";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(numValue);
};

export default function AdminShippingMethods({
  title = "Quản lý phương thức vận chuyển",
  createButtonText = "Thêm phương thức mới",
}: AdminShippingMethodsProps) {
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
    getSerialNumber,
    hasData,
    refresh,
    showSuccess,
    showError,
  } = useAdminListPage({
    endpoints: {
      list: adminEndpoints.shippingMethods.list,
      create: adminEndpoints.shippingMethods.create,
      update: (id) => adminEndpoints.shippingMethods.update(id),
      delete: (id) => adminEndpoints.shippingMethods.delete(id),
      show: (id) => adminEndpoints.shippingMethods.show(id),
    },
    messages: {
      createSuccess: "Phương thức vận chuyển đã được tạo thành công",
      updateSuccess: "Phương thức vận chuyển đã được cập nhật thành công",
      deleteSuccess: "Phương thức vận chuyển đã được xóa thành công",
    },
    fetchDetailBeforeEdit: true,
  });

  const toggleStatus = useCallback(
    async (item: AdminShippingMethod) => {
      try {
        const nextStatus = item.status === "active" ? "inactive" : "active";
        await apiClient.put(
          adminEndpoints.shippingMethods.updateStatus(item.id),
          { status: nextStatus }
        );
        showSuccess("Cập nhật trạng thái thành công");
        refresh();
      } catch (error: any) {
        const message =
          error?.response?.data?.message ||
          "Không thể cập nhật trạng thái phương thức vận chuyển";
        showError(message);
      }
    },
    [refresh, showSuccess, showError]
  );

  return (
    <div className="admin-shipping-methods">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{title}</h1>
        <button
          onClick={openCreateModal}
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none"
        >
          {createButtonText}
        </button>
      </div>

      <ShippingMethodsFilter
        initialFilters={filters}
        onUpdateFilters={updateFilters}
      />

      <div className="mt-4 overflow-hidden rounded-lg bg-white shadow-md">
        {loading ? (
          <SkeletonLoader type="table" rows={5} columns={7} />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                    STT
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                    Tên
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                    Mã
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                    Chi phí
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                    Ngày tạo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {items.map((item: AdminShippingMethod, index) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {getSerialNumber(index)}
                    </td>
                    <td className="max-w-xs px-6 py-4 text-sm font-medium text-gray-900">
                      <div>{item.name}</div>
                      {item.description && (
                        <div className="line-clamp-2 text-xs text-gray-500">
                          {item.description}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <code className="rounded bg-gray-100 px-2 py-1 text-xs font-mono">
                        {item.code}
                      </code>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {formatCurrency(item.price)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        type="button"
                        onClick={() => toggleStatus(item)}
                        className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                          item.status === "active"
                            ? "border-green-200 bg-green-100 text-green-800 hover:bg-green-200"
                            : "border-red-200 bg-red-100 text-red-800 hover:bg-red-200"
                        }`}
                      >
                        {item.status === "active" ? "Đang bật" : "Đang tắt"}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(item.created_at)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <Actions
                        item={item}
                        onEdit={() => openEditModal(item)}
                        showView={false}
                        showDelete={false}
                        additionalActions={[
                          {
                            label: "Xóa",
                            action: () => openDeleteModal(item),
                            icon: "trash",
                          },
                        ]}
                      />
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      Không có phương thức vận chuyển nào
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
        <CreateShippingMethod
          show={modals.create}
          apiErrors={apiErrors}
          onClose={closeCreateModal}
          onCreated={handleCreate}
        />
      )}

      {modals.edit && selectedItem && (
        <EditShippingMethod
          show={modals.edit}
          shippingMethod={selectedItem}
          apiErrors={apiErrors}
          onClose={closeEditModal}
          onUpdated={(data) => handleUpdate(selectedItem.id, data)}
        />
      )}

      {selectedItem && (
        <ConfirmModal
          show={modals.delete}
          title="Xác nhận xóa"
          message={`Bạn có chắc chắn muốn xóa phương thức vận chuyển ${
            (selectedItem as AdminShippingMethod).name || ""
          }?`}
          onClose={closeDeleteModal}
          onConfirm={() => handleDelete(selectedItem.id)}
        />
      )}
    </div>
  );
}


