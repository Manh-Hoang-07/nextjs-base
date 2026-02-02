"use client";

import { useState } from "react";
import { commentService } from "@/lib/api/user/comment";
import { useToastContext } from "@/contexts/ToastContext";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";

interface CommentSectionProps {
    comicId: string;
    comments: any[];
    onCommentSuccess?: () => void;
}

export function CommentSection({ comicId, comments, onCommentSuccess }: CommentSectionProps) {
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { showSuccess, showError } = useToastContext();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        setIsSubmitting(true);
        try {
            await commentService.postComment(comicId, content);
            showSuccess("Đã đăng bình luận!");
            setContent("");
            if (onCommentSuccess) onCommentSuccess();
        } catch (error) {
            showError("Bạn cần đăng nhập để bình luận");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mt-12 space-y-8">
            <h3 className="text-xl font-black uppercase tracking-tight text-gray-900 flex items-center gap-2">
                <ChatBubbleLeftRightIcon className="w-6 h-6 text-blue-500" />
                Bình luận
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Viết bình luận của bạn..."
                    className="w-full p-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none h-24 text-sm"
                />
                <button
                    disabled={isSubmitting || !content.trim()}
                    className="px-8 py-2 bg-blue-600 text-white rounded-full text-sm font-bold hover:bg-blue-700 transition disabled:opacity-50"
                >
                    {isSubmitting ? "Đang gửi..." : "Đăng bình luận"}
                </button>
            </form>

            <div className="space-y-6">
                {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4 group">
                        <div className="w-10 h-10 rounded-full bg-blue-100 overflow-hidden flex-shrink-0 flex items-center justify-center text-blue-500 font-black text-xs">
                            {comment.user_avatar ? (
                                <img src={comment.user_avatar} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <span>{comment.user_name?.charAt(0) || "?"}</span>
                            )}
                        </div>
                        <div className="flex-1 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm transition-all group-hover:border-blue-200">
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-gray-900 text-sm">{comment.user_name}</span>
                                <span className="text-[10px] text-gray-400 font-bold uppercase">{new Date(comment.created_at).toLocaleDateString("vi-VN")}</span>
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed">{comment.content}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
