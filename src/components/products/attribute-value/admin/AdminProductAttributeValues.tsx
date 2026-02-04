"use client";

import { useState } from "react";
import { useAdminListPage } from "@/hooks/useAdminListPage";
import { adminEndpoints } from "@/lib/api/endpoints";
import SkeletonLoader from "@/components/shared/ui/feedback/SkeletonLoader";
import ConfirmModal from "@/components/shared/ui/feedback/ConfirmModal";
import Actions from "@/components/shared/ui/data-display/Actions";
import Pagination from "@/components/shared/ui/data-display/Pagination";
import ProductAttributeValuesFilter from "./ProductAttributeValuesFilter";
import CreateProductAttributeValue from "./CreateProductAttributeValue";
import EditProductAttributeValue from "./EditProductAttributeValue";

interface ProductAttributeValue {
  id: number;
  product_attribute_id: number;
  value: string;
  label?: string | null;
  color_code?: string | null;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  attribute?: {
    id: number;
    name: string;
    code: string;
    type: string;
  };
}

interface AdminProductAttributeValuesProps {
  title?: string;
  createButtonText?: string;
}

export default function AdminProductAttributeValues({
  title = "Quản lý giá trị thuộc tính sản phẩm",
  createButtonText = "Thêm giá trị mới",
}: AdminProductAttributeValuesProps) {
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
  } = useAdminListPage({
    endpoints: {
      list: adminEndpoints.productAttributeValues.list,
      create: adminEndpoints.productAttributeValues.create,
      update: (id) => adminEndpoints.productAttributeValues.update(id),
      delete: (id) => adminEndpoints.productAttributeValues.delete(id),
      show: (id) => adminEndpoints.productAttributeValues.show(id),
    },
    messages: {
      createSuccess: "Đã tạo giá trị thuộc tính thành công",
      updateSuccess: "Đã cập nhật giá trị thuộc tính thành công",
      deleteSuccess: "Đã xóa giá trị thuộc tính thành công",
    },
    fetchDetailBeforeEdit: true,
  });

  return (
    <div className="admin-product-attribute-values">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{title}</h1>
        <button
          onClick={openCreateModal}
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none"
        >
          {createButtonText}
        </button>
      </div>

      <ProductAttributeValuesFilter
        initialFilters={filters}
        onUpdateFilters={updateFilters}
      />

      <div className="overflow-hidden rounded-lg bg-white shadow-md">
        {loading ? (
          <SkeletonLoader type="table" rows={5} columns={6} />
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  STT
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Thuộc tính
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Giá trị
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Nhãn
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Mã màu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Thứ tự
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {items.map((item: ProductAttributeValue, index) => (
                <tr key={item.id}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {getSerialNumber(index)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {item.attribute?.name || "-"}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                    {item.value}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                    {item.label || "-"}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {item.color_code ? (
                      <div className="flex items-center space-x-2">
                        <div
                          className="h-6 w-6 rounded border border-gray-300"
                          style={{ backgroundColor: item.color_code }}
                        />
                        <span className="text-xs text-gray-600">
                          {item.color_code}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                    {item.sort_order ?? "-"}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                    <Actions
                      item={item}
                      onEdit={() => openEditModal(item)}
                      onDelete={() => openDeleteModal(item)}
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
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
        <CreateProductAttributeValue
          show={modals.create}
          apiErrors={apiErrors}
          onClose={closeCreateModal}
          onCreated={handleCreate}
        />
      )}

      {modals.edit && selectedItem && (
        <EditProductAttributeValue
          show={modals.edit}
          attributeValue={selectedItem}
          apiErrors={apiErrors}
          onClose={closeEditModal}
          onUpdated={(data) => handleUpdate(selectedItem.id, data)}
        />
      )}

      {selectedItem && (
        <ConfirmModal
          show={modals.delete}
          title="Xác nhận xóa"
          message={`Bạn có chắc chắn muốn xóa giá trị thuộc tính "${
            (selectedItem as ProductAttributeValue).value || ""
          }"?`}
          onClose={closeDeleteModal}
          onConfirm={() => handleDelete(selectedItem.id)}
        />
      )}
    </div>
  );
}



