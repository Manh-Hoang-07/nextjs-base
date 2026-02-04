"use client";

import { useState } from "react";

interface InventoryFilterProps {
    initialFilters?: any;
    onUpdateFilters: (filters: any) => void;
}

export default function InventoryFilter({
    initialFilters = {},
    onUpdateFilters,
}: InventoryFilterProps) {
    const [filters, setFilters] = useState({
        search: initialFilters.search || "",
        low_stock: initialFilters.low_stock === "true",
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdateFilters({
            ...filters,
            low_stock: filters.low_stock ? "true" : undefined,
        });
    };

    const toggleLowStock = (checked: boolean) => {
        const newFilters = { ...filters, low_stock: checked };
        setFilters(newFilters);
        onUpdateFilters({
            ...newFilters,
            low_stock: checked ? "true" : undefined,
        });
    };

    return (
        <div className="mb-6 rounded-lg bg-white p-4 shadow-sm">
            <form onSubmit={handleSearch} className="flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-[200px]">
                    <input
                        type="text"
                        placeholder="Tìm kiếm sản phẩm, SKU..."
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="low_stock"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={filters.low_stock}
                        onChange={(e) => toggleLowStock(e.target.checked)}
                    />
                    <label htmlFor="low_stock" className="text-sm text-gray-700">
                        Chỉ hàng sắp hết
                    </label>
                </div>

                <button
                    type="submit"
                    className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                >
                    Lọc
                </button>

                <button
                    type="button"
                    onClick={() => {
                        setFilters({ search: "", low_stock: false });
                        onUpdateFilters({});
                    }}
                    className="text-sm text-blue-600 hover:underline"
                >
                    Xóa bộ lọc
                </button>
            </form>
        </div>
    );
}


