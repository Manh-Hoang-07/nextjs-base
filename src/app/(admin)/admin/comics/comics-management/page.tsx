import { Suspense } from "react";
import { Metadata } from "next";
import AdminComics from "@/components/admin/comics/comics-management/AdminComics";
import PageMeta from "@/components/ui/navigation/PageMeta";

export const metadata: Metadata = {
    title: "Quáº£n lÃ½ Truyá»‡n tranh | Admin",
    description: "Quáº£n lÃ½ thÆ° viá»‡n truyá»‡n tranh",
};

export default function ComicsPage() {
    return (
        <div className="w-full p-4">
            <PageMeta
                title="Truyá»‡n tranh"
                breadcrumbs={[
                    { label: "Trang quáº£n trá»‹", href: "/admin" },
                    { label: "Comic" },
                    { label: "Truyá»‡n tranh" },
                ]}
            />
            <Suspense fallback={<div>Äang táº£i...</div>}>
                <AdminComics />
            </Suspense>
        </div>
    );
}

