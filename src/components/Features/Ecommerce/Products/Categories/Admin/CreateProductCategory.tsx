"use client";

import ProductCategoryForm from "./ProductCategoryForm";

interface CreateProductCategoryProps {
  show: boolean;
  statusEnums?: Array<{ value: string; label?: string; name?: string }>;
  apiErrors?: Record<string, string | string[]>;
  onClose: () => void;
  onCreated: (data: any) => void;
}

export default function CreateProductCategory({
  show,
  statusEnums,
  apiErrors,
  onClose,
  onCreated,
}: CreateProductCategoryProps) {
  return (
    <ProductCategoryForm
      show={show}
      statusEnums={statusEnums}
      apiErrors={apiErrors}
      onCancel={onClose}
      onSubmit={onCreated}
    />
  );
}




