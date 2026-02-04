"use client";

import PaymentMethodForm, {
  PaymentMethod,
  PaymentMethodFormValues,
} from "./PaymentMethodForm";

interface EditPaymentMethodProps {
  show: boolean;
  paymentMethod: PaymentMethod;
  apiErrors?: Record<string, string | string[]>;
  onClose: () => void;
  onUpdated: (data: PaymentMethodFormValues) => void;
}

export default function EditPaymentMethod({
  show,
  paymentMethod,
  apiErrors,
  onClose,
  onUpdated,
}: EditPaymentMethodProps) {
  return (
    <PaymentMethodForm
      show={show}
      paymentMethod={paymentMethod}
      apiErrors={apiErrors}
      onCancel={onClose}
      onSubmit={onUpdated}
    />
  );
}




