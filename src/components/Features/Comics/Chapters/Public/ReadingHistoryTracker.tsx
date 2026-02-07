"use client";

import { useEffect } from "react";
import { userComicService } from "@/lib/api/user/comic";
import { useAuthStore } from "@/lib/store/authStore";

interface ReadingHistoryTrackerProps {
    comicId: string | number;
    chapterId: string | number;
}

export function ReadingHistoryTracker({ comicId, chapterId }: ReadingHistoryTrackerProps) {
    const { isAuthenticated } = useAuthStore();

    useEffect(() => {
        if (isAuthenticated && comicId && chapterId) {
            userComicService.updateReadingHistory({ comic_id: comicId, chapter_id: chapterId })
                .catch(err => console.error("Failed to update reading history:", err));
        }
    }, [isAuthenticated, comicId, chapterId]);

    return null;
}
