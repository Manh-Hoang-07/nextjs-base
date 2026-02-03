import { Suspense } from "react";
import { Metadata } from "next";
import AdminProductAttributes from "@/components/admin/ecommerce/products/attributes/AdminProductAttributes";
import PageMeta from "@/components/ui/navigation/PageMeta";

export const metadata: Metadata = {
  title: "Thuá»™c tÃ­nh sáº£n pháº©m | Admin",
  description: "Quáº£n lÃ½ thuá»™c tÃ­nh sáº£n pháº©m",
};

export default function AdminProductAttributesPage() {
  return (
    <div className="w-full p-4">
      <PageMeta
        title="Thuá»™c tÃ­nh sáº£n pháº©m"
        breadcrumbs={[
          { label: "Trang quáº£n trá»‹", href: "/admin" },
          { label: "Ecommerce" },
          { label: "Thuá»™c tÃ­nh sáº£n pháº©m" },
        ]}
      />
      <Suspense fallback={<div>Äang táº£i...</div>}>
        <AdminProductAttributes />
      </Suspense>
    </div>
  );
}


