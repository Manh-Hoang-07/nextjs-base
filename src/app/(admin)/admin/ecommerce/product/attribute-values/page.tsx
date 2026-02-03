import { Suspense } from "react";
import { Metadata } from "next";
import AdminProductAttributeValues from "@/components/admin/ecommerce/products/attribute-values/AdminProductAttributeValues";
import PageMeta from "@/components/ui/navigation/PageMeta";

export const metadata: Metadata = {
  title: "GiÃ¡ trá»‹ thuá»™c tÃ­nh sáº£n pháº©m | Admin",
  description: "Quáº£n lÃ½ giÃ¡ trá»‹ thuá»™c tÃ­nh sáº£n pháº©m",
};

export default function AdminProductAttributeValuesPage() {
  return (
    <div className="w-full p-4">
      <PageMeta
        title="GiÃ¡ trá»‹ thuá»™c tÃ­nh sáº£n pháº©m"
        breadcrumbs={[
          { label: "Trang quáº£n trá»‹", href: "/admin" },
          { label: "Ecommerce" },
          { label: "GiÃ¡ trá»‹ thuá»™c tÃ­nh sáº£n pháº©m" },
        ]}
      />
      <Suspense fallback={<div>Äang táº£i...</div>}>
        <AdminProductAttributeValues />
      </Suspense>
    </div>
  );
}


