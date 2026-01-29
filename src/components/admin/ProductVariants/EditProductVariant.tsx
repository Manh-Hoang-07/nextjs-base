"use client";

import { useCallback, useEffect, useState } from "react";
import apiClient from "@/lib/api/client";
import { adminEndpoints } from "@/lib/api/endpoints";
import ProductVariantForm from "./ProductVariantForm";

export default function EditProductVariant({
  show,
  variant,
  apiErrors,
  onUpdated,
  onClose,
}: {
  show: boolean;
  variant?: any;
  apiErrors?: Record<string, string | string[]>;
  onUpdated?: (data: any) => void;
  onClose?: () => void;
}) {
  const [showModal, setShowModal] = useState(false);
  const [variantData, setVariantData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchDetail = useCallback(async () => {
    if (!variant?.id) return;
    setLoading(true);
    try {
      const response = await apiClient.get(adminEndpoints.productVariants.show(variant.id), {
        params: { include_attributes: true },
      });
      const data = response.data?.data || response.data;
      setVariantData(data);
    } catch {
      setVariantData(variant);
    } finally {
      setLoading(false);
    }
  }, [variant]);

  useEffect(() => {
    setShowModal(show);
    if (show && variant?.id) {
      setVariantData(variant);
      fetchDetail();
    } else {
      setVariantData(null);
      setLoading(false);
    }
  }, [show, variant, fetchDetail]);

  if (!showModal) return null;

  return (
    <ProductVariantForm
      show={showModal}
      variant={variantData}
      apiErrors={apiErrors}
      onSubmit={(data) => onUpdated?.(data)}
      onCancel={onClose}
    />
  );
}


