"use client";

import { useMemo } from "react";
import AdminFilter from "@/components/admin/shared/AdminFilter";
import SelectFilter from "@/components/ui/filters/SelectFilter";

const getBasicStatusArray = () => [
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Ngừng hoạt động" },
];

const getAttributeTypeArray = () => [
  { value: "", label: "Tất cả" },
  { value: "text", label: "Văn bản" },
  { value: "select", label: "Chọn một" },
  { value: "multiselect", label: "Chọn nhiều" },
  { value: "color", label: "Màu sắc" },
  { value: "image", label: "Hình ảnh" },
];

interface ProductAttributesFilterProps {
  initialFilters?: Record<string, any>;
  statusEnums?: Array<{ value: string; label?: string; name?: string }>;
  onUpdateFilters?: (filters: Record<string, any>) => void;
}

export default function ProductAttributesFilter({
  initialFilters = {},
  statusEnums = [],
  onUpdateFilters,
}: ProductAttributesFilterProps) {
  const statusOptions = useMemo(() => {
    const options = [{ value: "", label: "Tất cả" }];
    const statusArray =
      statusEnums && statusEnums.length > 0 ? statusEnums : getBasicStatusArray();
    statusArray.forEach((item) => {
      options.push({
        value: item.value,
        label: item.label || (item as any).name || item.value,
      });
    });
    return options;
  }, [statusEnums]);

  const typeOptions = useMemo(() => {
    return getAttributeTypeArray();
  }, []);

  const sortOptions = [
    { value: "created_at:desc", label: "Ngày tạo (mới nhất)" },
    { value: "sort_order:asc", label: "Thứ tự (tăng dần)" },
    { value: "name:asc", label: "Tên (A-Z)" },
    { value: "name:desc", label: "Tên (Z-A)" },
  ];

  return (
    <AdminFilter
      initialFilters={initialFilters}
      sortOptions={sortOptions}
      sortField="sort"
      searchField="search"
      searchPlaceholder="Tìm theo tên hoặc mã thuộc tính..."
      hasAdvancedFilters={true}
      onUpdateFilters={onUpdateFilters}
      advancedFilters={({ filters, onChange }) => (
        <>
          <div className="min-w-[150px]">
            <SelectFilter
              value={filters["type"] || ""}
              options={typeOptions}
              placeholder="Loại thuộc tính"
              onChange={(value) => {
                filters["type"] = value;
                onChange();
              }}
            />
          </div>
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

