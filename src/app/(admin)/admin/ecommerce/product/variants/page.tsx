import { Suspense } from "react";
import { Metadata } from "next";
import PageMeta from "@/components/shared/ui/navigation/PageMeta";
import AdminProductVariants from "@/components/products/variant/admin/AdminProductVariants";

export const metadata: Metadata = {
  title: "Biến thể sản phẩm | Admin",
  description: "Quản lý biến thể sản phẩm",
};

export default function AdminProductVariantsPage() {
  return (
    <div className="w-full p-4">
      <PageMeta
        title="Biến thể sản phẩm"
        breadcrumbs={[
          { label: "Trang quản trị", href: "/admin" },
          { label: "Ecommerce" },
          { label: "Biến thể sản phẩm" },
        ]}
      />
      <Suspense fallback={<div>Đang tải...</div>}>
        <AdminProductVariants />
      </Suspense>
    </div>
  );
}
