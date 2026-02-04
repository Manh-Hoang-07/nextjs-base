"use client";

import { useMemo } from "react";
import AdminFilter from "@/components/shared/admin/AdminFilter";
import SelectFilter from "@/components/shared/ui/filters/SelectFilter";
import MultiSelectFilter from "@/components/shared/ui/filters/MultiSelectFilter";
import { adminEndpoints } from "@/lib/api/endpoints";

const getProductStatusArray = () => [
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Ngừng hoạt động" },
  { value: "draft", label: "Bản nháp" },
  { value: "archived", label: "Lưu trữ" },
];

interface ProductsFilterProps {
  initialFilters?: Record<string, any>;
  statusEnums?: Array<{ value: string; label?: string; name?: string }>;
  onUpdateFilters?: (filters: Record<string, any>) => void;
}

export default function ProductsFilter({
  initialFilters = {},
  statusEnums = [],
  onUpdateFilters,
}: ProductsFilterProps) {
  const statusOptions = useMemo(() => {
    const options = [{ value: "", label: "Tất cả" }];
    const statusArray =
      statusEnums && statusEnums.length > 0 ? statusEnums : getProductStatusArray();
    statusArray.forEach((item) => {
      options.push({
        value: item.value,
        label: item.label || (item as any).name || item.value,
      });
    });
    return options;
  }, [statusEnums]);

  const sortOptions = [
    { value: "created_at:DESC", label: "Ngày tạo (mới nhất)" },
    { value: "created_at:ASC", label: "Ngày tạo (cũ nhất)" },
    { value: "name:ASC", label: "Tên (A-Z)" },
    { value: "name:DESC", label: "Tên (Z-A)" },
    { value: "updated_at:DESC", label: "Cập nhật (mới nhất)" },
  ];

  return (
    <AdminFilter
      initialFilters={initialFilters}
      sortOptions={sortOptions}
      sortField="sort"
      searchField="search"
      searchPlaceholder="Tìm theo tên, SKU, slug..."
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
          <div className="min-w-[150px]">
            <SelectFilter
              value={filters["is_featured"] || ""}
              options={[
                { value: "", label: "Tất cả" },
                { value: "true", label: "Nổi bật" },
                { value: "false", label: "Không nổi bật" },
              ]}
              placeholder="Nổi bật"
              onChange={(value) => {
                filters["is_featured"] = value;
                onChange();
              }}
            />
          </div>
          <div className="min-w-[150px]">
            <SelectFilter
              value={filters["is_variable"] || ""}
              options={[
                { value: "", label: "Tất cả" },
                { value: "true", label: "Có biến thể" },
                { value: "false", label: "Không có biến thể" },
              ]}
              placeholder="Biến thể"
              onChange={(value) => {
                filters["is_variable"] = value;
                onChange();
              }}
            />
          </div>
          <div className="min-w-[150px]">
            <SelectFilter
              value={filters["is_digital"] || ""}
              options={[
                { value: "", label: "Tất cả" },
                { value: "true", label: "Sản phẩm số" },
                { value: "false", label: "Sản phẩm vật lý" },
              ]}
              placeholder="Loại sản phẩm"
              onChange={(value) => {
                filters["is_digital"] = value;
                onChange();
              }}
            />
          </div>
          <div className="min-w-[200px]">
            <MultiSelectFilter
              value={filters["category_ids"] || []}
              apiEndpoint={adminEndpoints.productCategories.simple}
              labelField="name"
              valueField="id"
              placeholder="Danh mục"
              onChange={(value) => {
                filters["category_ids"] = value;
                onChange();
              }}
            />
          </div>
        </>
      )}
    />
  );
}



