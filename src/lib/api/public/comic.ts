import { HomepageData, Comic, ComicChapter, ChapterDetail, PaginatedResponse, ComicCategory, ComicPage } from "@/types/comic";
import { serverFetch } from "@/lib/api/server-client";

export async function getComicHomepageData(): Promise<HomepageData | null> {
    const { data, error } = await serverFetch<HomepageData>("/public/homepage", {
        revalidate: 120,
    });
    if (error) {
        console.error("Error fetching comic homepage data:", error);
        return null;
    }
    return data;
}

export async function getComics(params: {
    page?: number;
    limit?: number;
    sort?: string;
    search?: string;
    comic_category_id?: string;
}): Promise<PaginatedResponse<Comic> | null> {
    const query = new URLSearchParams();
    if (params.page) query.append("page", params.page.toString());
    if (params.limit) query.append("limit", params.limit.toString());
    if (params.sort) query.append("sort", params.sort);
    if (params.search) query.append("search", params.search);
    if (params.comic_category_id) query.append("comic_category_id", params.comic_category_id);

    const { data, error } = await serverFetch<PaginatedResponse<Comic>>(`/public/comics?${query.toString()}`);
    if (error) return null;
    return data;
}

export async function getComicDetail(slug: string): Promise<Comic | null> {
    const { data, error } = await serverFetch<Comic>(`/public/comics/${slug}`);
    if (error) return null;
    return data;
}

export async function getComicChapters(slug: string, page: number = 1): Promise<PaginatedResponse<ComicChapter> | null> {
    const { data, error } = await serverFetch<PaginatedResponse<ComicChapter>>(`/public/comics/${slug}/chapters?page=${page}`);
    if (error) return null;
    return data;
}

export async function getChapterPages(chapterId: string): Promise<ComicPage[] | null> {
    const { data, error } = await serverFetch<ComicPage[]>(`/public/chapters/${chapterId}/pages`);
    if (error) return null;
    return data;
}

export async function getChapterNavigation(chapterId: string, direction: 'next' | 'prev'): Promise<{ id: string } | null> {
    const { data, error } = await serverFetch<{ id: string }>(`/public/chapters/${chapterId}/${direction}`);
    if (error) return null;
    return data;
}

export async function getComicCategories(): Promise<ComicCategory[]> {
    const { data, error } = await serverFetch<ComicCategory[]>("/public/comic-categories");
    if (error) return [];
    return data || [];
}

export async function trackView(chapterId: string): Promise<void> {
    await serverFetch(`/public/chapters/${chapterId}/view`, {
        method: 'POST',
    });
}

export async function getChapterDetail(chapterId: string): Promise<any | null> {
    const { data, error } = await serverFetch<any>(`/public/chapters/${chapterId}`);
    if (error) return null;
    return data;
}
