import React from 'react';
import Link from 'next/link';
import { Comic } from '@/types/comic';

interface TrendingHeroProps {
    comics: Comic[];
}

export const TrendingHero: React.FC<TrendingHeroProps> = ({ comics }) => {
    if (!comics || comics.length === 0) return null;

    const mainFeature = comics[0];
    const subFeatures = comics.slice(1, 4);

    return (
        <div className="mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[500px]">
                {/* Main large feature */}
                <div className="lg:col-span-3 relative rounded-2xl overflow-hidden group">
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                        style={{ backgroundImage: `url(${mainFeature.cover_image})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-8 text-white w-full">
                        <div className="flex gap-2 mb-3">
                            {mainFeature.categories.slice(0, 3).map(cat => (
                                <span key={cat.id} className="px-3 py-1 bg-red-600/80 backdrop-blur-md rounded-full text-xs font-bold uppercase">
                                    {cat.name}
                                </span>
                            ))}
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-black mb-4 group-hover:text-red-500 transition-colors">
                            {mainFeature.title}
                        </h1>
                        <p className="text-gray-300 line-clamp-2 max-w-2xl text-lg mb-6">
                            {mainFeature.description}
                        </p>
                        <div className="flex gap-4">
                            <Link
                                href={`/home/comics/${mainFeature.slug}`}
                                className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold transition-all transform hover:scale-105"
                            >
                                Đọc Ngay
                            </Link>
                            <button className="px-8 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-full font-bold transition-all border border-white/20">
                                Chi tiết
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sub features column */}
                <div className="hidden lg:flex flex-col gap-4">
                    {subFeatures.map((comic) => (
                        <Link
                            key={comic.id}
                            href={`/home/comics/${comic.slug}`}
                            className="relative flex-1 rounded-xl overflow-hidden group"
                        >
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                                style={{ backgroundImage: `url(${comic.cover_image})` }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                            <div className="absolute bottom-0 left-0 p-4 text-white w-full">
                                <h3 className="font-bold text-sm line-clamp-2 group-hover:text-red-400 transition-colors">
                                    {comic.title}
                                </h3>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};
