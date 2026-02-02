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

// Admin Types
export interface AdminMeta {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
}

export interface AdminResponse<T> {
    data: T;
    meta?: AdminMeta;
}

export interface AdminComicCategory {
    id: number;
    name: string;
    slug: string;
    description: string;
    created_at?: string;
    updated_at?: string;
}

export interface AdminComic {
    id: number;
    title: string;
    slug: string;
    cover_image: string;
    author: string;
    status: 'draft' | 'published' | 'completed' | 'hidden';
    is_featured: boolean;
    view_count?: number;
    chapters_count?: number;
    categories: Array<{ id: number; name: string }>;
    description?: string;
    created_at: string;
    updated_at?: string;
}

export interface AdminChapterPage {
    id: number;
    chapter_id?: number;
    page_number: number;
    image_url: string;
    width: number;
    height: number;
    file_size?: number;
    created_at?: string;
}

export interface AdminChapter {
    id: number;
    comic_id: number;
    team_id?: number | null;
    chapter_index: number;
    title: string;
    chapter_label?: string;
    status: string;
    view_count?: number;
    created_user_id?: number;
    updated_user_id?: number;
    created_at: string;
    updated_at?: string;
    pages?: AdminChapterPage[];
    comic?: {
        id: number;
        title: string;
        slug: string;
        cover_image: string;
    };
    _count?: {
        pages: number;
    };
}

export interface ComicStatsOverview {
    total_comics: number;
    total_chapters: number;
    total_views: number;
    total_follows: number;
    new_comics_today: number;
    new_chapters_today: number;
}

export interface ComicTrendingData {
    date: string;
    views: number;
}

// Review Types
export interface ReviewUser {
    id: string;
    full_name: string;
    avatar?: string;
}

export interface ComicReview {
    id: string;
    comic_id: string;
    user_id: string;
    rating: number;
    content: string;
    created_at: string;
    updated_at: string;
    user: ReviewUser;
    comic?: AdminComic;
}

export interface ReviewStatistics {
    total: number;
    today: number;
    this_week: number;
    this_month: number;
    average_rating: number;
    rating_distribution: Array<{
        rating: number;
        count: number;
    }>;
}

export interface ReviewQueryParams {
    comic_id?: string;
    user_id?: string;
    rating?: number;
    rating_min?: number;
    rating_max?: number;
    search?: string;
    date_from?: string;
    date_to?: string;
    page?: number;
    limit?: number;
    sort?: string;
}

// Analytics Types
export interface AdminDashboardAnalytics {
    total_comics: number;
    total_views: number;
    total_follows: number;
    top_comics: Array<{
        comic: AdminComic;
        stats: {
            view_count: number;
            follow_count: number;
            rating_count: number;
            rating_sum: number;
        };
    }>;
}

export interface AdminAnalyticsComicStat {
    comic: AdminComic;
    stats: {
        view_count: number;
        follow_count: number;
        rating_count: number;
        rating_sum: number;
    };
}

export interface AdminViewHistoryItem {
    date: string;
    count: number;
}
