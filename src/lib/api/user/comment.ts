import { api } from "@/lib/api/client";
import { userEndpoints } from "@/lib/api/endpoints";
import { Comment } from "@/types/comic";

export const commentService = {
    /**
     * Post a comment to a comic
     */
    postComment: async (comicId: string | number, content: string): Promise<Comment> => {
        const response = await api.post<{ data: Comment }>(userEndpoints.comments.comic(comicId), { content });
        return response.data.data;
    },

    /**
     * Delete my comment
     */
    deleteComment: async (commentId: string | number): Promise<{ success: boolean }> => {
        const response = await api.delete<{ success: boolean }>(userEndpoints.comments.delete(commentId));
        return response.data;
    }
};
