
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

    // State for price range slider (dual handles)
    const [minPrice, setMinPrice] = useState(Number(searchParams.get('min_price')) || 0);
    const [maxPrice, setMaxPrice] = useState(Number(searchParams.get('max_price')) || 10000000);

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
        params.set('min_price', minPrice.toString());
        params.set('max_price', maxPrice.toString());
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
                <h3 className="font-bold text-gray-900 mb-2 text-lg">Khoảng giá</h3>
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Từ</span>
                            <span className="text-sm font-bold text-black">{minPrice.toLocaleString('vi-VN')}đ</span>
                        </div>
                        <div className="flex flex-col text-right">
                            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Đến</span>
                            <span className="text-sm font-bold text-black">{maxPrice.toLocaleString('vi-VN')}đ</span>
                        </div>
                    </div>

                    <div className="relative h-2 flex items-center mb-4">
                        <div className="absolute w-full h-1.5 bg-gray-100 rounded-full" />
                        <div
                            className="absolute h-1.5 bg-primary rounded-full z-10"
                            style={{
                                left: `${(minPrice / 10000000) * 100}%`,
                                right: `${100 - (maxPrice / 10000000) * 100}%`
                            }}
                        />

                        <input
                            type="range"
                            min="0"
                            max="10000000"
                            step="100000"
                            value={minPrice}
                            onChange={(e) => {
                                const val = Math.min(Number(e.target.value), maxPrice - 100000);
                                setMinPrice(val);
                            }}
                            className="absolute w-full appearance-none bg-transparent pointer-events-none z-20 h-1.5 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-black [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-black [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md"
                        />

                        <input
                            type="range"
                            min="0"
                            max="10000000"
                            step="100000"
                            value={maxPrice}
                            onChange={(e) => {
                                const val = Math.max(Number(e.target.value), minPrice + 100000);
                                setMaxPrice(val);
                            }}
                            className="absolute w-full appearance-none bg-transparent pointer-events-none z-20 h-1.5 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-black [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-black [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md"
                        />
                    </div>

                    <div className="flex justify-between mt-2">
                        <span className="text-[10px] text-gray-400">0đ</span>
                        <span className="text-[10px] text-gray-400">10trđ</span>
                    </div>
                </div>
                <button
                    onClick={applyPriceFilter}
                    data-pagination
                    className="w-full py-3 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 active:scale-[0.98] transition-all shadow-sm"
                >
                    Áp dụng
                </button>
            </div>
        </div>

    );
};
