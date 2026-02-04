import React from 'react';
import Link from 'next/link';
import { ComicCategory } from '@/types/comic';

interface CategorySidebarProps {
    categories: ComicCategory[];
}

export const CategorySidebar: React.FC<CategorySidebarProps> = ({ categories }) => {
    return (
        <div className="category-sidebar">
            <h3 className="text-xl font-extrabold mb-6 border-b pb-2 text-gray-800 uppercase tracking-tighter">
                Thá»ƒ loáº¡i
            </h3>
            <div className="grid grid-cols-2 gap-x-2">
                {categories.map((category) => (
                    <Link
                        key={category.id}
                        href={`/home/categories/${category.slug}`}
                        className="category-item text-sm"
                    >
                        {category.name}
                    </Link>
                ))}
            </div>
        </div>
    );
};

