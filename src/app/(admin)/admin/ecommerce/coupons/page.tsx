import { Suspense } from "react";
import { Metadata } from "next";
import AdminCoupons from "@/components/admin/ecommerce/coupons/AdminCoupons";
import PageMeta from "@/components/ui/navigation/PageMeta";

export const metadata: Metadata = {
    title: "MÃ£ khuyáº¿n mÃ£i | Admin",
    description: "Quáº£n lÃ½ mÃ£ giáº£m giÃ¡ vÃ  chÆ°Æ¡ng trÃ¬nh khuyáº¿n mÃ£i",
};

export default function AdminCouponsPage() {
    return (
        <div className="w-full p-4">
            <PageMeta
                title="MÃ£ khuyáº¿n mÃ£i"
                breadcrumbs={[
                    { label: "Trang quáº£n trá»‹", href: "/admin" },
                    { label: "Ecommerce" },
                    { label: "MÃ£ khuyáº¿n mÃ£i" },
                ]}
            />
            <Suspense fallback={<div>Äang táº£i...</div>}>
                <AdminCoupons />
            </Suspense>
        </div>
    );
}

