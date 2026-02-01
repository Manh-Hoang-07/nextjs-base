export interface ComicCategory {
    id: string;
    name: string;
    slug: string;
    description?: string;
}

export interface ComicChapter {
    id: string;
    title: string;
    chapter_index: number;
    chapter_label: string;
    created_at: string;
}

export interface ComicStats {
    view_count: string;
    follow_count: string;
    rating_count: string;
    rating_sum: string;
}

export interface Comic {
    id: string;
    title: string;
    slug: string;
    description: string;
    cover_image: string;
    author: string;
    status: 'draft' | 'published' | 'completed' | 'hidden';
    last_chapter_updated_at: string;
    categories: ComicCategory[];
    last_chapter: ComicChapter | null;
    stats: ComicStats;
}

export interface ComicPage {
    page_number: number;
    image_url: string;
}

export interface ChapterDetail extends ComicChapter {
    pages: ComicPage[];
    next_chapter_id: string | null;
    prev_chapter_id: string | null;
}

export interface Comment {
    id: string;
    content: string;
    user_name: string;
    user_avatar?: string;
    created_at: string;
    replies?: Comment[];
}

export interface HomepageData {
    top_viewed_comics: Comic[];
    trending_comics: Comic[];
    popular_comics: Comic[];
    newest_comics: Comic[];
    recent_update_comics: Comic[];
    comic_categories: ComicCategory[];
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        page: number;
        limit: number;
        totalItems: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
}
