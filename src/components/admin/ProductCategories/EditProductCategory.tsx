"use client";

import ProductCategoryForm from "./ProductCategoryForm";

interface ProductCategory {
  id: number;
  name: string;
  status?: string;
}

interface EditProductCategoryProps {
  show: boolean;
  category: ProductCategory;
  statusEnums?: Array<{ value: string; label?: string; name?: string }>;
  apiErrors?: Record<string, string | string[]>;
  onClose: () => void;
  onUpdated: (data: any) => void;
}

export default function EditProductCategory({
  show,
  category,
  statusEnums,
  apiErrors,
  onClose,
  onUpdated,
}: EditProductCategoryProps) {
  return (
    <ProductCategoryForm
      show={show}
      category={category}
      statusEnums={statusEnums}
      apiErrors={apiErrors}
      onCancel={onClose}
      onSubmit={onUpdated}
    />
  );
}


