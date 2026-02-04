import { Suspense } from "react";
import { Metadata } from "next";
import AdminWarehouses from "@/components/products/warehouse/admin/warehouse-management/AdminWarehouses";
import PageMeta from "@/components/shared/ui/navigation/PageMeta";

export const metadata: Metadata = {
  title: "Kho hàng | Admin",
  description: "Quản lý kho hàng",
};

export default function AdminWarehousesPage() {
  return (
    <div className="w-full p-4">
      <PageMeta
        title="Kho hàng"
        breadcrumbs={[
          { label: "Trang quản trị", href: "/admin" },
          { label: "Ecommerce" },
          { label: "Kho hàng" },
        ]}
      />
      <Suspense fallback={<div>Đang tải...</div>}>
        <AdminWarehouses />
      </Suspense>
    </div>
  );
}
