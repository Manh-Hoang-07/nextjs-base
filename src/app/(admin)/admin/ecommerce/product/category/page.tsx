import { Suspense } from "react";
import { Metadata } from "next";
import AdminProductCategories from "@/components/admin/ecommerce/product/category/AdminProductCategories";
import PageMeta from "@/components/ui/navigation/PageMeta";

export const metadata: Metadata = {
  title: "Danh mục sản phẩm | Admin",
  description: "Quản lý danh mục sản phẩm",
};

export default function AdminProductCategoriesPage() {
  return (
    <div className="w-full p-4">
      <PageMeta
        title="Danh mục sản phẩm"
        breadcrumbs={[
          { label: "Trang quản trị", href: "/admin" },
          { label: "Ecommerce" },
          { label: "Danh mục sản phẩm" },
        ]}
      />
      <Suspense fallback={<div>Đang tải...</div>}>
        <AdminProductCategories />
      </Suspense>
    </div>
  );
}


