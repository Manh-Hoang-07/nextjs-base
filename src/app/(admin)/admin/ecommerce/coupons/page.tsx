import { Suspense } from "react";
import { Metadata } from "next";
import AdminCoupons from "@/components/products/coupon/admin/AdminCoupons";
import PageMeta from "@/components/shared/ui/navigation/PageMeta";

export const metadata: Metadata = {
    title: "Mã khuyến mãi | Admin",
    description: "Quản lý mã giảm giá và chương trình khuyến mãi",
};

export default function AdminCouponsPage() {
    return (
        <div className="w-full p-4">
            <PageMeta
                title="Mã khuyến mãi"
                breadcrumbs={[
                    { label: "Trang quản trị", href: "/admin" },
                    { label: "Ecommerce" },
                    { label: "Mã khuyến mãi" },
                ]}
            />
            <Suspense fallback={<div>Đang tải...</div>}>
                <AdminCoupons />
            </Suspense>
        </div>
    );
}
