import { Suspense } from "react";
import { Metadata } from "next";
import AdminProductCategories from "@/components/admin/ecommerce/products/categories/AdminProductCategories";
import PageMeta from "@/components/ui/navigation/PageMeta";

export const metadata: Metadata = {
  title: "Danh má»¥c sáº£n pháº©m | Admin",
  description: "Quáº£n lÃ½ danh má»¥c sáº£n pháº©m",
};

export default function AdminProductCategoriesPage() {
  return (
    <div className="w-full p-4">
      <PageMeta
        title="Danh má»¥c sáº£n pháº©m"
        breadcrumbs={[
          { label: "Trang quáº£n trá»‹", href: "/admin" },
          { label: "Ecommerce" },
          { label: "Danh má»¥c sáº£n pháº©m" },
        ]}
      />
      <Suspense fallback={<div>Äang táº£i...</div>}>
        <AdminProductCategories />
      </Suspense>
    </div>
  );
}



