"use client";

import ProductAttributeForm from "./ProductAttributeForm";

interface CreateProductAttributeProps {
  show: boolean;
  statusEnums?: Array<{ value: string; label?: string; name?: string }>;
  apiErrors?: Record<string, string | string[]>;
  onClose: () => void;
  onCreated: (data: any) => void;
}

export default function CreateProductAttribute({
  show,
  statusEnums,
  apiErrors,
  onClose,
  onCreated,
}: CreateProductAttributeProps) {
  return (
    <ProductAttributeForm
      show={show}
      statusEnums={statusEnums}
      apiErrors={apiErrors}
      onCancel={onClose}
      onSubmit={onCreated}
    />
  );
}

