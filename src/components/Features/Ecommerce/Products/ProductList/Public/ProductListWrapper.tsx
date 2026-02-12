
"use client";

import React, { useState } from 'react';
import { ProductCard } from '../../Shared/ProductCard';
import { ProductFilter } from './ProductFilter';
import { Pagination } from '@/components/UI/Navigation/Pagination';
import { Product, PaginatedProductResponse } from '@/types/product';
import { Grid, List, ChevronDown } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ContentWrapper } from '@/components/UI/Loading/ContentWrapper';

interface ProductListWrapperProps {
    initialData: PaginatedProductResponse | null;
    categories?: any[];
}

export const ProductListWrapper: React.FC<ProductListWrapperProps> = ({ initialData, categories = [] }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // Sort implementation would require URL manipulation similar to filters

    if (!initialData) return <div className="text-center py-20">No products found.</div>;

    const { data: products, meta } = initialData;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar */}
                <aside className="w-full lg:w-1/4 shrink-0">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 sticky top-24">
                        <ProductFilter categories={categories} />
                    </div>
                </aside>

                {/* Main Content */}
                <ContentWrapper>
                    <main className="flex-1">
                        {/* Toolbar */}
                        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                            <div className="text-gray-600 font-medium">
                                Hiển thị <span className="text-black font-bold">{products.length}</span> trên tổng số <span className="text-black font-bold">{meta.totalItems}</span> kết quả
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="relative group" data-pagination>
                                    <select
                                        className="appearance-none flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:border-black transition-colors bg-white text-sm font-medium pr-8 cursor-pointer focus:outline-none focus:ring-1 focus:ring-black"
                                        value={searchParams.get('sort') || ''}
                                        onChange={(e) => {
                                            const params = new URLSearchParams(searchParams.toString());
                                            if (e.target.value) params.set('sort', e.target.value);
                                            else params.delete('sort');
                                            params.set('page', '1');
                                            router.push(`?${params.toString()}`);
                                        }}
                                    >
                                        <option value="">Sắp xếp: Mặc định</option>
                                        <option value="created_at:desc">Mới nhất</option>
                                        <option value="price:asc">Giá: Thấp đến Cao</option>
                                        <option value="price:desc">Giá: Cao đến Thấp</option>
                                        <option value="view_count:desc">Phổ biến nhất</option>
                                    </select>
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                        <ChevronDown size={16} />
                                    </div>
                                </div>

                                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden p-1 gap-1">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 rounded md:bg-transparent ${viewMode === 'grid' ? 'bg-gray-100 text-black' : 'text-gray-400 hover:text-black'}`}
                                    >
                                        <Grid size={20} />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 rounded ${viewMode === 'list' ? 'bg-gray-100 text-black' : 'text-gray-400 hover:text-black'}`}
                                    >
                                        <List size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Grid */}
                        <div className={`grid gap-6 ${viewMode === 'grid'
                            ? 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4'
                            : 'grid-cols-1'
                            }`}>
                            {products.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        {/* Pagination */}
                        <Pagination
                            currentPage={meta.page}
                            totalPages={meta.totalPages}
                            hasNextPage={meta.hasNextPage}
                            hasPreviousPage={meta.hasPreviousPage}
                        />
                    </main>
                </ContentWrapper>
            </div>
        </div>
    );
};

