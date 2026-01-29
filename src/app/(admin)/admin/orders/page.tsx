import { Suspense } from "react";
import { Metadata } from "next";
import AdminOrders from "@/components/admin/Orders/AdminOrders";
import PageMeta from "@/components/ui/navigation/PageMeta";

export const metadata: Metadata = {
    title: "Đơn hàng | Admin",
    description: "Quản lý đơn hàng khách hàng",
};

export default function AdminOrdersPage() {
    return (
        <div className="w-full p-4">
            <PageMeta
                title="Đơn hàng"
                breadcrumbs={[
                    { label: "Trang quản trị", href: "/admin" },
                    { label: "Ecommerce" },
                    { label: "Đơn hàng" },
                ]}
            />
            <Suspense fallback={<div>Đang tải...</div>}>
                <AdminOrders />
            </Suspense>
        </div>
    );
}
