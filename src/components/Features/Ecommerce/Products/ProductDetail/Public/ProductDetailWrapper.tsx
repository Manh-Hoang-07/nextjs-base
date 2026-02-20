
"use client";

import React from 'react';
import { Product } from '@/types/product';
import { ProductGallery } from './ProductGallery';
import { ProductInfo } from './ProductInfo';
import { ProductTabs } from './ProductTabs';
import { ProductCard } from '../../Shared/ProductCard';
import { Breadcrumbs } from '@/components/UI/Navigation/Breadcrumbs';

interface ProductDetailWrapperProps {
    product: Product;
    relatedProducts: Product[];
}

export const ProductDetailWrapper: React.FC<ProductDetailWrapperProps> = ({ product, relatedProducts }) => {
    return (
        <div className="container mx-auto px-4 py-8 lg:py-12">

            <Breadcrumbs items={[
                { label: "Sản phẩm", path: "/products" },
                { label: product.name }
            ]} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                {/* Left: Gallery */}
                <ProductGallery images={[product.image || '/placeholder-product.jpg', ...(product.gallery || [])]} />

                {/* Right: Info */}
                <ProductInfo product={product} />
            </div>

            {/* Bottom: Tabs */}
            <ProductTabs product={product} />

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <div className="mt-20">
                    <h2 className="text-2xl font-bold mb-8">Sản phẩm liên quan</h2>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {relatedProducts.map(p => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
