"use client";

import { useCallback } from "react";
import { useAdminListPage } from "@/hooks/useAdminListPage";
import { adminEndpoints } from "@/lib/api/endpoints";
import apiClient from "@/lib/api/client";
import SkeletonLoader from "@/components/shared/ui/feedback/SkeletonLoader";
import ConfirmModal from "@/components/shared/ui/feedback/ConfirmModal";
import Actions from "@/components/shared/ui/data-display/Actions";
import Pagination from "@/components/shared/ui/data-display/Pagination";
import PaymentMethodsFilter from "./PaymentMethodsFilter";
import CreatePaymentMethod from "./CreatePaymentMethod";
import EditPaymentMethod from "./EditPaymentMethod";

export interface AdminPaymentMethod {
  id: number;
  name: string;
  code: string;
  type: "online" | "offline";
  status: "active" | "inactive";
  description?: string | null;
  config?: any;
  created_at?: string;
}

interface AdminPaymentMethodsProps {
  title?: string;
  createButtonText?: string;
}

const formatDate = (dateStr?: string): string => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? "-" : date.toLocaleString("vi-VN");
};

export default function AdminPaymentMethods({
  title = "Quản lý phương thức thanh toán",
  createButtonText = "Thêm phương thức mới",
}: AdminPaymentMethodsProps) {
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
      list: adminEndpoints.paymentMethods.list,
      create: adminEndpoints.paymentMethods.create,
      update: (id) => adminEndpoints.paymentMethods.update(id),
      delete: (id) => adminEndpoints.paymentMethods.delete(id),
      show: (id) => adminEndpoints.paymentMethods.show(id),
    },
    messages: {
      createSuccess: "Phương thức thanh toán đã được tạo thành công",
      updateSuccess: "Phương thức thanh toán đã được cập nhật thành công",
      deleteSuccess: "Phương thức thanh toán đã được xóa thành công",
    },
    fetchDetailBeforeEdit: true,
  });

  const toggleStatus = useCallback(
    async (item: AdminPaymentMethod) => {
      try {
        const nextStatus = item.status === "active" ? "inactive" : "active";
        await apiClient.put(
          adminEndpoints.paymentMethods.updateStatus(item.id),
          { status: nextStatus }
        );
        showSuccess("Cập nhật trạng thái thành công");
        refresh();
      } catch (error: any) {
        const message =
          error?.response?.data?.message ||
          "Không thể cập nhật trạng thái phương thức thanh toán";
        showError(message);
      }
    },
    [refresh, showSuccess, showError]
  );

  return (
    <div className="admin-payment-methods">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
        >
          {createButtonText}
        </button>
      </div>

      <PaymentMethodsFilter
        initialFilters={filters}
        onUpdateFilters={updateFilters}
      />

      <div className="bg-white shadow-md rounded-lg overflow-hidden mt-4">
        {loading ? (
          <SkeletonLoader type="table" rows={5} columns={7} />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    STT
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Tên
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Mã
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Loại
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Ngày tạo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((item: AdminPaymentMethod, index) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {getSerialNumber(index)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-xs">
                      <div>{item.name}</div>
                      {item.description && (
                        <div className="text-xs text-gray-500 line-clamp-2">
                          {item.description}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <code className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">
                        {item.code}
                      </code>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          item.type === "online"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {item.type === "online" ? "Online" : "Offline (COD)"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        type="button"
                        onClick={() => toggleStatus(item)}
                        className={`px-3 py-1 text-xs font-semibold rounded-full border ${
                          item.status === "active"
                            ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-200"
                            : "bg-red-100 text-red-800 border-red-200 hover:bg-red-200"
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
                    <td
                      colSpan={7}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      Không có phương thức thanh toán nào
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
        <CreatePaymentMethod
          show={modals.create}
          apiErrors={apiErrors}
          onClose={closeCreateModal}
          onCreated={handleCreate}
        />
      )}

      {modals.edit && selectedItem && (
        <EditPaymentMethod
          show={modals.edit}
          paymentMethod={selectedItem}
          apiErrors={apiErrors}
          onClose={closeEditModal}
          onUpdated={(data) => handleUpdate(selectedItem.id, data)}
        />
      )}

      {selectedItem && (
        <ConfirmModal
          show={modals.delete}
          title="Xác nhận xóa"
          message={`Bạn có chắc chắn muốn xóa phương thức thanh toán ${
            (selectedItem as AdminPaymentMethod).name || ""
          }?`}
          onClose={closeDeleteModal}
          onConfirm={() => handleDelete(selectedItem.id)}
        />
      )}
    </div>
  );
}




