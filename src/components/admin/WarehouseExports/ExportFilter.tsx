"use client";

import AdminFilter from "@/components/admin/Filter/AdminFilter";
import SelectFilter from "@/components/ui/filters/SelectFilter";

interface ExportFilterProps {
    initialFilters?: Record<string, any>;
    onUpdateFilters?: (filters: Record<string, any>) => void;
    onFilterChange?: () => void;
}

export default function ExportFilter({
    initialFilters = {},
    onUpdateFilters,
    onFilterChange,
}: ExportFilterProps) {
    const sortOptions = [
        { value: "created_at:desc", label: "Ngày tạo (Mới nhất)" },
        { value: "created_at:asc", label: "Ngày tạo (Cũ nhất)" },
    ];

    const statusOptions = [
        { value: "pending", label: "Đang chờ (Pending)" },
        { value: "approved", label: "Đã duyệt (Approved)" },
        { value: "cancelled", label: "Đã hủy (Cancelled)" },
    ];

    return (
        <AdminFilter
            initialFilters={initialFilters}
            sortOptions={sortOptions}
            sortField="sortBy"
            hasAdvancedFilters={true}
            advancedFilters={({ filters, onChange }) => (
                <>
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
                    <div className="min-w-[150px]">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Từ ngày</label>
                        <input
                            type="date"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            value={filters["from_date"] || ""}
                            onChange={(e) => {
                                filters["from_date"] = e.target.value;
                                onChange();
                            }}
                        />
                    </div>
                    <div className="min-w-[150px]">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Đến ngày</label>
                        <input
                            type="date"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            value={filters["to_date"] || ""}
                            onChange={(e) => {
                                filters["to_date"] = e.target.value;
                                onChange();
                            }}
                        />
                    </div>
                </>
            )}
            onUpdateFilters={onUpdateFilters}
            onFilterChange={onFilterChange}
        />
    );
}
