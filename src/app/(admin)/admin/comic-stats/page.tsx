"use client";

import { useState, useEffect } from "react";
import { adminAnalyticsService } from "@/lib/api/admin/analytics";
import { AdminDashboardAnalytics, AdminViewHistoryItem } from "@/types/comic";
import { useToastContext } from "@/contexts/ToastContext";
import PageMeta from "@/components/ui/navigation/PageMeta";
import SkeletonLoader from "@/components/ui/feedback/SkeletonLoader";

export default function ComicStatsPage() {
    const [stats, setStats] = useState<AdminDashboardAnalytics | null>(null);
    const [viewHistory, setViewHistory] = useState<AdminViewHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const { showError } = useToastContext();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [analyticsData, historyData] = await Promise.all([
                adminAnalyticsService.getDashboard(),
                adminAnalyticsService.getViewHistory(
                    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    new Date().toISOString().split('T')[0]
                )
            ]);
            setStats(analyticsData);
            setViewHistory(historyData);
        } catch (error: any) {
            showError("Không thể tải dữ liệu thống kê");
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
            <div>
                <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Phân tích hệ thống</h1>
                <p className="text-gray-500 font-medium mt-1">Dữ liệu chi tiết về hoạt động đọc truyện và tương tác</p>
            </div>

            {/* Overview Cards */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard
                        title="Tổng số truyện"
                        value={stats.total_comics}
                        icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />}
                        color="blue"
                    />
                    <StatCard
                        title="Tổng lượt xem"
                        value={stats.total_views}
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
                        value={stats.total_follows}
                        icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />}
                        color="pink"
                    />
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Top Comics */}
                <div className="bg-white rounded-[32px] shadow-xl shadow-gray-200/30 p-8 border border-gray-100">
                    <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter mb-8 flex items-center gap-3">
                        <span className="w-2 h-8 bg-orange-600 rounded-full"></span>
                        Top Truyện
                    </h2>
                    <div className="space-y-6">
                        {stats?.top_comics.map((item, index) => (
                            <div key={item.comic.id} className="group flex items-center gap-5 hover:translate-x-1 transition-transform">
                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm italic ${index === 0 ? "bg-yellow-400 text-white shadow-lg shadow-yellow-200" : "bg-gray-50 text-gray-400 border border-gray-100"}`}>
                                    #{index + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-black text-gray-900 truncate uppercase tracking-tight">{item.comic.title}</p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{item.comic.author}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black text-gray-900 tracking-tighter">{item.stats.view_count.toLocaleString()}</p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">lượt xem</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* View History Chart */}
                <div className="bg-white rounded-[32px] shadow-xl shadow-gray-200/30 p-10 border border-gray-100">
                    <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter mb-10">Lượt xem gần đây</h2>
                    <div className="space-y-6">
                        {viewHistory.map((data) => {
                            const maxViews = Math.max(...viewHistory.map(d => d.count), 1);
                            const percentage = (data.count / maxViews) * 100;
                            return (
                                <div key={data.date} className="flex flex-col gap-2">
                                    <div className="flex justify-between px-1">
                                        <span className="text-xs font-black text-gray-400 uppercase">{data.date}</span>
                                        <span className="text-xs font-black text-gray-900">{data.count.toLocaleString()}</span>
                                    </div>
                                    <div className="h-4 bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                                        <div
                                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-1000"
                                            style={{ width: `${Math.max(percentage, 2)}%` }}
                                        />
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

function StatCard({ title, value, icon, color }: any) {
    const colors: any = {
        blue: "bg-blue-50 text-blue-600",
        green: "bg-green-50 text-green-600",
        pink: "bg-pink-50 text-pink-600",
    };

    return (
        <div className="bg-white rounded-[32px] p-8 shadow-xl shadow-gray-200/30 border border-gray-100">
            <div className={`w-14 h-14 ${colors[color]} rounded-2xl flex items-center justify-center mb-6`}>
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {icon}
                </svg>
            </div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{title}</p>
            <p className="text-3xl font-black text-gray-900 tracking-tighter">{value.toLocaleString()}</p>
        </div>
    );
}
