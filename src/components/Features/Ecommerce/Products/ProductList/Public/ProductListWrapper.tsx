
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

    const products = initialData?.data || [];
    const meta = initialData?.meta;

    return (
        <div className="w-full px-4 md:px-10 py-8">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Sidebar */}
                <aside className="w-full lg:w-[320px] shrink-0">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 sticky top-24">
                        <ProductFilter categories={categories} />
                    </div>
                </aside>

                {/* Main Content */}
                <ContentWrapper className="flex-1 w-full">
                    <main>
                        {/* Toolbar */}
                        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                            <div className="text-gray-600 font-medium">
                                Hiển thị <span className="text-black font-bold">{products.length}</span> {meta ? <>trên tổng số <span className="text-black font-bold">{meta.totalItems}</span></> : ''} kết quả
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="relative group" data-pagination>
                                    <select
                                        className="appearance-none flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:border-primary transition-colors bg-white text-sm font-medium pr-8 cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
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
                                        className={`p-2 rounded md:bg-transparent ${viewMode === 'grid' ? 'bg-gray-100 text-primary' : 'text-gray-400 hover:text-primary'}`}
                                    >
                                        <Grid size={20} />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 rounded ${viewMode === 'list' ? 'bg-gray-100 text-primary' : 'text-gray-400 hover:text-primary'}`}
                                    >
                                        <List size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {products.length > 0 ? (
                            <>
                                {/* Grid */}
                                <div className={`grid gap-6 ${viewMode === 'grid'
                                    ? 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6'
                                    : 'grid-cols-1'
                                    }`}>
                                    {products.map(product => (
                                        <ProductCard key={product.id} product={product} isList={viewMode === 'list'} />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {meta && (
                                    <div className="mt-10">
                                        <Pagination
                                            currentPage={meta.page}
                                            totalPages={meta.totalPages}
                                            hasNextPage={meta.hasNextPage}
                                            hasPreviousPage={meta.hasPreviousPage}
                                        />
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="bg-white rounded-2xl border border-gray-100 py-20 px-4 text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-full mb-4 text-gray-400">
                                    <Grid size={32} />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Không tìm thấy sản phẩm</h3>
                                <p className="text-gray-500 max-w-xs mx-auto">
                                    Rất tiếc, chúng tôi không tìm thấy sản phẩm nào khớp với bộ lọc của bạn. Thử thay đổi điều kiện lọc nhé!
                                </p>
                            </div>
                        )}
                    </main>
                </ContentWrapper>
            </div>
        </div>
    );
};
