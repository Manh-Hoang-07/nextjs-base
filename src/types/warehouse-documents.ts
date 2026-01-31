export interface WarehouseDocumentItem {
    product_id: number | string;
    product_variant_id: number | string;
    quantity: number;
    // Optional expanded fields if backend adds them later
    product_name?: string;
    variant_name?: string;
    sku?: string;
}

// Flat structure based on User's real response
export interface WarehouseTransaction {
    id: number | string;
    from_warehouse_id?: number | string | null;
    to_warehouse_id?: number | string | null;
    product_id: number | string;
    product_variant_id: number | string;
    quantity: number;
    type: 'import' | 'export';
    status: 'pending' | 'approved' | 'completed' | 'cancelled';
    notes?: string;
    created_user_id?: number | string;
    updated_user_id?: number | string;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;

    // Potential Relations (marked optional in case they are missing or added later)
    from_warehouse?: { id: number | string; name: string; code?: string } | null;
    to_warehouse?: { id: number | string; name: string; code?: string } | null;
    product?: { id: number | string; name: string };
    product_variant?: { id: number | string; name: string; sku?: string };
    // New field from API update (variant is the new preferred field name)
    variant?: { id: number | string; name: string; sku?: string };
    created_user?: { id: number | string; name: string };
}

// Keeping these for the Create forms if they still support batch creation
export interface CreateWarehouseDocumentItemDto {
    product_variant_id: number | string;
    quantity: number;
}

export interface CreateWarehouseImportDto {
    warehouse_id: number | string;
    reason: string;
    items: CreateWarehouseDocumentItemDto[];
}

export interface CreateWarehouseExportDto {
    warehouse_id: number | string;
    reason: string;
    items: CreateWarehouseDocumentItemDto[];
}
