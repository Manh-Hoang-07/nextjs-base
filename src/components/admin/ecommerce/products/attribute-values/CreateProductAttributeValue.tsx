"use client";

import ProductAttributeValueForm from "./ProductAttributeValueForm";

interface CreateProductAttributeValueProps {
  show: boolean;
  apiErrors?: Record<string, string | string[]>;
  onClose: () => void;
  onCreated: (data: any) => void;
}

export default function CreateProductAttributeValue({
  show,
  apiErrors,
  onClose,
  onCreated,
}: CreateProductAttributeValueProps) {
  return (
    <ProductAttributeValueForm
      show={show}
      apiErrors={apiErrors}
      onCancel={onClose}
      onSubmit={onCreated}
    />
  );
}

