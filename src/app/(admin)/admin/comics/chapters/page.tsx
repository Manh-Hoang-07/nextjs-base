import { Suspense } from "react";
import { Metadata } from "next";
import AdminChapters from "@/components/admin/comics/chapters/AdminChapters";
import PageMeta from "@/components/ui/navigation/PageMeta";

export const metadata: Metadata = {
    title: "Quáº£n lÃ½ ChÆ°Æ¡ng truyá»‡n | Admin",
    description: "Quáº£n lÃ½ ná»™i dung chÆ°Æ¡ng truyá»‡n",
};

export default function ChaptersPage() {
    return (
        <div className="w-full p-4">
            <PageMeta
                title="ChÆ°Æ¡ng truyá»‡n"
                breadcrumbs={[
                    { label: "Trang quáº£n trá»‹", href: "/admin" },
                    { label: "Comic" },
                    { label: "ChÆ°Æ¡ng truyá»‡n" },
                ]}
            />
            <Suspense fallback={<div>Äang táº£i...</div>}>
                <AdminChapters />
            </Suspense>
        </div>
    );
}

