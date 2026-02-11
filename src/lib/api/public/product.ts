import { Product, PaginatedProductResponse, ProductFilterParams } from "@/types/product";
import { serverFetch } from "@/lib/api/server-client";
import { publicEndpoints } from "@/lib/api/endpoints";

export async function getProducts(params: ProductFilterParams): Promise<PaginatedProductResponse | null> {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            if (key === 'attributes' && typeof value === 'object') {
                // Handle complex attribute filtering if needed, for now assuming backend handles query params
                // This might need adjustment based on actual backend implementation
                Object.entries(value).forEach(([attrKey, attrVals]) => {
                    (attrVals as string[]).forEach(val => query.append(`attributes[${attrKey}][]`, val));
                });
            } else {
                query.append(key, value.toString());
            }
        }
    });

    const { data, meta: responseMeta, error } = await serverFetch<any>(`${publicEndpoints.products.list}?${query.toString()}`, {
        skipCookies: true,
    });

    if (error || !data) return null;

    const items = Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : []);
    const meta = responseMeta || data.meta || {
        page: params.page || 1,
        limit: params.limit || 20,
        totalItems: items.length,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
    };

    return { data: items, meta };
}

export async function getProductDetail(slug: string): Promise<Product | null> {
    const { data, error } = await serverFetch<Product>(publicEndpoints.products.detail(slug), {
        skipCookies: true,
    });

    if (error) return null;
    return data;
}

export async function getRelatedProducts(slug: string): Promise<Product[]> {
    const { data, error } = await serverFetch<any>(publicEndpoints.products.related(slug), {
        skipCookies: true,
    });

    if (error || !data) return [];
    return Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : []);
}

export async function getProductCategories(): Promise<any[]> {
    const { data, error } = await serverFetch<any>(publicEndpoints.productCategories.list, {
        skipCookies: true,
        revalidate: 3600 // Cache for 1 hour
    });

    if (error || !data) return [];
    return Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : []);
}
