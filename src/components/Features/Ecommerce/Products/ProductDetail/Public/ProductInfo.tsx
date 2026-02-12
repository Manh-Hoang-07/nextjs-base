
"use client";

import React, { useState, useEffect } from 'react';
import { Product, ProductVariant, ProductAttribute } from '@/types/product';
import { Star, Heart, Share2, Minus, Plus, ShoppingCart, Check, Package } from 'lucide-react';

interface ProductInfoProps {
    product: Product;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
    const [quantity, setQuantity] = useState(1);
    const [selectedVariantId, setSelectedVariantId] = useState<number | string | null>(null);
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

    // Initialize with first variant if product is variable
    useEffect(() => {
        if (product.variants && product.variants.length > 0) {
            const firstVariant = product.variants[0];
            setSelectedVariantId(firstVariant.id);
            setSelectedVariant(firstVariant);
        }
    }, [product.variants]);

    const handleVariantSelect = (variantId: number | string) => {
        const variant = product.variants?.find(v => v.id === variantId);
        if (variant) {
            setSelectedVariantId(variantId);
            setSelectedVariant(variant);
        }
    };

    const handleQuantityChange = (delta: number) => {
        setQuantity(prev => Math.max(1, prev + delta));
    };

    // Calculate current price based on selected variant or product
    const getCurrentPrice = () => {
        if (selectedVariant) {
            return {
                price: Number(selectedVariant.price) || 0,
                salePrice: selectedVariant.sale_price ? Number(selectedVariant.sale_price) : 0,
            };
        }
        return {
            price: Number(product.price) || 0,
            salePrice: product.sale_price ? Number(product.sale_price) : 0,
        };
    };

    const { price, salePrice } = getCurrentPrice();
    const displayPrice = salePrice > 0 ? salePrice : price;
    const hasDiscount = salePrice > 0 && salePrice < price;

    const stockQuantity = selectedVariant?.stock_quantity ?? 0;
    const isOutOfStock = stockQuantity === 0 || product.stock_status === 'out_of_stock';

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                        {product.is_new ? 'Hàng mới về' : 'Bán chạy nhất'}
                    </span>
                    {!isOutOfStock ? (
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
                </div>

                <div className="flex items-end gap-3 mb-6">
                    {hasDiscount ? (
                        <>
                            <span className="text-4xl font-bold text-red-600">
                                {displayPrice.toLocaleString('vi-VN')}đ
                            </span>
                            <span className="text-xl text-gray-400 line-through mb-1">
                                {price.toLocaleString('vi-VN')}đ
                            </span>
                            <span className="mb-2 bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-lg">
                                Tiết kiệm {Math.round(((price - salePrice) / price) * 100)}%
                            </span>
                        </>
                    ) : (
                        <span className="text-4xl font-bold text-gray-900">
                            {displayPrice.toLocaleString('vi-VN')}đ
                        </span>
                    )}
                </div>

                <p className="text-gray-600 leading-relaxed">
                    {product.short_description || "Experience premium quality with our meticulously crafted product. Designed for durability and style, it's the perfect addition to your collection."}
                </p>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Variants Selection */}
            {product.variants && product.variants.length > 0 && (
                <div>
                    <div className="flex justify-between items-center mb-3">
                        <span className="font-bold text-gray-900">Chọn phiên bản</span>
                        {selectedVariant && (
                            <span className="text-sm text-gray-500 flex items-center gap-1">
                                <Package size={14} />
                                Còn lại: <span className="text-black font-medium">{stockQuantity}</span>
                            </span>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        {product.variants.map((variant) => {
                            const isSelected = selectedVariantId === variant.id;
                            const variantPrice = Number(variant.price) || 0;
                            const variantSalePrice = variant.sale_price ? Number(variant.sale_price) : 0;
                            const variantDisplayPrice = variantSalePrice > 0 ? variantSalePrice : variantPrice;
                            const variantStock = variant.stock_quantity ?? 0;
                            const isVariantOutOfStock = variantStock === 0;

                            return (
                                <button
                                    key={variant.id}
                                    onClick={() => !isVariantOutOfStock && handleVariantSelect(variant.id)}
                                    disabled={isVariantOutOfStock}
                                    className={`p-4 rounded-xl border-2 text-left transition-all ${isSelected
                                        ? 'border-black bg-black text-white shadow-lg'
                                        : isVariantOutOfStock
                                            ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed opacity-60'
                                            : 'border-gray-200 bg-white text-gray-900 hover:border-black hover:shadow-md'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex-1">
                                            <div className="font-bold text-sm">{variant.name}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-lg">
                                                {variantDisplayPrice.toLocaleString('vi-VN')}đ
                                            </div>
                                            {variantSalePrice > 0 && variantSalePrice < variantPrice && (
                                                <div className={`text-xs line-through ${isSelected ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    {variantPrice.toLocaleString('vi-VN')}đ
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        {isVariantOutOfStock ? (
                                            <span className="text-xs font-medium text-red-500">Hết hàng</span>
                                        ) : (
                                            <span className={`text-xs ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>
                                                Còn {variantStock} sản phẩm
                                            </span>
                                        )}
                                        {isSelected && (
                                            <Check size={16} className="text-white" />
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Attributes (if available) */}
            {product.attributes?.map((attr) => (
                <div key={attr.id}>
                    <div className="flex justify-between items-center mb-3">
                        <span className="font-bold text-gray-900">{attr.name}</span>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {attr.options.map((opt) => {
                            if (attr.slug === 'color') {
                                return (
                                    <button
                                        key={opt.id}
                                        className="w-10 h-10 rounded-full border-2 border-gray-200 hover:scale-110 transition-all shadow-sm"
                                        style={{ backgroundColor: opt.value }}
                                        title={opt.name}
                                    />
                                );
                            }

                            return (
                                <button
                                    key={opt.id}
                                    className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 hover:border-black text-sm font-medium transition-all"
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
                    {isOutOfStock ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
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
