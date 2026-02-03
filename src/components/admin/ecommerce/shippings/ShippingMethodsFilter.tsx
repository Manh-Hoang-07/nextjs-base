"use client";

import { useMemo } from "react";
import SelectFilter from "@/components/ui/filters/SelectFilter";
import AdminFilter from "@/components/admin/shared/AdminFilter";

const getBasicStatusArray = () => [
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Ngừng hoạt động" },
];

interface ShippingMethodsFilterProps {
  initialFilters?: Record<string, any>;
  onUpdateFilters?: (filters: Record<string, any>) => void;
}

export default function ShippingMethodsFilter({
  initialFilters = {},
  onUpdateFilters,
}: ShippingMethodsFilterProps) {
  const statusOptions = useMemo(() => {
    const options = [{ value: "", label: "Tất cả trạng thái" }];
    getBasicStatusArray().forEach((item) =>
      options.push({ value: item.value, label: item.label })
    );
    return options;
  }, []);

  const sortOptions = [
    { value: "created_at:desc", label: "Ngày tạo (mới nhất)" },
    { value: "name:asc", label: "Tên (A-Z)" },
    { value: "code:asc", label: "Mã (A-Z)" },
  ];

  return (
    <AdminFilter
      initialFilters={initialFilters}
      sortOptions={sortOptions}
      sortField="sort"
      searchField="search"
      searchPlaceholder="Tìm theo tên hoặc mã phương thức..."
      hasAdvancedFilters={true}
      onUpdateFilters={onUpdateFilters}
      advancedFilters={({ filters, onChange }) => (
        <div className="flex gap-4">
          <div className="min-w-[160px]">
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
        </div>
      )}
    />
  );
}


