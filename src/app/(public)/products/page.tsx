import { getProducts, getProductCategories } from '@/lib/api/public/product';
import { ProductListWrapper } from '@/components/Features/Ecommerce/Products/ProductList/Public/ProductListWrapper';

export const metadata = {
    title: 'Products | Premium Store',
    description: 'Explore our latest collection of premium products.',
};

export default async function ProductsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const params = await searchParams;
    const page = typeof params.page === 'string' ? parseInt(params.page) : 1;
    const limit = typeof params.limit === 'string' ? parseInt(params.limit) : 20;
    const sort = typeof params.sort === 'string' ? params.sort : undefined;
    const min_price = typeof params.min_price === 'string' ? parseInt(params.min_price) : undefined;
    const max_price = typeof params.max_price === 'string' ? parseInt(params.max_price) : undefined;
    const category_slug = typeof params.category === 'string' ? params.category : undefined;

    const [data, categories] = await Promise.all([
        getProducts({
            page,
            limit,
            sort,
            min_price,
            max_price,
            category_slug,
        }),
        getProductCategories()
    ]);

    return <ProductListWrapper initialData={data} categories={categories} />;
}
