"use client";

import AdminFilter from "@/components/admin/Filter/AdminFilter";

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
            advancedFilters={[
                {
                    key: "status",
                    label: "Trạng thái",
                    type: "select",
                    options: statusOptions,
                },
            ]}
            onUpdateFilters={onUpdateFilters}
            onFilterChange={onFilterChange}
        />
    );
}
