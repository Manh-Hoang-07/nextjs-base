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
        <main className="bg-[#1a1a1a] min-h-screen text-white pt-24 pb-32">
            {/* Reading UI (Bottom Bar only, Top uses global header) */}
            <ReadingToolbar
                nextChapter={nextChapter}
                prevChapter={prevChapter}
                chapters={chaptersData ? (Array.isArray(chaptersData) ? chaptersData : (chaptersData.data || [])) : []}
                currentChapterId={params.id}
            />

            {/* Content Area */}
            <div className="container mx-auto max-w-4xl py-6 flex flex-col items-center">
                <div className="space-y-0 w-full">
                    {pages.map((page, index) => (
                        <div key={index} className="relative w-full overflow-hidden bg-gray-900 flex justify-center">
                            <img
                                src={page.image_url}
                                alt={`Page ${page.page_number}`}
                                className="w-full h-auto object-contain select-none"
                                loading={index < 3 ? "eager" : "lazy"}
                            />
                        </div>
                    ))}
                </div>

                {/* Enhanced Bottom Navigation Section */}
                <div className="mt-24 mb-40 flex flex-col items-center px-4">
                    <div className="flex items-center gap-4 mb-8 opacity-40">
                        <div className="h-px w-12 bg-gradient-to-r from-transparent to-white" />
                        <div className="w-2 h-2 rounded-full bg-white" />
                        <div className="h-px w-12 bg-gradient-to-l from-transparent to-white" />
                    </div>

                    <h3 className="text-4xl sm:text-5xl font-black tracking-tighter uppercase italic mb-12 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
                        Hết chương rồi!
                    </h3>

                    <div className="w-full max-w-lg space-y-4">
                        {nextChapter ? (
                            <Link
                                href={`/home/chapters/${nextChapter.id}`}
                                className="group relative block w-full bg-red-600 hover:bg-red-700 p-6 rounded-3xl transition-all duration-300 shadow-2xl shadow-red-900/40 hover:-translate-y-1 overflow-hidden"
                            >
                                <div className="relative z-10 flex justify-between items-center">
                                    <div className="text-left">
                                        <p className="text-red-200 text-xs font-black uppercase tracking-widest mb-1">Chương tiếp theo</p>
                                        <h4 className="text-white text-xl font-bold truncate">Đọc tiếp ngay</h4>
                                    </div>
                                    <ChevronRightIcon className="w-10 h-10 text-white group-hover:translate-x-2 transition-transform duration-300" />
                                </div>
                                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all" />
                            </Link>
                        ) : (
                            <div className="w-full bg-white/5 p-8 rounded-3xl border border-dashed border-white/10 text-center">
                                <p className="text-gray-500 font-bold">Bạn đã đọc hết chương mới nhất!</p>
                            </div>
                        )}

                        <div className="flex gap-4">
                            {prevChapter && (
                                <Link
                                    href={`/home/chapters/${prevChapter.id}`}
                                    className="flex-1 flex items-center justify-center gap-3 p-5 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all text-sm font-bold active:scale-95"
                                >
                                    <ChevronLeftIcon className="w-5 h-5" />
                                    <span>Chương trước</span>
                                </Link>
                            )}
                            <Link
                                href={`/home/comics/${chapterDetail?.comic?.slug || ''}`}
                                className="flex-1 flex items-center justify-center gap-3 p-5 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all text-sm font-bold active:scale-95 text-center"
                            >
                                <ListBulletIcon className="w-5 h-5" />
                                <span>Danh sách</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
