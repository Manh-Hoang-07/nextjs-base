"use client";

import ProductForm from "./ProductForm";

interface CreateProductProps {
  show: boolean;
  statusEnums?: Array<{ value: string; label?: string; name?: string }>;
  apiErrors?: Record<string, string | string[]>;
  onClose: () => void;
  onCreated: (data: any) => void;
}

export default function CreateProduct({
  show,
  statusEnums,
  apiErrors,
  onClose,
  onCreated,
}: CreateProductProps) {
  return (
    <ProductForm
      show={show}
      statusEnums={statusEnums}
      apiErrors={apiErrors}
      onCancel={onClose}
      onSubmit={onCreated}
    />
  );
}



