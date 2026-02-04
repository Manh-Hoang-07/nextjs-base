"use client";

import ShippingMethodForm, {
  ShippingMethod,
  ShippingMethodFormValues,
} from "./ShippingMethodForm";

interface EditShippingMethodProps {
  show: boolean;
  shippingMethod: ShippingMethod;
  apiErrors?: Record<string, string | string[]>;
  onClose: () => void;
  onUpdated: (data: ShippingMethodFormValues) => void;
}

export default function EditShippingMethod({
  show,
  shippingMethod,
  apiErrors,
  onClose,
  onUpdated,
}: EditShippingMethodProps) {
  return (
    <ShippingMethodForm
      show={show}
      shippingMethod={shippingMethod}
      apiErrors={apiErrors}
      onCancel={onClose}
      onSubmit={onUpdated}
    />
  );
}




