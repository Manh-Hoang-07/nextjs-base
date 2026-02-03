import { Suspense } from "react";
import { Metadata } from "next";
import AdminShippingMethods from "@/components/admin/ecommerce/shipping/AdminShippingMethods";
import PageMeta from "@/components/ui/navigation/PageMeta";

export const metadata: Metadata = {
  title: "Phương thức vận chuyển | Admin",
  description: "Quản lý danh sách phương thức vận chuyển (Standard, Express, ...)",
};

export default function AdminShippingMethodsPage() {
  return (
    <div className="w-full p-4">
      <PageMeta
        title="Phương thức vận chuyển"
        breadcrumbs={[
          { label: "Trang quản trị", href: "/admin" },
          { label: "Ecommerce" },
          { label: "Phương thức vận chuyển" },
        ]}
      />
      <Suspense fallback={<div>Đang tải...</div>}>
        <AdminShippingMethods />
      </Suspense>
    </div>
  );
}


