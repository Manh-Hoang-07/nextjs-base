"use client";

import { useEffect, useState } from "react";
import ProductVariantForm from "./ProductVariantForm";

export default function CreateProductVariant({
  show,
  apiErrors,
  onCreated,
  onClose,
}: {
  show: boolean;
  apiErrors?: Record<string, string | string[]>;
  onCreated?: (data: any) => void;
  onClose?: () => void;
}) {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => setShowModal(show), [show]);

  if (!showModal) return null;

  return (
    <ProductVariantForm
      show={showModal}
      apiErrors={apiErrors}
      onSubmit={(data) => onCreated?.(data)}
      onCancel={onClose}
    />
  );
}




