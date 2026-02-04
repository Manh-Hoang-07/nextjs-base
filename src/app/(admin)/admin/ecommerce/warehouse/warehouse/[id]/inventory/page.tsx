import { Suspense } from "react";
import { Metadata } from "next";
import PageMeta from "@/components/shared/ui/navigation/PageMeta";
import WarehouseInventory from "@/components/products/warehouse/admin/warehouse-management/WarehouseInventory";

export const metadata: Metadata = {
  title: "Tồn kho | Admin",
  description: "Quản lý tồn kho theo kho",
};

export default function WarehouseInventoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
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
  return <WarehouseInventory warehouseId={id} />;
}


