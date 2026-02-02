"use client";

import { useMemo, useState } from "react";
import { useAdminListPage } from "@/hooks/useAdminListPage";
import { adminEndpoints } from "@/lib/api/endpoints";
import SkeletonLoader from "@/components/ui/feedback/SkeletonLoader";
import ConfirmModal from "@/components/ui/feedback/ConfirmModal";
import Actions from "@/components/ui/data-display/Actions";
import Pagination from "@/components/ui/data-display/Pagination";
import ComicCommentFilter from "./ComicCommentFilter";
import { Comment } from "@/types/comic";
import Image from "next/image";
import { User, MessageSquare } from "lucide-react";
import { api } from "@/lib/api/client";

const formatDate = (dateString?: string): string => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleString("vi-VN", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

export default function AdminComicComments() {
    const listOptions = useMemo(
        () => ({
            endpoints: {
                list: adminEndpoints.comicComments.list,
                delete: (id: string | number) => adminEndpoints.comicComments.delete(id),
                // statistic endpoint is available but not used for list
            },
            messages: {
                deleteSuccess: "Bình luận đã được xóa thành công",
            },
        }),
        []
    );

    const {
        items,
        loading,
        pagination,
        filters,
        modals,
        selectedItem,
        openDeleteModal,
        closeDeleteModal,
        updateFilters,
        changePage,
        handleDelete,
        getSerialNumber,
        hasData,
        refresh,
        showSuccess,
        showError,
    } = useAdminListPage(listOptions);

    const [togglingId, setTogglingId] = useState<string | null>(null);

    const handleToggleStatus = async (comment: Comment) => {
        const newStatus = comment.status === "visible" ? "hidden" : "visible";
        setTogglingId(comment.id);
        try {
            await api.put(adminEndpoints.comicComments.update(comment.id), {
                status: newStatus,
            });
            showSuccess(`Đã ${newStatus === "visible" ? "hiện" : "ẩn"} bình luận`);
            refresh();
        } catch (error) {
            showError("Không thể cập nhật trạng thái bình luận");
        } finally {
            setTogglingId(null);
        }
    };

    return (
        <div className="admin-comic-comments">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold font-primary text-gray-900 flex items-center gap-2">
                    <MessageSquare className="text-blue-600 w-6 h-6" />
                    Quản lý bình luận
                </h1>
            </div>

            <ComicCommentFilter initialFilters={filters} onUpdateFilters={updateFilters} />

            <div className="mt-6 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                {loading ? (
                    <SkeletonLoader type="table" rows={10} columns={6} />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 w-16">
                                        STT
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 w-64">
                                        Người gửi
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Nội dung
                                    </th>
                                    {/* <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 w-40">
                                        Truyện
                                    </th> */}
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 w-24">
                                        Trạng thái
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 w-40">
                                        Ngày gửi
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 w-24">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {items.map((comment: any, index) => (
                                    <tr key={comment.id} className={`${comment.status === "hidden" ? "bg-red-50" : ""} hover:bg-gray-50 transition-colors`}>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                            {getSerialNumber(index)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="h-8 w-8 flex-shrink-0">
                                                    {comment.user?.image ? (
                                                        <Image
                                                            className="h-8 w-8 rounded-full object-cover"
                                                            src={comment.user.image}
                                                            alt={comment.user.name || "User"}
                                                            width={32}
                                                            height={32}
                                                        />
                                                    ) : (
                                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
                                                            <User className="h-4 w-4 text-gray-500" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="ml-3 min-w-0 flex-1">
                                                    <div className="truncate text-sm font-medium text-gray-900">
                                                        {comment.user?.name || comment.user?.username || "Khách"}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="line-clamp-2 text-sm text-gray-900">
                                                {comment.content}
                                            </div>
                                            {/* Optional: Show comic title if available */}
                                            {/* {comment.comic && (
                                                <div className="mt-1 text-xs text-gray-500 flex items-center gap-1">
                                                    <span className="font-semibold">Truyện:</span> {comment.comic.title}
                                                </div>
                                            )} */}
                                        </td>
                                        {/* <td className="px-6 py-4">
                                            {comment.comic?.title || "N/A"}
                                        </td> */}
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <span
                                                className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold leading-5 ${comment.status === 'visible'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}
                                            >
                                                {comment.status === 'visible' ? 'Công khai' : 'Đang ẩn'}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                            {formatDate(comment.created_at)}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-center text-sm font-medium">
                                            <Actions
                                                item={comment}
                                                showView={false}
                                                showEdit={false}
                                                showDelete={true}
                                                onDelete={() => openDeleteModal(comment)}
                                                additionalActions={[
                                                    {
                                                        label: comment.status === 'visible' ? 'Ẩn bình luận' : 'Hiện bình luận',
                                                        action: () => handleToggleStatus(comment),
                                                        icon: comment.status === 'visible' ? 'eye-off' : 'eye',
                                                        className: comment.status === 'visible' ? 'text-amber-600 hover:text-amber-700' : 'text-green-600 hover:text-green-700'
                                                    },
                                                ]}
                                            />
                                        </td>
                                    </tr>
                                ))}
                                {items.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-10 text-center text-gray-500 italic">
                                            Không tìm thấy dữ liệu
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {hasData && (
                <div className="mt-8">
                    <Pagination
                        currentPage={pagination.page}
                        totalPages={pagination.totalPages}
                        totalItems={pagination.totalItems}
                        onPageChange={changePage}
                    />
                </div>
            )}

            <ConfirmModal
                show={modals.delete}
                title="Xác nhận xóa"
                message="Bạn có chắc chắn muốn xóa bình luận này?"
                onClose={closeDeleteModal}
                onConfirm={() => handleDelete(selectedItem?.id)}
                confirmText="Xóa bình luận"
            />
        </div>
    );
}
