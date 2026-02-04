"use client";

import AdminFilter from "@/components/shared/admin/AdminFilter";
import SelectFilter from "@/components/shared/ui/filters/SelectFilter";
import { CouponType } from "./types";

interface CouponsFilterProps {
    initialFilters: any;
    onUpdateFilters: (filters: any) => void;
}

export default function CouponsFilter({ initialFilters, onUpdateFilters }: CouponsFilterProps) {
    const sortOptions = [
        { value: "created_at:DESC", label: "Ngày tạo (mới nhất)" },
        { value: "created_at:ASC", label: "Ngày tạo (cũ nhất)" },
        { value: "name:ASC", label: "Tên (A-Z)" },
        { value: "name:DESC", label: "Tên (Z-A)" },
    ];

    return (
        <AdminFilter
            initialFilters={initialFilters}
            sortOptions={sortOptions}
            searchPlaceholder="Tìm theo mã, tên..."
            hasAdvancedFilters={true}
            onUpdateFilters={onUpdateFilters}
            advancedFilters={({ filters, onChange }) => (
                <>
                    <div className="min-w-[150px]">
                        <SelectFilter
                            label="Loại khuyến mãi"
                            value={filters.type || ""}
                            options={[
                                { value: CouponType.PERCENTAGE, label: "Phần trăm" },
                                { value: CouponType.FIXED_AMOUNT, label: "Số tiền cố định" },
                                { value: CouponType.FREE_SHIPPING, label: "Miễn phí vận chuyển" },
                            ]}
                            placeholder="Tất cả loại"
                            onChange={(val) => {
                                filters.type = val;
                                onChange();
                            }}
                        />
                    </div>
                    <div className="min-w-[150px]">
                        <SelectFilter
                            label="Trạng thái"
                            value={filters.status || ""}
                            options={[
                                { value: "active", label: "Kích hoạt" },
                                { value: "inactive", label: "Vô hiệu" },
                            ]}
                            placeholder="Tất cả trạng thái"
                            onChange={(val) => {
                                filters.status = val;
                                onChange();
                            }}
                        />
                    </div>
                </>
            )}
        />
    );
}
