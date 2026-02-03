import { Suspense } from "react";
import { Metadata } from "next";
import AdminContentTemplates from "@/components/admin/core/content-templates/AdminContentTemplates";
import PageMeta from "@/components/ui/navigation/PageMeta";

export const metadata: Metadata = {
    title: "Quáº£n lÃ½ Máº«u ná»™i dung | Admin",
    description: "Quáº£n lÃ½ danh sÃ¡ch cÃ¡c máº«u ná»™i dung Email, SMS, Telegram, Zalo",
};

export default function AdminContentTemplatesPage() {
    return (
        <div className="w-full">
            <PageMeta
                title="Quáº£n lÃ½ Máº«u ná»™i dung"
                breadcrumbs={[
                    { label: "Trang quáº£n trá»‹", href: "/admin", },
                    { label: "Máº«u ná»™i dung" },
                ]}
            />
            <Suspense fallback={
                <div className="p-8 flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            }>
                <AdminContentTemplates />
            </Suspense>
        </div>
    );
}

