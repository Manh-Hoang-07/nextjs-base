import { Suspense } from "react";
import { Metadata } from "next";
import AdminProducts from "@/components/admin/ecommerce/products/products-management/AdminProducts";
import PageMeta from "@/components/ui/navigation/PageMeta";

export const metadata: Metadata = {
  title: "Sáº£n pháº©m | Admin",
  description: "Quáº£n lÃ½ sáº£n pháº©m",
};

export default function AdminProductsPage() {
  return (
    <div className="w-full p-4">
      <PageMeta
        title="Sáº£n pháº©m"
        breadcrumbs={[
          { label: "Trang quáº£n trá»‹", href: "/admin" },
          { label: "Ecommerce" },
          { label: "Sáº£n pháº©m" },
        ]}
      />
      <Suspense fallback={<div>Äang táº£i...</div>}>
        <AdminProducts />
      </Suspense>
    </div>
  );
}


