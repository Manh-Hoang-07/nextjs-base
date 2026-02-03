import { Suspense } from "react";
import { Metadata } from "next";
import PageMeta from "@/components/ui/navigation/PageMeta";
import WarehouseTransfersClient from "./warehouse-transfers-client";

export const metadata: Metadata = {
  title: "Chuyển kho | Admin",
  description: "Quản lý phiếu chuyển kho",
};

export default function WarehouseTransfersPage() {
  return (
    <div className="w-full p-4">
      <PageMeta
        title="Chuyển kho"
        breadcrumbs={[
          { label: "Trang quản trị", href: "/admin" },
          { label: "Ecommerce" },
          { label: "Kho hàng", href: "/admin/warehouses" },
          { label: "Chuyển kho" },
        ]}
      />
      <Suspense fallback={<div>Đang tải...</div>}>
        <WarehouseTransfersClient />
      </Suspense>
    </div>
  );
}


