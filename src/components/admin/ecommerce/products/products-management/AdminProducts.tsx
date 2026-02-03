"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useAdminListPage } from "@/hooks/useAdminListPage";
import { adminEndpoints } from "@/lib/api/endpoints";
import SkeletonLoader from "@/components/ui/feedback/SkeletonLoader";
import ConfirmModal from "@/components/ui/feedback/ConfirmModal";
import Actions from "@/components/ui/data-display/Actions";
import Pagination from "@/components/ui/data-display/Pagination";
import ProductsFilter from "./ProductsFilter";
import CreateProduct from "./CreateProduct";
import EditProduct from "./EditProduct";

const getProductStatusArray = () => [
  { value: "active", label: "Hoạt động", class: "bg-green-100 text-green-800" },
  {
    value: "inactive",
    label: "Ngừng hoạt động",
    class: "bg-gray-100 text-gray-800",
  },
  {
    value: "draft",
    label: "Bản nháp",
    class: "bg-yellow-100 text-yellow-800",
  },
  {
    value: "archived",
    label: "Lưu trữ",
    class: "bg-red-100 text-red-800",
  },
];

const getStatusLabel = (value: string): string => {
  const status = getProductStatusArray().find((s) => s.value === value);
  return status?.label || value;
};

const getStatusClass = (value: string): string => {
  const status = getProductStatusArray().find((s) => s.value === value);
  return status?.class || "bg-gray-100 text-gray-800";
};

interface Product {
  id: string | number;
  name: string;
  slug?: string;
  sku?: string;
  status?: string;
  is_featured?: boolean;
  is_variable?: boolean;
  image?: string;
  categories?: Array<{ id: string | number; name: string }>;
  variants?: Array<{
    id: string | number;
    price: string;
    sale_price?: string;
    stock_quantity: number;
  }>;
}

interface AdminProductsProps {
  title?: string;
  createButtonText?: string;
}

export default function AdminProducts({
  title = "Quản lý sản phẩm",
  createButtonText = "Thêm sản phẩm mới",
}: AdminProductsProps) {
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
      list: adminEndpoints.products.list,
      create: adminEndpoints.products.create,
      update: (id) => adminEndpoints.products.update(id),
      delete: (id) => adminEndpoints.products.delete(id),
      show: (id) => adminEndpoints.products.show(id),
    },
    messages: {
      createSuccess: "Đã tạo sản phẩm thành công",
      updateSuccess: "Đã cập nhật sản phẩm thành công",
      deleteSuccess: "Đã xóa sản phẩm thành công",
    },
    fetchDetailBeforeEdit: true,
  });

  const [statusEnums, setStatusEnums] = useState<
    Array<{ value: string; label?: string; name?: string }>
  >([]);

  useEffect(() => {
    setStatusEnums(getProductStatusArray());
  }, []);

  const getTotalStock = (product: Product): number => {
    if (!product.variants || product.variants.length === 0) return 0;
    return product.variants.reduce(
      (sum, variant) => sum + (variant.stock_quantity || 0),
      0
    );
  };

  const getMinPrice = (product: Product): string => {
    if (!product.variants || product.variants.length === 0) return "-";
    const prices = product.variants
      .map((v) => parseFloat(v.sale_price || v.price || "0"))
      .filter((p) => p > 0);
    if (prices.length === 0) return "-";
    const minPrice = Math.min(...prices);
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(minPrice);
  };

  return (
    <div className="admin-products">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{title}</h1>
        <button
          onClick={openCreateModal}
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none"
        >
          {createButtonText}
        </button>
      </div>

      <ProductsFilter
        initialFilters={filters}
        statusEnums={statusEnums}
        onUpdateFilters={updateFilters}
      />

      <div className="overflow-hidden rounded-lg bg-white shadow-md">
        {loading ? (
          <SkeletonLoader type="table" rows={5} columns={7} />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    STT
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Hình ảnh
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Tên sản phẩm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Giá
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
                {items.map((product: Product, index) => (
                  <tr key={product.id}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {getSerialNumber(index)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {product.image ? (
                        <div className="relative h-12 w-12 overflow-hidden rounded">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                      ) : (
                        <div className="h-12 w-12 rounded bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                          No Image
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {product.name}
                      </div>
                      {product.categories && product.categories.length > 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                          {product.categories.map((cat) => cat.name).join(", ")}
                        </div>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        {product.is_featured && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                            Nổi bật
                          </span>
                        )}
                        {product.is_variable && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            Có biến thể
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                      {product.sku || "-"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                      {getMinPrice(product)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                      {product.is_variable
                        ? `${product.variants?.length || 0} biến thể`
                        : getTotalStock(product)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusClass(
                          product.status || ""
                        )}`}
                      >
                        {getStatusLabel(product.status || "")}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                      <Actions
                        item={product}
                        onEdit={() => openEditModal(product)}
                        onDelete={() => openDeleteModal(product)}
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
        <CreateProduct
          show={modals.create}
          statusEnums={statusEnums}
          apiErrors={apiErrors}
          onClose={closeCreateModal}
          onCreated={handleCreate}
        />
      )}

      {modals.edit && selectedItem && (
        <EditProduct
          show={modals.edit}
          product={selectedItem}
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
          message={`Bạn có chắc chắn muốn xóa sản phẩm ${(selectedItem as Product).name || ""
            }?`}
          onClose={closeDeleteModal}
          onConfirm={() => handleDelete(selectedItem.id)}
        />
      )}
    </div>
  );
}

