"use client";

import { useState, useEffect } from "react";
import { adminComicService } from "@/lib/api/admin/comic";
import { ComicStatsOverview, AdminComic, ComicTrendingData } from "@/types/comic";
import { useToastContext } from "@/contexts/ToastContext";
import PageMeta from "@/components/ui/navigation/PageMeta";
import SkeletonLoader from "@/components/ui/feedback/SkeletonLoader";

export default function ComicStatsPage() {
    const [overview, setOverview] = useState<ComicStatsOverview | null>(null);
    const [topViewed, setTopViewed] = useState<AdminComic[]>([]);
    const [topFollowed, setTopFollowed] = useState<AdminComic[]>([]);
    const [trending, setTrending] = useState<ComicTrendingData[]>([]);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState("all_time");
    const { showError } = useToastContext();

    useEffect(() => {
        fetchStats();
    }, [period]);

    const fetchStats = async () => {
        try {
            setLoading(true);

            const [overviewData, topViewedData, topFollowedData, trendingData] = await Promise.all([
                adminComicService.getStatsOverview(),
                adminComicService.getTopViewed({ period, limit: 10 }),
                adminComicService.getTopFollowed({ limit: 10 }),
                adminComicService.getTrending(7),
            ]);

            setOverview(overviewData);
            setTopViewed(topViewedData);
            setTopFollowed(topFollowedData);
            setTrending(trendingData);
        } catch (error: any) {
            showError(error?.response?.data?.message || "Không thể tải thống kê");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-8">
                <SkeletonLoader type="table" rows={10} columns={3} />
            </div>
        );
    }

    return (
        <div className="p-8 space-y-10 animate-in fade-in duration-500">
            <PageMeta
                title="Báo cáo & Thống kê"
                breadcrumbs={[
                    { label: "Trang quản trị", href: "/admin" },
                    { label: "Thống kê truyện tranh" },
                ]}
            />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Phân tích hệ thống</h1>
                    <p className="text-gray-500 font-medium mt-1">Dữ liệu chi tiết về hoạt động đọc truyện và tương tác</p>
                </div>
                <div className="bg-white p-1 rounded-2xl shadow-sm border border-gray-100 flex gap-1">
                    {["all_time", "month", "week"].map((p) => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${period === p
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                                : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                                }`}
                        >
                            {p === "all_time" ? "Toàn thời gian" : p === "month" ? "Tháng này" : "Tuần này"}
                        </button>
                    ))}
                </div>
            </div>

            {/* Overview Cards */}
            {overview && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Tổng số truyện"
                        value={overview.total_comics}
                        subValue={`+${overview.new_comics_today} hôm nay`}
                        icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />}
                        color="blue"
                    />
                    <StatCard
                        title="Tổng số chương"
                        value={overview.total_chapters}
                        subValue={`+${overview.new_chapters_today} hôm nay`}
                        icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />}
                        color="purple"
                    />
                    <StatCard
                        title="Tổng lượt xem"
                        value={overview.total_views}
                        icon={
                            <>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </>
                        }
                        color="green"
                    />
                    <StatCard
                        title="Đang theo dõi"
                        value={overview.total_follows}
                        icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />}
                        color="pink"
                    />
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Top Lists */}
                <div className="space-y-10">
                    <TopListSection
                        title="Xem nhiều nhất"
                        items={topViewed}
                        unit="lượt xem"
                        color="orange"
                    />
                    <TopListSection
                        title="Theo dõi nhiều nhất"
                        items={topFollowed}
                        unit="theo dõi"
                        color="pink"
                    />
                </div>

                {/* Trending Chart */}
                <div className="bg-white rounded-[32px] shadow-2xl shadow-gray-200/50 p-10 border border-gray-100 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Lượt xem 7 ngày qua</h2>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 bg-blue-600 rounded-full"></span>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Dữ liệu thực tế</span>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-between gap-6">
                        {trending.map((data) => {
                            const maxViews = Math.max(...trending.map(d => d.views));
                            const percentage = (data.views / (maxViews || 1)) * 100;
                            const isToday = new Date(data.date).toDateString() === new Date().toDateString();

                            return (
                                <div key={data.date} className="group flex flex-col gap-2">
                                    <div className="flex justify-between items-end px-1">
                                        <div className={`text-xs font-black uppercase tracking-widest ${isToday ? "text-blue-600" : "text-gray-400"}`}>
                                            {new Date(data.date).toLocaleDateString("vi-VN", { weekday: "short", day: "numeric", month: "short" })}
                                            {isToday && " (Hôm nay)"}
                                        </div>
                                        <div className="text-xs font-black text-gray-900">{data.views.toLocaleString()}</div>
                                    </div>
                                    <div className="h-6 bg-gray-50 rounded-full overflow-hidden p-1 border border-gray-100 ring-1 ring-inset ring-gray-100">
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-1000 ease-out flex items-center justify-end pr-2 group-hover:from-blue-600 group-hover:to-indigo-700"
                                            style={{ width: `${Math.max(percentage, 5)}%` }}
                                        >
                                            {percentage > 15 && <div className="w-1 h-1 bg-white/50 rounded-full"></div>}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, subValue, icon, color }: any) {
    const colors: any = {
        blue: "bg-blue-50 text-blue-600",
        purple: "bg-purple-50 text-purple-600",
        green: "bg-green-50 text-green-600",
        pink: "bg-pink-50 text-pink-600",
        orange: "bg-orange-50 text-orange-600",
    };

    return (
        <div className="bg-white rounded-[32px] p-8 shadow-xl shadow-gray-200/30 border border-gray-100 hover:shadow-2xl transition-all hover:-translate-y-1">
            <div className={`w-14 h-14 ${colors[color]} rounded-2xl flex items-center justify-center mb-6`}>
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {icon}
                </svg>
            </div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{title}</p>
            <div className="flex items-baseline gap-2">
                <p className="text-3xl font-black text-gray-900 tracking-tighter">{value.toLocaleString()}</p>
                {subValue && <span className="text-[10px] font-bold text-green-500">{subValue}</span>}
            </div>
        </div>
    );
}

function TopListSection({ title, items, unit, color }: any) {
    const colors: any = {
        orange: "bg-orange-600",
        pink: "bg-pink-600",
        blue: "bg-blue-600",
    };

    return (
        <div className="bg-white rounded-[32px] shadow-xl shadow-gray-200/30 p-8 border border-gray-100">
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter mb-8 flex items-center gap-3">
                <span className={`w-2 h-8 ${colors[color]} rounded-full`}></span>
                {title}
            </h2>
            <div className="space-y-6">
                {items.length > 0 ? items.map((comic: any, index: number) => (
                    <div key={comic.id} className="group flex items-center gap-5 hover:translate-x-1 transition-transform">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm italic ${index === 0 ? "bg-yellow-400 text-white shadow-lg shadow-yellow-200 outline outline-4 outline-yellow-50" :
                            index === 1 ? "bg-gray-400 text-white" :
                                index === 2 ? "bg-orange-400 text-white" :
                                    "bg-gray-50 text-gray-400 border border-gray-100"
                            }`}>
                            #{index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-black text-gray-900 truncate group-hover:text-blue-600 transition-colors uppercase tracking-tight">{comic.title}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{comic.author}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-black text-gray-900 tracking-tighter">{comic.view_count?.toLocaleString()}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{unit}</p>
                        </div>
                    </div>
                )) : (
                    <p className="text-center py-10 text-gray-400 font-bold uppercase text-xs tracking-widest">Không có dữ liệu</p>
                )}
            </div>
        </div>
    );
}
