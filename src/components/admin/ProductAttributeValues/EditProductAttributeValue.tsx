"use client";

import ProductAttributeValueForm from "./ProductAttributeValueForm";

interface ProductAttributeValue {
  id: number;
  product_attribute_id?: number;
  attribute_id?: number;
  value?: string;
  label?: string | null;
  color_code?: string | null;
  sort_order?: number;
  product_variant_id?: number | null;
  attribute?: {
    id: number;
    name: string;
    code: string;
    type: string;
  };
}

interface EditProductAttributeValueProps {
  show: boolean;
  attributeValue: ProductAttributeValue;
  apiErrors?: Record<string, string | string[]>;
  onClose: () => void;
  onUpdated: (data: any) => void;
}

export default function EditProductAttributeValue({
  show,
  attributeValue,
  apiErrors,
  onClose,
  onUpdated,
}: EditProductAttributeValueProps) {
  return (
    <ProductAttributeValueForm
      show={show}
      attributeValue={attributeValue}
      apiErrors={apiErrors}
      onCancel={onClose}
      onSubmit={onUpdated}
    />
  );
}

