"use client";

import { useMemo } from "react";
import AdminFilter from "@/components/Shared/Admin/AdminFilter";
import SelectFilter from "@/components/UI/Filters/SelectFilter";

interface DigitalAssetsFilterProps {
    initialFilters?: Record<string, any>;
    onUpdateFilters?: (filters: Record<string, any>) => void;
}

export default function DigitalAssetsFilter({
    initialFilters = {},
    onUpdateFilters,
}: DigitalAssetsFilterProps) {
    const statusOptions = [
        { value: "", label: "Tất cả trạng thái" },
        { value: "available", label: "Sẵn có" },
        { value: "sold", label: "Đã bán" },
    ];

    const sortOptions = [
        { value: "created_at:DESC", label: "Ngày tạo (mới nhất)" },
        { value: "created_at:ASC", label: "Ngày tạo (cũ nhất)" },
    ];

    return (
        <AdminFilter
            initialFilters={initialFilters}
            sortOptions={sortOptions}
            sortField="sort"
            searchField="search"
            searchPlaceholder="Tìm theo tên sản phẩm, SKU..."
            hasAdvancedFilters={true}
            onUpdateFilters={onUpdateFilters}
            advancedFilters={({ filters, onChange }) => (
                <>
                    <div className="min-w-[150px]">
                        <SelectFilter
                            value={filters["status"] || ""}
                            options={statusOptions}
                            placeholder="Trạng thái"
                            onChange={(value) => {
                                filters["status"] = value;
                                onChange();
                            }}
                        />
                    </div>
                </>
            )}
        />
    );
}
