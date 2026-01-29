import { Suspense } from "react";
import { Metadata } from "next";
import PageMeta from "@/components/ui/navigation/PageMeta";
import WarehouseInventoryClient from "./warehouse-inventory-client";

export const metadata: Metadata = {
  title: "Tồn kho | Admin",
  description: "Quản lý tồn kho theo kho",
};

export default function WarehouseInventoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Match the project's Next.js PageProps convention (params is a Promise)
  // See other dynamic routes in this repo.
  return (
    <div className="w-full p-4">
      <PageMeta
        title="Tồn kho"
        breadcrumbs={[
          { label: "Trang quản trị", href: "/admin" },
          { label: "Ecommerce" },
          { label: "Kho hàng", href: "/admin/warehouses" },
          { label: "Tồn kho" },
        ]}
      />
      <Suspense fallback={<div>Đang tải...</div>}>
        <WarehouseInventoryClientAsync params={params} />
      </Suspense>
    </div>
  );
}

async function WarehouseInventoryClientAsync({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <WarehouseInventoryClient warehouseId={id} />;
}


