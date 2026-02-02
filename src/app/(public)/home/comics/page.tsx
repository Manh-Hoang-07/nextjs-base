import { Metadata } from "next";
import Link from "next/link";
import { getComics, getComicCategories } from "@/lib/api/public/comic";
import { ComicCard } from "@/components/public/comic/ComicCard";
import { Pagination } from "@/components/public/comic/Pagination";
import { CategorySelect } from "@/components/public/comic/CategorySelect";
import "@/styles/comic.css";

interface Props {
    searchParams: Promise<{
        page?: string;
        sort?: string;
        comic_category_id?: string;
        is_featured?: string;
    }>;
}

export const metadata: Metadata = {
    title: "Danh sách truyện tranh | Comic Haven",
    description: "Khám phá hàng ngàn bộ truyện tranh hấp dẫn với nhiều thể loại khác nhau.",
};

export default async function ComicListPage({ searchParams }: Props) {
    const sp = await searchParams;
    const page = parseInt(sp.page || "1");
    const comicsData = await getComics({
        page,
        sort: sp.sort || "last_chapter_updated_at:desc",
        comic_category_id: sp.comic_category_id,
        is_featured: sp.is_featured === 'true'
    });
    const categories = await getComicCategories();

    return (
        <main className="bg-[#f8f9fa] min-h-screen py-8">
            <div className="container mx-auto px-4">
                <div className="flex flex-col gap-8">
                    {/* Header Controls */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                        <h1 className="text-3xl font-black text-gray-900 uppercase">
                            Tất cả truyện
                        </h1>

                        <div className="flex flex-wrap items-center gap-3">
                            {/* Category Select Dropdown */}
                            <CategorySelect categories={categories} />

                            {/* Sort Buttons */}
                            <div className="flex bg-white rounded-xl p-1 border border-gray-100 shadow-sm">
                                <Link
                                    href={`/home/comics?sort=last_chapter_updated_at:desc${sp.comic_category_id ? `&comic_category_id=${sp.comic_category_id}` : ''}`}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${!sp.sort || sp.sort === 'last_chapter_updated_at:desc' ? 'bg-red-600 text-white shadow-md' : 'text-gray-600 hover:text-red-500'}`}
                                >
                                    Mới cập nhật
                                </Link>
                                <Link
                                    href={`/home/comics?sort=view_count:desc${sp.comic_category_id ? `&comic_category_id=${sp.comic_category_id}` : ''}`}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${sp.sort === 'view_count:desc' ? 'bg-red-600 text-white shadow-md' : 'text-gray-600 hover:text-red-500'}`}
                                >
                                    Xem nhiều
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Main Grid - Now Full Width */}
                    <div className="flex-1">
                        {comicsData && comicsData.data && comicsData.data.length > 0 ? (
                            <>
                                <div className="comic-grid mb-12">
                                    {comicsData.data.map(comic => (
                                        <ComicCard key={comic.id} comic={comic} />
                                    ))}
                                </div>

                                <Pagination
                                    currentPage={comicsData.meta.page}
                                    totalPages={comicsData.meta.totalPages}
                                    hasNextPage={comicsData.meta.hasNextPage}
                                    hasPreviousPage={comicsData.meta.hasPreviousPage}
                                />
                            </>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-dashed border-gray-300">
                                <p className="text-xl text-gray-500 font-bold mb-4">Không tìm thấy bộ truyện nào phù hợp!</p>
                                <Link href="/home/comics" className="text-red-500 font-bold hover:underline">Xem tất cả truyện</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
