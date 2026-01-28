import { Suspense } from "react";
import { Metadata } from "next";
import AdminProducts from "@/components/admin/Products/AdminProducts";
import PageMeta from "@/components/ui/navigation/PageMeta";

export const metadata: Metadata = {
  title: "Sản phẩm | Admin",
  description: "Quản lý sản phẩm",
};

export default function AdminProductsPage() {
  return (
    <div className="w-full p-4">
      <PageMeta
        title="Sản phẩm"
        breadcrumbs={[
          { label: "Trang quản trị", href: "/admin" },
          { label: "Ecommerce" },
          { label: "Sản phẩm" },
        ]}
      />
      <Suspense fallback={<div>Đang tải...</div>}>
        <AdminProducts />
      </Suspense>
    </div>
  );
}

