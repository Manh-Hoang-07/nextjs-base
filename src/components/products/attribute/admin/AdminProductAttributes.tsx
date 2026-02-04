"use client";

import { useEffect, useState } from "react";
import { useAdminListPage } from "@/hooks/useAdminListPage";
import { adminEndpoints } from "@/lib/api/endpoints";
import SkeletonLoader from "@/components/shared/ui/feedback/SkeletonLoader";
import ConfirmModal from "@/components/shared/ui/feedback/ConfirmModal";
import Actions from "@/components/shared/ui/data-display/Actions";
import Pagination from "@/components/shared/ui/data-display/Pagination";
import ProductAttributesFilter from "./ProductAttributesFilter";
import CreateProductAttribute from "./CreateProductAttribute";
import EditProductAttribute from "./EditProductAttribute";

const getBasicStatusArray = () => [
  { value: "active", label: "Hoạt động", class: "bg-green-100 text-green-800" },
  {
    value: "inactive",
    label: "Ngừng hoạt động",
    class: "bg-gray-100 text-gray-800",
  },
];

const getAttributeTypeArray = () => [
  { value: "text", label: "Văn bản", class: "bg-blue-100 text-blue-800" },
  { value: "select", label: "Chọn một", class: "bg-purple-100 text-purple-800" },
  { value: "multiselect", label: "Chọn nhiều", class: "bg-indigo-100 text-indigo-800" },
  { value: "color", label: "Màu sắc", class: "bg-pink-100 text-pink-800" },
  { value: "image", label: "Hình ảnh", class: "bg-yellow-100 text-yellow-800" },
];

const getStatusLabel = (value: string): string => {
  const status = getBasicStatusArray().find((s) => s.value === value);
  return status?.label || value;
};

const getStatusClass = (value: string): string => {
  const status = getBasicStatusArray().find((s) => s.value === value);
  return status?.class || "bg-gray-100 text-gray-800";
};

const getTypeLabel = (value: string): string => {
  const type = getAttributeTypeArray().find((t) => t.value === value);
  return type?.label || value;
};

const getTypeClass = (value: string): string => {
  const type = getAttributeTypeArray().find((t) => t.value === value);
  return type?.class || "bg-gray-100 text-gray-800";
};

interface ProductAttribute {
  id: string | number;
  name: string;
  code?: string;
  type?: string;
  status?: string;
  sort_order?: number;
  is_required?: boolean;
  is_variation?: boolean;
  is_filterable?: boolean;
  is_visible_on_frontend?: boolean;
  values?: Array<{ id: string | number; value: string; label?: string }>;
}

interface AdminProductAttributesProps {
  title?: string;
  createButtonText?: string;
}

export default function AdminProductAttributes({
  title = "Quản lý thuộc tính sản phẩm",
  createButtonText = "Thêm thuộc tính mới",
}: AdminProductAttributesProps) {
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
      list: adminEndpoints.productAttributes.list,
      create: adminEndpoints.productAttributes.create,
      update: (id) => adminEndpoints.productAttributes.update(id),
      delete: (id) => adminEndpoints.productAttributes.delete(id),
      show: (id) => adminEndpoints.productAttributes.show(id),
    },
    messages: {
      createSuccess: "Đã tạo thuộc tính sản phẩm thành công",
      updateSuccess: "Đã cập nhật thuộc tính sản phẩm thành công",
      deleteSuccess: "Đã xóa thuộc tính sản phẩm thành công",
    },
    fetchDetailBeforeEdit: true,
  });

  const [statusEnums, setStatusEnums] = useState<
    Array<{ value: string; label?: string; name?: string }>
  >([]);

  useEffect(() => {
    setStatusEnums(getBasicStatusArray());
  }, []);

  return (
    <div className="admin-product-attributes">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{title}</h1>
        <button
          onClick={openCreateModal}
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none"
        >
          {createButtonText}
        </button>
      </div>

      <ProductAttributesFilter
        initialFilters={filters}
        statusEnums={statusEnums}
        onUpdateFilters={updateFilters}
      />

      <div className="overflow-hidden rounded-lg bg-white shadow-md">
        {loading ? (
          <SkeletonLoader type="table" rows={5} columns={7} />
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  STT
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Tên thuộc tính
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Mã
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Loại
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Số giá trị
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Trạng thái
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
              {items.map((attribute: ProductAttribute, index) => (
                <tr key={attribute.id}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {getSerialNumber(index)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    <div className="flex flex-col">
                      <span>{attribute.name}</span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {attribute.is_required && (
                          <span className="inline-flex rounded-full bg-red-100 px-2 text-xs font-semibold text-red-800">
                            Bắt buộc
                          </span>
                        )}
                        {attribute.is_variation && (
                          <span className="inline-flex rounded-full bg-blue-100 px-2 text-xs font-semibold text-blue-800">
                            Biến thể
                          </span>
                        )}
                        {attribute.is_filterable && (
                          <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold text-green-800">
                            Lọc
                          </span>
                        )}
                        {attribute.is_visible_on_frontend && (
                          <span className="inline-flex rounded-full bg-purple-100 px-2 text-xs font-semibold text-purple-800">
                            Frontend
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                    <code className="rounded bg-gray-100 px-2 py-1 text-xs">
                      {attribute.code || "-"}
                    </code>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getTypeClass(
                        attribute.type || ""
                      )}`}
                    >
                      {getTypeLabel(attribute.type || "")}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                    {attribute.values?.length || 0}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusClass(
                        attribute.status || ""
                      )}`}
                    >
                      {getStatusLabel(attribute.status || "")}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                    {attribute.sort_order ?? "-"}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                    <Actions
                      item={attribute}
                      onEdit={() => openEditModal(attribute)}
                      onDelete={() => openDeleteModal(attribute)}
                    />
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
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
        <CreateProductAttribute
          show={modals.create}
          statusEnums={statusEnums}
          apiErrors={apiErrors}
          onClose={closeCreateModal}
          onCreated={handleCreate}
        />
      )}

      {modals.edit && selectedItem && (
        <EditProductAttribute
          show={modals.edit}
          attribute={selectedItem}
          statusEnums={statusEnums}
          apiErrors={apiErrors}
          onClose={closeEditModal}
          onUpdated={(data) => handleUpdate(selectedItem.id, data)}
        />
      )}

      {selectedItem && (
        <ConfirmModal
          show={modals.delete}
          title="Xác nhận xóa"
          message={`Bạn có chắc chắn muốn xóa thuộc tính sản phẩm ${
            (selectedItem as ProductAttribute).name || ""
          }?`}
          onClose={closeDeleteModal}
          onConfirm={() => handleDelete(selectedItem.id)}
        />
      )}
    </div>
  );
}



