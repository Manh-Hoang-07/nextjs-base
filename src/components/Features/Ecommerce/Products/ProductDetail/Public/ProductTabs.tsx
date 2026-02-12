
"use client";

import React from 'react';
import { Product } from '@/types/product';

interface ProductTabsProps {
    product: Product;
}

export const ProductTabs: React.FC<ProductTabsProps> = ({ product }) => {
    return (
        <div className="mt-16 space-y-8">
            {/* Description Section */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-gray-50 to-white px-8 py-6 border-b border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900">Mô tả sản phẩm</h2>
                </div>
                <div className="p-8 lg:p-12">
                    <div className="prose prose-lg max-w-none prose-img:rounded-xl">
                        <div dangerouslySetInnerHTML={{ __html: product.description || '<p>Chưa có mô tả cho sản phẩm này.</p>' }} />
                    </div>
                </div>
            </div>

            {/* Specifications Section */}
            {product.attributes && product.attributes.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-r from-gray-50 to-white px-8 py-6 border-b border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900">Thông số kỹ thuật</h2>
                    </div>
                    <div className="p-8 lg:p-12">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <tbody>
                                    {product.attributes.map((attr) => (
                                        <tr key={attr.id} className="border-b border-gray-100 last:border-0">
                                            <td className="py-4 px-6 font-semibold text-gray-900 bg-gray-50 w-1/3 rounded-l-lg">{attr.name}</td>
                                            <td className="py-4 px-6 text-gray-600 rounded-r-lg">
                                                {attr.options.map(opt => opt.name).join(', ')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Reviews Section */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-gray-50 to-white px-8 py-6 border-b border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900">Đánh giá sản phẩm</h2>
                </div>
                <div className="p-8 lg:p-12">
                    <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
                        <div className="text-6xl mb-4">💬</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Chưa có đánh giá</h3>
                        <p>Hãy là người đầu tiên đánh giá sản phẩm này!</p>
                        <button className="mt-6 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                            Viết đánh giá
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
