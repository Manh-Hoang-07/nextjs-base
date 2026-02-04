"use client";

import AdminFilter from "@/components/shared/admin/AdminFilter";
import SelectFilter from "@/components/shared/ui/filters/SelectFilter";

interface TransferFilterProps {
    initialFilters?: Record<string, any>;
    onUpdateFilters?: (filters: Record<string, any>) => void;
    onFilterChange?: () => void;
}

export default function TransferFilter({
    initialFilters = {},
    onUpdateFilters,
    onFilterChange,
}: TransferFilterProps) {
    const sortOptions = [
        { value: "created_at:desc", label: "Ngày tạo (Mới nhất)" },
        { value: "created_at:asc", label: "Ngày tạo (Cũ nhất)" },
    ];

    const statusOptions = [
        { value: "pending", label: "Đang chờ (Pending)" },
        { value: "approved", label: "Đã duyệt (Approved)" },
        { value: "completed", label: "Hoàn tất (Completed)" },
        { value: "cancelled", label: "Đã hủy (Cancelled)" },
    ];

    return (
        <AdminFilter
            initialFilters={initialFilters}
            sortOptions={sortOptions}
            sortField="sortBy"
            searchField="search" // Optional: if API supports search generic text
            searchPlaceholder="Tìm kiếm..."
            hasAdvancedFilters={true}
            advancedFilters={({ filters, onChange }) => (
                <div className="min-w-[200px]">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                    <SelectFilter
                        value={filters["status"] || ""}
                        options={[{ value: "", label: "Tất cả" }, ...statusOptions]}
                        placeholder="Tất cả trạng thái"
                        onChange={(value) => {
                            filters["status"] = value;
                            onChange();
                        }}
                    />
                </div>
            )}
            onUpdateFilters={onUpdateFilters}
            onFilterChange={onFilterChange}
        />
    );
}


