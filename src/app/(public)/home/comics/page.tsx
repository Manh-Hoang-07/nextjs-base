import { Metadata } from "next";
import Link from "next/link";
import { getComics, getComicCategories } from "@/lib/api/public/comic";
import { ComicCard } from "@/components/public/comic/ComicCard";
import { CategorySidebar } from "@/components/public/comic/CategorySidebar";
import "@/styles/comic.css";

interface Props {
    searchParams: {
        page?: string;
        sort?: string;
        search?: string;
        comic_category_id?: string;
    };
}

export const metadata: Metadata = {
    title: "Danh sách truyện tranh | Comic Haven",
    description: "Khám phá hàng ngàn bộ truyện tranh hấp dẫn với nhiều thể loại khác nhau.",
};

export default async function ComicListPage({ searchParams }: Props) {
    const page = parseInt(searchParams.page || "1");
    const comicsData = await getComics({
        page,
        sort: searchParams.sort || "last_chapter_updated_at:DESC",
        search: searchParams.search,
        comic_category_id: searchParams.comic_category_id
    });
    const categories = await getComicCategories();

    return (
        <main className="bg-[#f8f9fa] min-h-screen py-8">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main List */}
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-8">
                            <h1 className="text-3xl font-black text-gray-900 uppercase">
                                {searchParams.search ? `Kết quả cho: "${searchParams.search}"` : "Tất cả truyện"}
                            </h1>

                            <div className="flex gap-2 text-sm font-bold">
                                <Link
                                    href="/home/comics?sort=last_chapter_updated_at:DESC"
                                    className={`px-4 py-2 rounded-full border transition-colors ${!searchParams.sort || searchParams.sort === 'last_chapter_updated_at:DESC' ? 'bg-red-600 text-white border-red-600' : 'bg-white text-gray-600 border-gray-200 hover:border-red-500'}`}
                                >
                                    Mới cập nhật
                                </Link>
                                <Link
                                    href="/home/comics?sort=view_count:DESC"
                                    className={`px-4 py-2 rounded-full border transition-colors ${searchParams.sort === 'view_count:DESC' ? 'bg-red-600 text-white border-red-600' : 'bg-white text-gray-600 border-gray-200 hover:border-red-500'}`}
                                >
                                    Xem nhiều
                                </Link>
                            </div>
                        </div>

                        {comicsData && comicsData.data.length > 0 ? (
                            <>
                                <div className="comic-grid mb-12">
                                    {comicsData.data.map(comic => (
                                        <ComicCard key={comic.id} comic={comic} />
                                    ))}
                                </div>

                                { /* Pagination - Simple */}
                                <div className="flex justify-center gap-2">
                                    {comicsData.meta.hasPreviousPage && (
                                        <Link
                                            href={`/home/comics?page=${page - 1}`}
                                            className="px-6 py-3 bg-white border border-gray-200 rounded-xl font-bold hover:border-red-500 transition-colors"
                                        >
                                            Trang trước
                                        </Link>
                                    )}
                                    {comicsData.meta.hasNextPage && (
                                        <Link
                                            href={`/home/comics?page=${page + 1}`}
                                            className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-shadow shadow-lg shadow-red-200"
                                        >
                                            Trang tiếp theo
                                        </Link>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-dashed border-gray-300">
                                <p className="text-xl text-gray-500 font-bold mb-4">Không tìm thấy bộ truyện nào phù hợp!</p>
                                <Link href="/home/comics" className="text-red-500 font-bold hover:underline">Xem tất cả truyện</Link>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="lg:w-80 w-full">
                        <div className="sticky top-24 space-y-8">
                            <CategorySidebar categories={categories} />

                            {/* Simple search box in sidebar */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4">Tìm kiếm</h3>
                                <form action="/home/comics" method="GET" className="relative">
                                    <input
                                        type="text"
                                        name="search"
                                        placeholder="Tên truyện, tác giả..."
                                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-red-500 outline-none text-gray-700 font-medium"
                                    />
                                    <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}
