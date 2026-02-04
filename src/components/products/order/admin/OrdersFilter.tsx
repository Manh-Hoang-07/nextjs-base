"use client";

import AdminFilter from "@/components/shared/admin/AdminFilter";
import SelectFilter from "@/components/shared/ui/filters/SelectFilter";
import DateRangeFilter from "@/components/shared/ui/filters/DateRangeFilter";

interface OrdersFilterProps {
    initialFilters: any;
    statusEnums: Array<{ value: string; label: string }>;
    onUpdateFilters: (filters: any) => void;
}

export default function OrdersFilter({ initialFilters, statusEnums, onUpdateFilters }: OrdersFilterProps) {
    const sortOptions = [
        { value: "created_at:DESC", label: "Ngày đặt (mới nhất)" },
        { value: "created_at:ASC", label: "Ngày đặt (cũ nhất)" },
        { value: "total_amount:DESC", label: "Tổng tiền (giảm dần)" },
        { value: "total_amount:ASC", label: "Tổng tiền (tăng dần)" },
    ];

    return (
        <AdminFilter
            initialFilters={initialFilters}
            sortOptions={sortOptions}
            searchPlaceholder="Tìm theo mã đơn, khách hàng..."
            hasAdvancedFilters={true}
            onUpdateFilters={onUpdateFilters}
            advancedFilters={({ filters, onChange }) => (
                <>
                    <div className="min-w-[150px]">
                        <SelectFilter
                            label="Trạng thái"
                            value={filters.status || ""}
                            options={statusEnums}
                            placeholder="Tất cả trạng thái"
                            onChange={(val) => {
                                filters.status = val;
                                onChange();
                            }}
                        />
                    </div>
                    <div className="min-w-[300px]">
                        <DateRangeFilter
                            label="Ngày đặt hàng"
                            value={{
                                start: filters.start_date || "",
                                end: filters.end_date || "",
                            }}
                            onChange={(range) => {
                                filters.start_date = range.start;
                                filters.end_date = range.end;
                                onChange();
                            }}
                        />
                    </div>
                </>
            )}
        />
    );
}


