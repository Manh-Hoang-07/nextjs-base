"use client";

import PaymentMethodForm, {
  PaymentMethodFormValues,
} from "./PaymentMethodForm";

interface CreatePaymentMethodProps {
  show: boolean;
  apiErrors?: Record<string, string | string[]>;
  onClose: () => void;
  onCreated: (data: PaymentMethodFormValues) => void;
}

export default function CreatePaymentMethod({
  show,
  apiErrors,
  onClose,
  onCreated,
}: CreatePaymentMethodProps) {
  return (
    <PaymentMethodForm
      show={show}
      apiErrors={apiErrors}
      onCancel={onClose}
      onSubmit={onCreated}
    />
  );
}




