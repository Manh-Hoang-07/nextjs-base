"use client";

import { useMemo, useEffect, useState } from "react";
import AdminFilter from "@/components/admin/shared/AdminFilter";
import SelectFilter from "@/components/ui/filters/SelectFilter";
import apiClient from "@/lib/api/client";
import { adminEndpoints } from "@/lib/api/endpoints";

interface ProductAttributeValuesFilterProps {
  initialFilters?: Record<string, any>;
  onUpdateFilters?: (filters: Record<string, any>) => void;
}

interface ProductAttribute {
  id: number;
  name: string;
  code: string;
}

export default function ProductAttributeValuesFilter({
  initialFilters = {},
  onUpdateFilters,
}: ProductAttributeValuesFilterProps) {
  const [attributes, setAttributes] = useState<ProductAttribute[]>([]);
  const [loadingAttributes, setLoadingAttributes] = useState(false);

  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        setLoadingAttributes(true);
        const response = await apiClient.get(adminEndpoints.productAttributes.simple);
        if (response.data?.data) {
          setAttributes(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching attributes:", error);
      } finally {
        setLoadingAttributes(false);
      }
    };

    fetchAttributes();
  }, []);

  const attributeOptions = useMemo(() => {
    const options = [{ value: "", label: "Tất cả thuộc tính" }];
    attributes.forEach((attr) => {
      options.push({
        value: String(attr.id),
        label: attr.name,
      });
    });
    return options;
  }, [attributes]);

  const sortOptions = [
    { value: "created_at:desc", label: "Ngày tạo (mới nhất)" },
    { value: "created_at:asc", label: "Ngày tạo (cũ nhất)" },
    { value: "sort_order:asc", label: "Thứ tự (tăng dần)" },
    { value: "sort_order:desc", label: "Thứ tự (giảm dần)" },
    { value: "value:asc", label: "Giá trị (A-Z)" },
    { value: "value:desc", label: "Giá trị (Z-A)" },
  ];

  return (
    <AdminFilter
      initialFilters={initialFilters}
      sortOptions={sortOptions}
      sortField="sort"
      searchField="search"
      searchPlaceholder="Tìm theo giá trị hoặc nhãn..."
      hasAdvancedFilters={true}
      onUpdateFilters={onUpdateFilters}
      advancedFilters={({ filters, onChange }) => (
        <>
          <div className="min-w-[200px]">
            <SelectFilter
              value={filters["attribute_id"] || ""}
              options={attributeOptions}
              placeholder="Lọc theo thuộc tính"
              onChange={(value) => {
                filters["attribute_id"] = value;
                onChange();
              }}
              disabled={loadingAttributes}
            />
          </div>
        </>
      )}
    />
  );
}

