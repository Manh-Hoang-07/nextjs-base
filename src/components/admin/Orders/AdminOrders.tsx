"use client";

import { useAdminListPage } from "@/hooks/useAdminListPage";
import { adminEndpoints } from "@/lib/api/endpoints";
import SkeletonLoader from "@/components/ui/feedback/SkeletonLoader";
import Pagination from "@/components/ui/data-display/Pagination";
import Actions from "@/components/ui/data-display/Actions";
import OrdersFilter from "./OrdersFilter";
import OrderDetail from "./OrderDetail";

const getOrderStatusArray = () => [
    { value: "pending", label: "Chờ xử lý", class: "bg-yellow-100 text-yellow-800" },
    { value: "confirmed", label: "Đã xác nhận", class: "bg-blue-100 text-blue-800" },
    { value: "processing", label: "Đang xử lý", class: "bg-indigo-100 text-indigo-800" },
    { value: "shipped", label: "Đang giao hàng", class: "bg-purple-100 text-purple-800" },
    { value: "delivered", label: "Đã giao thành công", class: "bg-green-100 text-green-800" },
    { value: "cancelled", label: "Đã hủy", class: "bg-red-100 text-red-800" },
];

const getStatusLabel = (value: string) => {
    return getOrderStatusArray().find(s => s.value === value)?.label || value;
};

const getStatusClass = (value: string) => {
    return getOrderStatusArray().find(s => s.value === value)?.class || "bg-gray-100 text-gray-800";
};

export default function AdminOrders() {
    const {
        items,
        loading,
        pagination,
        filters,
        modals,
        selectedItem,
        openEditModal,
        closeEditModal,
        updateFilters,
        changePage,
        getSerialNumber,
        hasData,
    } = useAdminListPage({
        endpoints: {
            list: adminEndpoints.orders.list,
            show: (id) => adminEndpoints.orders.show(id),
        },
        fetchDetailBeforeEdit: true,
    });

    const formatCurrency = (value?: number) => {
        if (value === undefined || value === null) return "-";
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(value);
    };

    return (
        <div className="admin-orders">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold font-primary">Quản lý đơn hàng</h1>
            </div>

            <OrdersFilter
                initialFilters={filters}
                onUpdateFilters={updateFilters}
                statusEnums={getOrderStatusArray()}
            />

            <div className="mt-4 overflow-hidden rounded-lg bg-white shadow-md border">
                {loading ? (
                    <SkeletonLoader type="table" rows={5} columns={7} />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">STT</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Mã đơn hàng</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Khách hàng</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Tổng tiền</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Ngày đặt</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Trạng thái</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 text-center">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {items.map((order: any, index: number) => (
                                    <tr key={order.id} className="hover:bg-gray-50">
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{getSerialNumber(index)}</td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <span className="font-bold text-indigo-600">
                                                {order.order_number || `#${order.id}`}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{order.customer_name}</div>
                                            <div className="text-xs text-gray-500">{order.customer_phone}</div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm font-bold text-gray-900">
                                            {formatCurrency(order.total_amount)}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                            {order.created_at ? new Date(order.created_at).toLocaleDateString("vi-VN") : "-"}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusClass(order.status)}`}>
                                                {getStatusLabel(order.status)}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                                            <Actions
                                                item={order}
                                                showEdit={false}
                                                showDelete={false}
                                                showView={true}
                                                onView={() => openEditModal(order)}
                                                viewTitle="Xem chi tiết"
                                            />
                                        </td>
                                    </tr>
                                ))}
                                {items.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-10 text-center text-gray-500 italic">
                                            Không tìm thấy đơn hàng nào
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

            {modals.edit && selectedItem && (
                <OrderDetail
                    show={modals.edit}
                    order={selectedItem}
                    onClose={closeEditModal}
                    statusEnums={getOrderStatusArray()}
                />
            )}
        </div>
    );
}
