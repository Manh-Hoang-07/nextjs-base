import { Suspense } from "react";
import { Metadata } from "next";
import AdminShippingMethods from "@/components/admin/ecommerce/shippings/AdminShippingMethods";
import PageMeta from "@/components/ui/navigation/PageMeta";

export const metadata: Metadata = {
  title: "PhÆ°Æ¡ng thá»©c váº­n chuyá»ƒn | Admin",
  description: "Quáº£n lÃ½ danh sÃ¡ch phÆ°Æ¡ng thá»©c váº­n chuyá»ƒn (Standard, Express, ...)",
};

export default function AdminShippingMethodsPage() {
  return (
    <div className="w-full p-4">
      <PageMeta
        title="PhÆ°Æ¡ng thá»©c váº­n chuyá»ƒn"
        breadcrumbs={[
          { label: "Trang quáº£n trá»‹", href: "/admin" },
          { label: "Ecommerce" },
          { label: "PhÆ°Æ¡ng thá»©c váº­n chuyá»ƒn" },
        ]}
      />
      <Suspense fallback={<div>Äang táº£i...</div>}>
        <AdminShippingMethods />
      </Suspense>
    </div>
  );
}



