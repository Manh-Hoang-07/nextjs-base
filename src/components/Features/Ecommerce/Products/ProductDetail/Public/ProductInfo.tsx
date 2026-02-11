
"use client";

import React, { useState, useEffect } from 'react';
import { Product, ProductVariant, ProductAttribute } from '@/types/product';
import { Star, Heart, Share2, Minus, Plus, ShoppingCart, Check } from 'lucide-react';

interface ProductInfoProps {
    product: Product;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
    const [quantity, setQuantity] = useState(1);
    const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

    // Initialize attributes if only one option exists
    useEffect(() => {
        if (product.attributes) {
            const initialAttrs: Record<string, string> = {};
            product.attributes.forEach(attr => {
                if (attr.options.length === 1) {
                    initialAttrs[attr.slug] = attr.options[0].value;
                }
            });
            setSelectedAttributes(prev => ({ ...prev, ...initialAttrs }));
        }
    }, [product.attributes]);

    // Find matching variant
    useEffect(() => {
        if (!product.variants || product.variants.length === 0) return;

        // Logic to find variant based on selected attributes
        // This depends on how backend returns variants. 
        // Assuming variant has a combination of attribute_id and option_id or similar.
        // For now, simple mock logic or placeholder:
        // const match = product.variants.find(v => ...);
        // setSelectedVariant(match || null);
    }, [selectedAttributes, product.variants]);

    const handleAttributeSelect = (slug: string, value: string) => {
        setSelectedAttributes(prev => ({ ...prev, [slug]: value }));
    };

    const handleQuantityChange = (delta: number) => {
        setQuantity(prev => Math.max(1, prev + delta));
    };

    const isOutOfStock = product.stock_status === 'out_of_stock';

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                        {product.is_new ? 'Hàng mới về' : 'Bán chạy nhất'}
                    </span>
                    {product.stock_status === 'in_stock' ? (
                        <span className="text-sm font-medium text-green-600 flex items-center gap-1 bg-green-50 px-2.5 py-0.5 rounded-full">
                            <Check size={14} /> Còn hàng
                        </span>
                    ) : (
                        <span className="text-sm font-medium text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full">
                            Hết hàng
                        </span>
                    )}
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                    {product.name}
                </h1>

