import { Suspense } from "react";
import { Metadata } from "next";
import AdminOrders from "@/components/admin/ecommerce/orders/AdminOrders";
import PageMeta from "@/components/ui/navigation/PageMeta";

export const metadata: Metadata = {
    title: "ÄÆ¡n hÃ ng | Admin",
    description: "Quáº£n lÃ½ Ä‘Æ¡n hÃ ng khÃ¡ch hÃ ng",
};

export default function AdminOrdersPage() {
    return (
        <div className="w-full p-4">
            <PageMeta
                title="ÄÆ¡n hÃ ng"
                breadcrumbs={[
                    { label: "Trang quáº£n trá»‹", href: "/admin" },
                    { label: "Ecommerce" },
                    { label: "ÄÆ¡n hÃ ng" },
                ]}
            />
            <Suspense fallback={<div>Äang táº£i...</div>}>
                <AdminOrders />
            </Suspense>
        </div>
    );
}

