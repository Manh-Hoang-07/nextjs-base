
export interface ProductAttribute {
    id: number;
    name: string; // e.g., "Color", "Size"
    slug: string; // e.g., "color", "size"
    options: ProductAttributeOption[];
}

export interface ProductAttributeOption {
    id: number;
    name: string; // e.g., "Red", "S"
    value: string; // e.g., "#ff0000", "s"
}

export interface ProductVariant {
    id: number | string;
    product_id?: number;
    name: string;
    sku: string;
    price: number | string;
    sale_price?: number | string | null;
    stock_quantity?: number;
    stock_status?: 'in_stock' | 'out_of_stock';
    inventory_quantity?: number;
    attributes?: {
        attribute_id: number;
        option_id: number;
    }[];
    image?: string | null;
}

export interface Product {
    id: number;
    name: string;
    slug: string;
    description?: string;
    short_description?: string;
    price: number;
    max_price?: number;
    sale_price?: number;
    image?: string;
    gallery?: string[];
    average_rating?: number;
    review_count?: number;
    is_new?: boolean;
    is_featured?: boolean;
    is_digital?: boolean;
    stock_status: 'in_stock' | 'out_of_stock';
    category_id?: number;
    created_at: string;
    updated_at: string;
    // Relations
    variants?: ProductVariant[];
    attributes?: ProductAttribute[];
}

export interface ProductFilterParams {
    page?: number;
    limit?: number;
    sort?: string;
    search?: string;
    category_slug?: string;
    min_price?: number;
    max_price?: number;
    rating?: number;
    attributes?: Record<string, string[]>; // { color: ['red', 'blue'], size: ['m'] }
}

export interface PaginatedProductResponse {
    data: Product[];
    meta: {
        page: number;
        limit: number;
        totalItems: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
}
