"use client";

import ProductForm from "./ProductForm";

interface Product {
  id: number | string;
  name?: string;
  slug?: string;
  sku?: string;
  status?: string;
}

interface EditProductProps {
  show: boolean;
  product: Product;
  statusEnums?: Array<{ value: string; label?: string; name?: string }>;
  apiErrors?: Record<string, string | string[]>;
  onClose: () => void;
  onUpdated: (data: any) => void;
}

export default function EditProduct({
  show,
  product,
  statusEnums,
  apiErrors,
  onClose,
  onUpdated,
}: EditProductProps) {
  return (
    <ProductForm
      show={show}
      product={product}
      statusEnums={statusEnums}
      apiErrors={apiErrors}
      onCancel={onClose}
      onSubmit={onUpdated}
    />
  );
}



