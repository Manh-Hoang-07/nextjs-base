
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Eye, Heart, Star } from 'lucide-react';
import { Product } from '@/types/product';

interface ProductCardProps {
    product: Product;
    isList?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, isList = false }) => {
    const discountPercentage = product.sale_price && product.price
        ? Math.round(((product.price - product.sale_price) / product.price) * 100)
        : 0;

    const rootPrice = Number(product.price) || 0;
    const rootSalePrice = Number(product.sale_price) || 0;
    const variantPrice = (product.variants && product.variants.length > 0) ? Number(product.variants[0].price) : 0;
    const variantSalePrice = (product.variants && product.variants.length > 0) ? Number(product.variants[0].sale_price) : 0;

    const finalPrice = rootPrice || variantPrice;
    const finalSalePrice = rootSalePrice || variantSalePrice;

    return (
        <div className={`group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${isList ? 'flex flex-row h-auto md:h-64' : 'flex flex-col'}`}>
            {/* Image Section */}
            <div className={`relative bg-gray-50 overflow-hidden shrink-0 ${isList ? 'w-1/3 md:w-64 aspect-square' : 'aspect-[3/4]'}`}>
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
                        <span className="bg-green-500 text-white text-[10px] md:text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                            MỚI
                        </span>
                    )}
                    {discountPercentage > 0 && (
                        <span className="bg-red-500 text-white text-[10px] md:text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                            -{discountPercentage}%
                        </span>
                    )}
                </div>

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>

            {/* Info Section */}
            <div className={`p-4 flex flex-col justify-between flex-1 ${isList ? 'md:p-6' : ''}`}>
                <div>
                    {product.category_id && (
                        <div className="text-xs text-gray-400 mb-1">
                            Danh mục
                        </div>
                    )}
                    <h3 className={`font-semibold text-gray-800 leading-snug group-hover:text-red-500 transition-colors ${isList ? 'text-xl mb-3' : 'line-clamp-2 h-10 mb-2'}`}>
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

                    {isList && product.description && (
                        <p className="text-gray-500 text-sm line-clamp-3 mb-4 hidden md:block">
                            {product.description}
                        </p>
                    )}
                </div>

                <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2">
                        {finalSalePrice > 0 ? (
                            <div className="flex flex-col">
                                <span className="font-bold text-red-600 text-lg md:text-xl">
                                    {finalSalePrice.toLocaleString('vi-VN')}đ
                                </span>
                                <span className="text-sm text-gray-400 line-through">
                                    {finalPrice.toLocaleString('vi-VN')}đ
                                </span>
                            </div>
                        ) : (
                            <span className="font-bold text-gray-900 text-lg md:text-xl">
                                {(finalPrice || 0).toLocaleString('vi-VN')}đ
                            </span>
                        )}
                    </div>

                    {isList && (
                        <Link
                            href={`/products/${product.slug}`}
                            className="px-6 py-2 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-all hidden md:block"
                        >
                            Xem chi tiết
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};
