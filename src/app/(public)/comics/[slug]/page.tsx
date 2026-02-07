import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getComicDetail, getComicChapters } from "@/lib/api/public/comic";
import { getComicComments } from "@/lib/api/public/comment";
import { ChapterList } from "@/components/Features/Comics/Chapters/Public/ChapterList";
import { CommentSection } from "@/components/Features/Comics/Comments/Public/CommentSection";
import { FollowButton } from "@/components/Features/Comics/Shared/FollowButton";
import "@/styles/comic.css";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const comic = await getComicDetail(slug);
    if (!comic) return { title: "Không tìm thấy truyện" };

    return {
        title: `${comic.title} | Comic Haven`,
        description: comic.description,
        openGraph: {
            images: [comic.cover_image],
        },
    };
}

export default async function ComicDetailPage({ params }: Props) {
    const { slug } = await params;
    const [comic, chaptersData] = await Promise.all([
        getComicDetail(slug),
        getComicChapters(slug)
    ]);

    if (!comic) notFound();

    const commentsData = await getComicComments(comic.id, 1);

    return (
        <main className="bg-[#f8f9fa] min-h-screen py-8">
            <div className="container mx-auto px-4">
                {/* Breadcrumbs */}
                <nav className="flex mb-6 text-sm font-medium text-gray-500">
                    <Link href="/" className="hover:text-red-500">Trang chủ</Link>
                    <span className="mx-2">/</span>
                    <Link href="/comics" className="hover:text-red-500">Truyện tranh</Link>
                    <span className="mx-2">/</span>
                    <span className="text-gray-900 truncate">{comic.title}</span>
                </nav>

                <div className="flex flex-col lg:flex-row gap-8 mb-12">
                    {/* Cover Image */}
                    <div className="w-full lg:w-72 flex-shrink-0">
                        <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                            <Image
                                src={comic.cover_image}
                                alt={comic.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    </div>

                    {/* Basic Info */}
                    <div className="flex-1">
                        <h1 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4">{comic.title}</h1>
                        <div className="flex flex-wrap gap-2 mb-6">
                            {comic.categories.map(cat => (
                                <Link
                                    key={cat.id}
                                    href={`/categories/${cat.slug}`}
                                    className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-bold text-gray-600 hover:border-red-500 hover:text-red-500 transition-colors"
                                >
                                    {cat.name}
                                </Link>
                            ))}
                        </div>

                        <div className="space-y-5 mb-8 text-left">
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-1">Tác giả</p>
                                <p className="text-gray-900 font-bold">{comic.author || 'Đang cập nhật'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-1">Trạng thái</p>
                                <p className="text-gray-900 font-bold">
                                    {comic.status === 'completed' ? 'Hoàn thành' : 'Đang tiến hành'}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-1">Lượt xem</p>
                                <p className="text-gray-900 font-bold">{parseInt(comic.stats.view_count).toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-1">Theo dõi</p>
                                <p className="text-gray-900 font-bold">{parseInt(comic.stats.follow_count).toLocaleString()}</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 mb-8">
                            {chaptersData && (Array.isArray(chaptersData) ? chaptersData.length > 0 : chaptersData.data?.length > 0) && (
                                <Link
                                    href={`/chapters/${Array.isArray(chaptersData) ? chaptersData[chaptersData.length - 1].id : chaptersData.data[chaptersData.data.length - 1].id}`}
                                    className="px-8 py-3 bg-red-600 text-white rounded-full font-bold hover:bg-red-700 transition shadow-lg shadow-red-200"
                                >
                                    Đọc từ đầu
                                </Link>
                            )}
                            <FollowButton
                                comicId={comic.id}
                                initialFollowCount={parseInt(comic.stats.follow_count)}
                            />
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-gray-100 italic text-gray-600 leading-relaxed shadow-sm">
                            <p className="not-italic font-bold text-gray-800 mb-2 uppercase text-xs tracking-widest">Nội dung</p>
                            {comic.description || 'Chưa có mô tả cho bộ truyện này.'}
                        </div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto space-y-16">
                    {chaptersData ? (
                        <ChapterList
                            chapters={Array.isArray(chaptersData) ? chaptersData : (chaptersData.data || [])}
                            comicSlug={comic.slug}
                        />
                    ) : (
                        <div className="text-center py-12 bg-white rounded-2xl border border-dashed text-gray-500">
                            Không tìm thấy danh sách chương.
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-12 border-t border-gray-100 pt-12">
                        <CommentSection
                            comicId={comic.id}
                            comments={commentsData?.data || []}
                        />
                    </div>
                </div>
            </div>
        </main>
    );
}
