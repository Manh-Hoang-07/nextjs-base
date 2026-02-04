"use client";

import AdminFilter from "@/components/shared/admin/AdminFilter";
import FormField from "@/components/shared/ui/forms/FormField";

interface ProductVariantsFilterProps {
  initialFilters?: Record<string, any>;
  onUpdateFilters?: (filters: Record<string, any>) => void;
  onFilterChange?: () => void;
}

export default function ProductVariantsFilter({
  initialFilters = {},
  onUpdateFilters,
  onFilterChange,
}: ProductVariantsFilterProps) {
  const sortOptions = [
    { value: "created_at:desc", label: "Ngày tạo (mới nhất)" },
    { value: "created_at:asc", label: "Ngày tạo (cũ nhất)" },
    { value: "sku:asc", label: "SKU (A-Z)" },
    { value: "sku:desc", label: "SKU (Z-A)" },
    { value: "price:asc", label: "Giá (thấp → cao)" },
    { value: "price:desc", label: "Giá (cao → thấp)" },
  ];

  return (
    <AdminFilter
      initialFilters={initialFilters}
      sortOptions={sortOptions}
      sortField="sort"
      searchField="search"
      searchPlaceholder="Tìm theo SKU, tên..."
      hasAdvancedFilters
      advancedFilters={({ filters, onChange }) => (
        <>
          <FormField
            label="product_id"
            type="number"
            value={filters.product_id || ""}
            onChange={(e) => {
              (filters as any).product_id = e.target.value;
              onChange();
            }}
            placeholder="Ví dụ: 1"
            min={1}
          />
          <FormField
            type="checkbox"
            label="include_deleted"
            value={String(filters.include_deleted) === "true"}
            onChange={(e) => {
              (filters as any).include_deleted = e.target.checked ? "true" : "";
              onChange();
            }}
            checkboxLabel="Hiển thị cả bản ghi đã xoá"
          />
          <FormField
            type="select"
            label="status"
            value={filters.status || ""}
            onChange={(e) => {
              (filters as any).status = e.target.value;
              onChange();
            }}
            placeholder="Chọn trạng thái"
            options={[
              { value: "active", label: "Hoạt động" },
              { value: "inactive", label: "Ngừng hoạt động" },
            ]}
          />
        </>
      )}
      onUpdateFilters={onUpdateFilters}
      onFilterChange={onFilterChange}
    />
  );
}


