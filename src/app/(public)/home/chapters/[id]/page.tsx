import { Metadata } from "next";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon, ListBulletIcon } from "@heroicons/react/24/outline";
import { notFound } from "next/navigation";
import { getChapterPages, getChapterNavigation, getChapterDetail, getComicChapters } from "@/lib/api/public/comic";
import { ReadingToolbar } from "@/components/public/comic/ReadingToolbar";
import "@/styles/comic.css";

interface Props {
    params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    return {
        title: `Đang đọc chương | Comic Haven`,
    };
}

export default async function ReadingPage({ params }: Props) {
    const chapterDetail = await getChapterDetail(params.id);

    const [pages, nextChapter, prevChapter, chaptersData] = await Promise.all([
        getChapterPages(params.id),
        getChapterNavigation(params.id, 'next'),
        getChapterNavigation(params.id, 'prev'),
        chapterDetail?.comic?.slug ? getComicChapters(chapterDetail.comic.slug, 1) : Promise.resolve(null)
    ]);

    if (!pages) notFound();

    return (
        <main className="bg-[#f8f9fa] min-h-screen text-gray-900 pt-24 pb-32">
            {/* Reading UI (Bottom Bar only, Top uses global header) */}
            <ReadingToolbar
                nextChapter={nextChapter}
                prevChapter={prevChapter}
                chapters={chaptersData ? (Array.isArray(chaptersData) ? chaptersData : (chaptersData.data || [])) : []}
                currentChapterId={params.id}
            />

            {/* Content Area */}
            <div className="container mx-auto max-w-4xl py-6 flex flex-col items-center">
                <div className="space-y-0 w-full shadow-2xl">
                    {pages.map((page, index) => (
                        <div key={index} className="relative w-full overflow-hidden bg-white flex justify-center">
                            <img
                                src={page.image_url}
                                alt={`Page ${page.page_number}`}
                                className="w-full h-auto object-contain select-none"
                                loading={index < 3 ? "eager" : "lazy"}
                            />
                        </div>
                    ))}
                </div>

                {/* Simplified Bottom Navigation Section */}
                <div className="mt-16 mb-20 flex flex-col items-center px-4 w-full">
                    <div className="flex items-center gap-4 mb-6 opacity-20">
                        <div className="h-px w-12 bg-gray-900" />
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-900" />
                        <div className="h-px w-12 bg-gray-900" />
                    </div>

                    <h3 className="text-2xl font-black tracking-tight uppercase mb-8 text-gray-400">
                        Hết chương rồi!
                    </h3>

                    <div className="flex flex-row gap-3 w-full max-w-2xl">
                        {prevChapter && (
                            <Link
                                href={`/home/chapters/${prevChapter.id}`}
                                className="flex-1 flex items-center justify-center gap-2 p-4 bg-white hover:border-red-500 border border-gray-200 rounded-2xl transition-all text-sm font-bold shadow-sm active:scale-95"
                            >
                                <ChevronLeftIcon className="w-5 h-5 text-gray-400" />
                                <span>Chương trước</span>
                            </Link>
                        )}

                        {nextChapter && (
                            <Link
                                href={`/home/chapters/${nextChapter.id}`}
                                className="flex-1 flex items-center justify-center gap-2 p-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl transition-all text-sm font-bold shadow-lg shadow-red-200 active:scale-95"
                            >
                                <span>Chương tiếp</span>
                                <ChevronRightIcon className="w-5 h-5" />
                            </Link>
                        )}

                        {!nextChapter && !prevChapter && (
                            <div className="flex-1 p-4 bg-gray-100 rounded-2xl text-center text-sm font-bold text-gray-400 border border-gray-200">
                                Đã hết chương mới
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </main>
    );
}
