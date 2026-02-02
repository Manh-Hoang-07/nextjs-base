"use client";

import { useState } from "react";
import Image from "next/image";
import { adminEndpoints } from "@/lib/api/endpoints";
import { useAdminListPage } from "@/hooks/useAdminListPage";
import SkeletonLoader from "@/components/ui/feedback/SkeletonLoader";
import ConfirmModal from "@/components/ui/feedback/ConfirmModal";
import Actions from "@/components/ui/data-display/Actions";
import Pagination from "@/components/ui/data-display/Pagination";
import { Comment } from "@/types/comic";
import { Eye, EyeOff, MessageSquare, User } from "lucide-react";
import Modal from "@/components/ui/feedback/Modal";
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
    } = useAdminListPage({
        endpoints: {
            list: adminEndpoints.comicComments.list,
            delete: (id) => adminEndpoints.comicComments.delete(id),
        },
        messages: {
            deleteSuccess: "Bình luận đã được xóa thành công",
        },
    });

    const [togglingId, setTogglingId] = useState<string | null>(null);
    const [viewComment, setViewComment] = useState<Comment | null>(null);

    const handleToggleStatus = async (comment: any) => {
        const newStatus = comment.status === "visible" ? "hidden" : "visible";
        setTogglingId(comment.id);
        try {
            await api.patch(adminEndpoints.comicComments.updateStatus(comment.id), {
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
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <MessageSquare className="text-blue-600" />
                    Quản lý bình luận truyện tranh
                </h1>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden mt-6">
                {loading ? (
                    <SkeletonLoader type="table" rows={10} columns={6} />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">STT</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-64">Người gửi</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nội dung</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">Truyện</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Trạng thái</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Ngày gửi</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {items.map((comment: any, index) => (
                                    <tr key={comment.id} className={`${comment.status === "hidden" ? "bg-gray-50" : ""} hover:bg-gray-50 transition-colors`}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getSerialNumber(index)}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-8 w-8">
                                                    {comment.user_avatar ? (
                                                        <Image className="h-8 w-8 rounded-full object-cover" src={comment.user_avatar} alt={comment.user_name || "User"} width={32} height={32} />
                                                    ) : (
                                                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                                            <User className="text-gray-500 w-4 h-4" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="ml-3 min-w-0 flex-1">
                                                    <div className="text-sm font-medium text-gray-900 truncate">
                                                        {comment.user_name || "Khách"}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 line-clamp-2">
                                                {comment.content}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {comment.comic?.title || "N/A"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${comment.status === 'visible'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {comment.status === 'visible' ? 'Công khai' : 'Đang ẩn'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(comment.created_at)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                                            <Actions
                                                item={comment}
                                                showView={false}
                                                showEdit={false}
                                                showDelete={true}
                                                onDelete={() => openDeleteModal(comment)}
                                                additionalActions={[
                                                    {
                                                        label: "Xem chi tiết",
                                                        action: () => setViewComment(comment),
                                                        icon: "eye",
                                                    },
                                                    {
                                                        label: comment.status === 'visible' ? 'Ẩn bình luận' : 'Hiện bình luận',
                                                        action: () => handleToggleStatus(comment),
                                                        icon: comment.status === 'visible' ? 'eye-off' : 'eye',
                                                    },
                                                ]}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {hasData && (
                <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    totalItems={pagination.totalItems}
                    onPageChange={changePage}
                />
            )}

            <ConfirmModal
                show={modals.delete}
                title="Xác nhận xóa"
                message="Bạn có chắc chắn muốn xóa bình luận này?"
                onClose={closeDeleteModal}
                onConfirm={() => handleDelete(selectedItem?.id)}
            />
        </div>
    );
}
