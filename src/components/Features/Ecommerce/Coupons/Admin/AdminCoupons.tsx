"use client";

import { useAdminListPage } from "@/hooks/useAdminListPage";
import { adminEndpoints } from "@/lib/api/endpoints";
import SkeletonLoader from "@/components/UI/Feedback/SkeletonLoader";
import ConfirmModal from "@/components/UI/Feedback/ConfirmModal";
import Actions from "@/components/UI/DataDisplay/Actions";
import Pagination from "@/components/UI/DataDisplay/Pagination";
import CouponsFilter from "./CouponsFilter";
import CreateCoupon from "./CreateCoupon";
import EditCoupon from "./EditCoupon";
import { CouponType } from "./types";

interface Coupon {
    id: string | number;
    code: string;
    name: string;
    description?: string;
    type: CouponType;
    value: string | number;
    usage_limit?: number | null;
    used_count: number;
    status: "active" | "inactive" | string;
    min_order_value?: string | number | null;
    max_discount?: string | number | null;
    start_date?: string | null;
    end_date?: string | null;
}

export default function AdminCoupons() {
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
            list: adminEndpoints.coupons.list,
            create: adminEndpoints.coupons.create,
            update: (id) => adminEndpoints.coupons.update(id),
            delete: (id) => adminEndpoints.coupons.delete(id),
            show: (id) => adminEndpoints.coupons.show(id),
        },
        messages: {
            createSuccess: "Đã tạo mã khuyến mãi thành công",
            updateSuccess: "Đã cập nhật mã khuyến mãi thành công",
            deleteSuccess: "Đã xóa mã khuyến mãi thành công",
        },
        fetchDetailBeforeEdit: true,
    });

    const formatCurrency = (value?: string | number | null) => {
        if (value === undefined || value === null) return "-";
        const numValue = typeof value === "string" ? parseFloat(value) : value;
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(numValue);
    };

    const getDiscountTypeLabel = (type: string) => {
        switch (type) {
            case CouponType.PERCENTAGE: return "Phần trăm";
            case CouponType.FIXED_AMOUNT: return "Số tiền cố định";
            case CouponType.FREE_SHIPPING: return "Miễn phí vận chuyển";
            default: return type;
        }
    };

    return (
        <div className="admin-coupons">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold font-primary">Quản lý mã khuyến mãi</h1>
                <button
                    onClick={openCreateModal}
                    className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-colors focus:outline-none"
                >
                    Thêm mã khuyến mãi mới
                </button>
            </div>

            <CouponsFilter
                initialFilters={filters}
                onUpdateFilters={updateFilters}
            />

            <div className="mt-4 overflow-hidden rounded-lg bg-white shadow-md">
                {loading ? (
                    <SkeletonLoader type="table" rows={5} columns={8} />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">STT</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Mã</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Tên chương trình</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Loại giảm</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Giá trị</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Sử dụng</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Trạng thái</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 text-center">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {items.map((coupon: Coupon, index) => (
                                    <tr key={coupon.id} className="hover:bg-gray-50">
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{getSerialNumber(index)}</td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <code className="rounded bg-indigo-50 px-2 py-1 font-mono text-sm font-bold text-indigo-600 border border-indigo-100">
                                                {coupon.code}
                                            </code>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{coupon.name}</div>
                                            {coupon.description && <div className="text-xs text-gray-500 line-clamp-1">{coupon.description}</div>}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                                            {getDiscountTypeLabel(coupon.type)}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                                            {coupon.type === CouponType.PERCENTAGE
                                                ? `${coupon.value}%`
                                                : formatCurrency(coupon.value)}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                            <div className="flex flex-col">
                                                <span>{coupon.used_count} / {coupon.usage_limit || "∞"}</span>
                                                <div className="mt-1 h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                                                    <div
                                                        className="h-full bg-blue-500"
                                                        style={{ width: coupon.usage_limit ? `${(coupon.used_count / coupon.usage_limit) * 100}%` : "0%" }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold leading-5 ${coupon.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                                {coupon.status === "active" ? "Kích hoạt" : "Vô hiệu"}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                                            <Actions
                                                item={coupon}
                                                onEdit={() => openEditModal(coupon)}
                                                onDelete={() => openDeleteModal(coupon)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                                {items.length === 0 && (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-10 text-center text-gray-500 italic">Không có mã khuyến mãi nào</td>
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
                <CreateCoupon
                    show={modals.create}
                    apiErrors={apiErrors}
                    onClose={closeCreateModal}
                    onCreated={handleCreate}
                />
            )}

            {modals.edit && selectedItem && (
                <EditCoupon
                    show={modals.edit}
                    coupon={selectedItem}
                    apiErrors={apiErrors}
                    onClose={closeEditModal}
                    onUpdated={(data: any) => handleUpdate(selectedItem.id, data)}
                />
            )}

            {selectedItem && (
                <ConfirmModal
                    show={modals.delete}
                    title="Xác nhận xóa"
                    message={`Bạn có chắc chắn muốn xóa mã khuyến mãi "${selectedItem.code}"? Thao tác này không thể hoàn tác.`}
                    onClose={closeDeleteModal}
                    onConfirm={() => handleDelete(selectedItem.id)}
                />
            )}
        </div>
    );
}


