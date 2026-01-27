"use client";

import ShippingMethodForm, {
  ShippingMethodFormValues,
} from "./ShippingMethodForm";

interface CreateShippingMethodProps {
  show: boolean;
  apiErrors?: Record<string, string | string[]>;
  onClose: () => void;
  onCreated: (data: ShippingMethodFormValues) => void;
}

export default function CreateShippingMethod({
  show,
  apiErrors,
  onClose,
  onCreated,
}: CreateShippingMethodProps) {
  return (
    <ShippingMethodForm
      show={show}
      apiErrors={apiErrors}
      onCancel={onClose}
      onSubmit={onCreated}
    />
  );
}


