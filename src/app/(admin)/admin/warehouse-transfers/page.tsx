import WarehouseTransferList from "@/components/admin/WarehouseTransfers/WarehouseTransferList";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Quản lý Chuyển kho | Admin",
    description: "Quản lý phiếu chuyển kho hàng",
};

export default function WarehouseTransfersPage() {
    return <WarehouseTransferList />;
}
