import { Suspense } from "react";
import { Metadata } from "next";
import AdminWarehouses from "@/components/admin/ecommerce/warehouses/warehouse-management/AdminWarehouses";
import PageMeta from "@/components/ui/navigation/PageMeta";

export const metadata: Metadata = {
  title: "Kho hÃ ng | Admin",
  description: "Quáº£n lÃ½ kho hÃ ng",
};

export default function AdminWarehousesPage() {
  return (
    <div className="w-full p-4">
      <PageMeta
        title="Kho hÃ ng"
        breadcrumbs={[
          { label: "Trang quáº£n trá»‹", href: "/admin" },
          { label: "Ecommerce" },
          { label: "Kho hÃ ng" },
        ]}
      />
      <Suspense fallback={<div>Äang táº£i...</div>}>
        <AdminWarehouses />
      </Suspense>
    </div>
  );
}



