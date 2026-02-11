import { Suspense } from "react";
import { Metadata } from "next";
import AdminDigitalAssets from "@/components/Features/Ecommerce/Products/DigitalAssets/Admin/AdminDigitalAssets";
import PageMeta from "@/components/UI/Navigation/PageMeta";

export const metadata: Metadata = {
    title: "Sản phẩm số (Keys/Accounts) | Admin",
    description: "Quản lý sản phẩm số (Keys/Accounts)",
};

export default function DigitalAssetsPage() {
    return (
        <div className="w-full p-4">
            <PageMeta
                title="Sản phẩm số"
                breadcrumbs={[
                    { label: "Trang quản trị", href: "/admin" },
                    { label: "Ecommerce" },
                    { label: "Sản phẩm số" },
                ]}
            />
            <Suspense fallback={<div>Đang tải...</div>}>
                <AdminDigitalAssets />
            </Suspense>
        </div>
    );
}
