import { Suspense } from "react";
import { Metadata } from "next";
import AdminComicCategories from "@/components/admin/comics/categories/AdminComicCategories";
import PageMeta from "@/components/ui/navigation/PageMeta";

export const metadata: Metadata = {
    title: "Danh má»¥c truyá»‡n | Admin",
    description: "Quáº£n lÃ½ phÃ¢n loáº¡i truyá»‡n tranh",
};

export default function ComicCategoriesPage() {
    return (
        <div className="w-full p-4">
            <PageMeta
                title="Danh má»¥c truyá»‡n"
                breadcrumbs={[
                    { label: "Trang quáº£n trá»‹", href: "/admin" },
                    { label: "Comic" },
                    { label: "Danh má»¥c truyá»‡n" },
                ]}
            />
            <Suspense fallback={<div>Äang táº£i...</div>}>
                <AdminComicCategories />
            </Suspense>
        </div>
    );
}

