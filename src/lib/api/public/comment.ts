import { Comment, PaginatedResponse } from "@/types/comic";
import { serverFetch } from "@/lib/api/server-client";

export async function getComicComments(comicId: string, page: number = 1): Promise<PaginatedResponse<Comment> | null> {
    const { data, meta: responseMeta, error } = await serverFetch<Comment[]>(
        `/public/comic-comments/comics/${comicId}?page=${page}`
    );

    if (error || !data) return null;

    const items = Array.isArray(data) ? data : [];
    const meta = responseMeta || {
        page: page,
        limit: 20,
        totalItems: items.length,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
    };

    return { data: items, meta };
}

export async function getChapterComments(chapterId: string, page: number = 1): Promise<PaginatedResponse<Comment> | null> {
    const { data, meta: responseMeta, error } = await serverFetch<Comment[]>(
        `/public/comic-comments/chapters/${chapterId}?page=${page}`
    );

    if (error || !data) return null;

    const items = Array.isArray(data) ? data : [];
    const meta = responseMeta || {
        page: page,
        limit: 20,
        totalItems: items.length,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
    };

    return { data: items, meta };
}
