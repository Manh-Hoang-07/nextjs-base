import { Suspense } from "react";
import { Metadata } from "next";
import AdminProductAttributes from "@/components/admin/ecommerce/products/attributes/AdminProductAttributes";
import PageMeta from "@/components/ui/navigation/PageMeta";

export const metadata: Metadata = {
  title: "Thuộc tính sản phẩm | Admin",
  description: "Quản lý thuộc tính sản phẩm",
};

export default function AdminProductAttributesPage() {
  return (
    <div className="w-full p-4">
      <PageMeta
        title="Thuộc tính sản phẩm"
        breadcrumbs={[
          { label: "Trang quản trị", href: "/admin" },
          { label: "Ecommerce" },
          { label: "Thuộc tính sản phẩm" },
        ]}
      />
      <Suspense fallback={<div>Đang tải...</div>}>
        <AdminProductAttributes />
      </Suspense>
    </div>
  );
}
