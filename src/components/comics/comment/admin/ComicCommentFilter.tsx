"use client";

import AdminFilter from "@/components/shared/admin/AdminFilter";
import SelectFilter from "@/components/shared/ui/filters/SelectFilter";

interface ComicCommentFilterProps {
    initialFilters?: Record<string, any>;
    onUpdateFilters?: (filters: Record<string, any>) => void;
}

export default function ComicCommentFilter({
    initialFilters = {},
    onUpdateFilters,
}: ComicCommentFilterProps) {
    const statusOptions = [
        { value: "", label: "Tất cả trạng thái" },
        { value: "visible", label: "Công khai" },
        { value: "hidden", label: "Đang ẩn" },
    ];

    const sortOptions = [
        { value: "created_at:desc", label: "Mới nhất" },
        { value: "created_at:asc", label: "Cũ nhất" },
    ];

    return (
        <AdminFilter
            initialFilters={initialFilters}
            sortOptions={sortOptions}
            sortField="sort"
            searchField="search"
            searchPlaceholder="Tìm kiếm nội dung, người gửi..."
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


