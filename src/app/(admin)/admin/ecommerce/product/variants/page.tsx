import { Suspense } from "react";
import { Metadata } from "next";
import PageMeta from "@/components/ui/navigation/PageMeta";
import AdminProductVariants from "@/components/admin/ecommerce/products/variants/AdminProductVariants";

export const metadata: Metadata = {
  title: "Biáº¿n thá»ƒ sáº£n pháº©m | Admin",
  description: "Quáº£n lÃ½ biáº¿n thá»ƒ sáº£n pháº©m",
};

export default function AdminProductVariantsPage() {
  return (
    <div className="w-full p-4">
      <PageMeta
        title="Biáº¿n thá»ƒ sáº£n pháº©m"
        breadcrumbs={[
          { label: "Trang quáº£n trá»‹", href: "/admin" },
          { label: "Ecommerce" },
          { label: "Biáº¿n thá»ƒ sáº£n pháº©m" },
        ]}
      />
      <Suspense fallback={<div>Äang táº£i...</div>}>
        <AdminProductVariants />
      </Suspense>
    </div>
  );
}