                <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-1">
                        <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    size={18}
                                    fill={i < Math.round(product.average_rating || 0) ? "currentColor" : "none"}
                                    className={i < Math.round(product.average_rating || 0) ? "" : "text-gray-200"}
                                />
                            ))}
                        </div>
                        <span className="text-sm font-medium text-gray-500 underline decoration-gray-300 underline-offset-4 cursor-pointer hover:text-black">
                            {product.review_count || 0} đánh giá
                        </span>
                    </div>
                    <div className="w-px h-4 bg-gray-300" />
                    <span className="text-sm text-gray-500">SKU: {selectedVariant?.sku || product.id}</span>
                </div>

                <div className="flex items-end gap-3 mb-6">
                    {(() => {
                        const rootPrice = Number(product.price) || 0;
                        const rootSalePrice = Number(product.sale_price) || 0;
                        const variantPrice = (product.variants && product.variants.length > 0) ? Number(product.variants[0].price) : 0;
                        const variantSalePrice = (product.variants && product.variants.length > 0) ? Number(product.variants[0].sale_price) : 0;

                        const finalPrice = rootPrice || variantPrice;
                        const finalSalePrice = rootSalePrice || variantSalePrice;
                        const finalMaxPrice = Number(product.max_price) || 0;

                        if (finalSalePrice > 0) {
                            return (
                                <>
                                    <span className="text-4xl font-bold text-red-600">
                                        {finalSalePrice.toLocaleString('vi-VN')}đ
                                    </span>
                                    <span className="text-xl text-gray-400 line-through mb-1">
                                        {finalMaxPrice > finalPrice
                                            ? `${finalPrice.toLocaleString('vi-VN')} - ${finalMaxPrice.toLocaleString('vi-VN')}`
                                            : finalPrice.toLocaleString('vi-VN')
                                        }đ
                                    </span>
                                    <span className="mb-2 bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-lg">
                                        Tiết kiệm {finalPrice ? Math.round(((finalPrice - finalSalePrice) / finalPrice) * 100) : 0}%
                                    </span>
                                </>
                            );
                        }

                        return (
                            <span className="text-4xl font-bold text-gray-900">
                                {finalMaxPrice > finalPrice
                                    ? `${finalPrice.toLocaleString('vi-VN')} - ${finalMaxPrice.toLocaleString('vi-VN')}đ`
                                    : `${(finalPrice || 0).toLocaleString('vi-VN')}đ`
                                }
                            </span>
                        );
                    })()}
                </div>

                <p className="text-gray-600 leading-relaxed">
                    {product.short_description || "Experience premium quality with our meticulously crafted product. Designed for durability and style, it's the perfect addition to your collection."}
                </p>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Variants */}
            {product.attributes?.map((attr) => (
                <div key={attr.id}>
                    <div className="flex justify-between items-center mb-3">
                        <span className="font-bold text-gray-900">{attr.name}</span>
                        <span className="text-sm text-gray-500">
                            Đã chọn: <span className="text-black font-medium">{selectedAttributes[attr.slug]}</span>
                        </span>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {attr.options.map((opt) => {
                            const isSelected = selectedAttributes[attr.slug] === opt.value;

                            if (attr.slug === 'color') {
                                return (
                                    <button
                                        key={opt.id}
                                        onClick={() => handleAttributeSelect(attr.slug, opt.value)}
                                        className={`w-10 h-10 rounded-full border-2 transition-all shadow-sm ${isSelected ? 'border-black ring-2 ring-offset-2 ring-black scale-110' : 'border-gray-200 hover:scale-110'
                                            }`}
                                        style={{ backgroundColor: opt.value }} // Assuming value is hex
                                        title={opt.name}
                                    />
                                );
                            }

                            return (
                                <button
                                    key={opt.id}
                                    onClick={() => handleAttributeSelect(attr.slug, opt.value)}
                                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${isSelected
                                        ? 'border-black bg-black text-white shadow-lg'
                                        : 'border-gray-200 bg-white text-gray-900 hover:border-black'
                                        }`}
                                >
                                    {opt.name}
                                </button>
                            );
                        })}
                    </div>
                </div>
            ))}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <div className="flex items-center border border-gray-200 rounded-xl w-fit">
                    <button
                        onClick={() => handleQuantityChange(-1)}
                        className="w-12 h-12 flex items-center justify-center hover:bg-gray-50 rounded-l-xl transition-colors"
                        disabled={quantity <= 1}
                    >
                        <Minus size={18} />
                    </button>
                    <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                    <button
                        onClick={() => handleQuantityChange(1)}
                        className="w-12 h-12 flex items-center justify-center hover:bg-gray-50 rounded-r-xl transition-colors"
                    >
                        <Plus size={18} />
                    </button>
                </div>

                <button
                    disabled={isOutOfStock}
                    className={`flex-1 flex items-center justify-center gap-2 bg-black text-white rounded-xl font-bold text-lg transition-transform hover:-translate-y-1 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none px-8 py-3`}
                >
                    <ShoppingCart size={20} />
                    Thêm vào giỏ hàng
                </button>

                <button className="w-12 h-12 flex items-center justify-center border border-gray-200 rounded-xl hover:border-red-500 hover:text-red-500 hover:bg-red-50 transition-colors">
                    <Heart size={20} />
                </button>
            </div>

            {/* Policy */}
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 pt-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <span>Miễn phí giao hàng</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    </div>
                    <span>Đổi trả trong 30 ngày</span>
                </div>
            </div>
        </div>
    );
};
