
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Eye, Heart, Star } from 'lucide-react';
import { Product } from '@/types/product';

interface ProductCardProps {
    product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const discountPercentage = product.sale_price && product.price
        ? Math.round(((product.price - product.sale_price) / product.price) * 100)
        : 0;

    return (
        <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            {/* Image Section */}
            <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden">
                <Link href={`/products/${product.slug}`}>
                    <Image
                        src={product.image || '/placeholder-product.jpg'}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                    />
                </Link>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.is_new && (
                        <span className="bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                            MỚI
                        </span>
                    )}
                    {discountPercentage > 0 && (
                        <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                            -{discountPercentage}%
                        </span>
                    )}
                </div>

                {/* Hover Actions */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">
                    <button
                        className="w-10 h-10 rounded-full bg-white text-gray-700 hover:bg-black hover:text-white shadow-lg flex items-center justify-center transition-colors"
                        title="Thêm vào giỏ"
                    >
                        <ShoppingCart size={18} />
                    </button>
                    <button
                        className="w-10 h-10 rounded-full bg-white text-gray-700 hover:bg-red-500 hover:text-white shadow-lg flex items-center justify-center transition-colors"
                        title="Yêu thích"
                    >
                        <Heart size={18} />
                    </button>
                </div>

                {/* Overlay on hover for better text contrast/focus */}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>

            {/* Info Section */}
            <div className="p-4">
                {product.category_id && (
                    <div className="text-xs text-gray-400 mb-1">
                        Danh mục
                    </div>
                )}
                <h3 className="font-semibold text-gray-800 leading-snug line-clamp-2 h-10 mb-2 group-hover:text-red-500 transition-colors">
                    <Link href={`/products/${product.slug}`}>
                        {product.name}
                    </Link>
                </h3>

                <div className="flex items-center gap-1 mb-2">
                    <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                size={14}
                                fill={i < Math.round(product.average_rating || 0) ? "currentColor" : "none"}
                                className={i < Math.round(product.average_rating || 0) ? "" : "text-gray-300"}
                            />
                        ))}
                    </div>
                    <span className="text-xs text-gray-400">({product.review_count || 0})</span>
                </div>

                <div className="flex items-center gap-2">
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
                                    <span className="font-bold text-red-600 text-lg">
                                        {finalSalePrice.toLocaleString('vi-VN')}đ
                                    </span>
                                    <span className="text-sm text-gray-400 line-through">
                                        {finalMaxPrice > finalPrice
                                            ? `${finalPrice.toLocaleString('vi-VN')} - ${finalMaxPrice.toLocaleString('vi-VN')}`
                                            : finalPrice.toLocaleString('vi-VN')
                                        }đ
                                    </span>
                                </>
                            );
                        }

                        return (
                            <span className="font-bold text-gray-900 text-lg">
                                {finalMaxPrice > finalPrice
                                    ? `${finalPrice.toLocaleString('vi-VN')} - ${finalMaxPrice.toLocaleString('vi-VN')}đ`
                                    : `${(finalPrice || 0).toLocaleString('vi-VN')}đ`
                                }
                            </span>
                        );
                    })()}
                </div>
            </div>
        </div>
    );
};
