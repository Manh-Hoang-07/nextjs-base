"use client";

import ProductAttributeForm from "./ProductAttributeForm";

interface ProductAttribute {
  id: string | number;
  name: string;
  code?: string;
  type?: string;
  status?: string;
}

interface EditProductAttributeProps {
  show: boolean;
  attribute: ProductAttribute;
  statusEnums?: Array<{ value: string; label?: string; name?: string }>;
  apiErrors?: Record<string, string | string[]>;
  onClose: () => void;
  onUpdated: (data: any) => void;
}

export default function EditProductAttribute({
  show,
  attribute,
  statusEnums,
  apiErrors,
  onClose,
  onUpdated,
}: EditProductAttributeProps) {
  return (
    <ProductAttributeForm
      show={show}
      attribute={attribute}
      statusEnums={statusEnums}
      apiErrors={apiErrors}
      onCancel={onClose}
      onSubmit={onUpdated}
    />
  );
}



