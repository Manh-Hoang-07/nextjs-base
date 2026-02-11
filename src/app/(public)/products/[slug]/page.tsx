
import { getProductDetail, getRelatedProducts } from '@/lib/api/public/product';
import { ProductDetailWrapper } from '@/components/Features/Ecommerce/Products/ProductDetail/Public/ProductDetailWrapper';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const product = await getProductDetail(resolvedParams.slug);
    if (!product) return { title: 'Product Not Found' };

    return {
        title: `${product.name} | Premium Store`,
        description: product.short_description || product.description?.slice(0, 160),
    };
}

export default async function ProductDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const resolvedParams = await params;
    const product = await getProductDetail(resolvedParams.slug);

    if (!product) {
        notFound();
    }

    const relatedProducts = await getRelatedProducts(resolvedParams.slug);

    return <ProductDetailWrapper product={product} relatedProducts={relatedProducts} />;
}
