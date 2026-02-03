import WarehouseTransferList from "@/components/admin/ecommerce/warehouses/transfers/WarehouseTransferList";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Quáº£n lÃ½ Chuyá»ƒn kho | Admin",
    description: "Quáº£n lÃ½ phiáº¿u chuyá»ƒn kho hÃ ng",
};

export default function WarehouseTransfersPage() {
    return <WarehouseTransferList />;
}

