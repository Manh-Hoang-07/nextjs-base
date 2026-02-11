
"use client";

import React, { useState } from 'react';
import { Product } from '@/types/product';

interface ProductTabsProps {
    product: Product;
}

export const ProductTabs: React.FC<ProductTabsProps> = ({ product }) => {
    const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description');

    return (
        <div className="mt-16 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Tab Headers */}
            <div className="flex border-b border-gray-100 overflow-x-auto">
                {['description', 'specs', 'reviews'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`flex-1 px-8 py-5 text-center font-bold text-sm uppercase tracking-wider min-w-max transition-colors ${activeTab === tab
                            ? 'bg-white text-black border-b-2 border-black'
                            : 'bg-gray-50 text-gray-500 hover:text-black hover:bg-gray-100 border-b-2 border-transparent'
                            }`}
                    >
                        {tab === 'specs' ? 'Specifications' : tab}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="p-8 lg:p-12">
                {activeTab === 'description' && (
                    <div className="prose prose-lg max-w-none prose-img:rounded-xl">
                        {/* Using dangerouslySetInnerHTML for description HTML */}
                        <div dangerouslySetInnerHTML={{ __html: product.description || '<p>No description available.</p>' }} />
                    </div>
                )}

                {activeTab === 'specs' && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <tbody>
                                {(product.attributes && product.attributes.length > 0 ? (
                                    product.attributes.map((attr) => (
                                        <tr key={attr.id} className="border-b border-gray-100 last:border-0">
                                            <td className="py-4 px-6 font-semibold text-gray-900 bg-gray-50 w-1/3 rounded-l-lg">{attr.name}</td>
                                            <td className="py-4 px-6 text-gray-600 rounded-r-lg">
                                                {attr.options.map(opt => opt.name).join(', ')}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    [
                                        { label: 'Condition', value: 'New' },
                                        { label: 'Stock Status', value: product.stock_status === 'in_stock' ? 'In Stock' : 'Out of Stock' },
                                        { label: 'Category', value: 'General' },
                                    ].map((row, idx) => (
                                        <tr key={idx} className="border-b border-gray-100 last:border-0">
                                            <td className="py-4 px-6 font-semibold text-gray-900 bg-gray-50 w-1/3 rounded-l-lg">{row.label}</td>
                                            <td className="py-4 px-6 text-gray-600 rounded-r-lg">{row.value}</td>
                                        </tr>
                                    ))
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'reviews' && (
                    <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
                        <div className="text-6xl mb-4">💬</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No Reviews Yet</h3>
                        <p>Be the first to review this product!</p>
                        <button className="mt-6 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                            Write a Review
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
