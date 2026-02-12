
"use client";

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SelectFilter from '@/components/UI/Filters/SelectFilter';

interface ProductFilterProps {
    categories?: { id: number; name: string; slug: string; products_count?: number }[];
}

export const ProductFilter: React.FC<ProductFilterProps> = ({ categories = [] }) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    // States for inputs
    const [minPrice, setMinPrice] = useState(searchParams.get('min_price') || '');
    const [maxPrice, setMaxPrice] = useState(searchParams.get('max_price') || '');

    const handleFilterChange = (key: string, value: string | number | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value.toString());
        } else {
            params.delete(key);
        }
        params.set('page', '1');
        router.push(`?${params.toString()}`);
    };

    const applyPriceFilter = () => {
        const params = new URLSearchParams(searchParams.toString());
        if (minPrice) params.set('min_price', minPrice);
        else params.delete('min_price');

        if (maxPrice) params.set('max_price', maxPrice);
        else params.delete('max_price');

        params.set('page', '1');
        router.push(`?${params.toString()}`);
    };

    const categoryOptions = categories.map(cat => ({
        value: cat.slug,
        label: `${cat.name}${cat.products_count !== undefined ? ` (${cat.products_count})` : ''}`
    }));

    return (
        <div className="space-y-8">

            {/* Categories - Using existing SelectFilter component */}
            <div className="border-b border-gray-100 pb-6">
                <h3 className="font-bold text-gray-900 mb-4 text-lg">Danh mục</h3>
                <div className="product-category-select" data-pagination>
                    <SelectFilter
                        value={searchParams.get('category') || ''}
                        options={categoryOptions}
                        placeholder="Tất cả danh mục"
                        onChange={(value) => handleFilterChange('category', value)}
                    />
                </div>
            </div>

            {/* Price Range */}
            <div className="pb-2">
                <h3 className="font-bold text-gray-900 mb-4 text-lg">Khoảng giá</h3>
                <div className="flex items-center gap-2 mb-4">
                    <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₫</span>
                        <input
                            type="number"
                            placeholder="Min"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            className="w-full pl-7 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black focus:ring-2 focus:ring-black/5 transition-all"
                        />
                    </div>
                    <span className="text-gray-400 text-lg">−</span>
                    <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₫</span>
                        <input
                            type="number"
                            placeholder="Max"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="w-full pl-7 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black focus:ring-2 focus:ring-black/5 transition-all"
                        />
                    </div>
                </div>
                <button
                    onClick={applyPriceFilter}
                    data-pagination
                    className="w-full py-3 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 active:scale-[0.98] transition-all shadow-sm shadow-black/10"
                >
                    Áp dụng
                </button>
            </div>
        </div>

    );
};
