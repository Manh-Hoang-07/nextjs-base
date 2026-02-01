import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Comic } from '@/types/comic';

interface ComicCardProps {
    comic: Comic;
}

export const ComicCard: React.FC<ComicCardProps> = ({ comic }) => {
    return (
        <Link href={`/home/comics/${comic.slug}`} className="comic-card">
            <div className="comic-card__image-container">
                <Image
                    src={comic.cover_image || 'https://via.placeholder.com/300x450?text=No+Cover'}
                    alt={comic.title}
                    fill
                    className="comic-card__image"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                />
                <div className="comic-card__overlay" />
                {comic.status === 'completed' && (
                    <div className="comic-card__badge">FULL</div>
                )}
                <div className="comic-card__stats">
                    <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                        {parseInt(comic.stats.view_count).toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                        </svg>
                        {parseInt(comic.stats.follow_count).toLocaleString()}
                    </span>
                </div>
            </div>
            <div className="comic-card__content">
                <h3 className="comic-card__title" title={comic.title}>{comic.title}</h3>
                {comic.last_chapter && (
                    <div className="comic-card__chapter">
                        {comic.last_chapter.chapter_label}
                    </div>
                )}
            </div>
        </Link>
    );
};
