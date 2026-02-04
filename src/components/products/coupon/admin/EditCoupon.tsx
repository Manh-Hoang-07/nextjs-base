"use client";

import CouponForm from "./CouponForm";

interface EditCouponProps {
    show: boolean;
    coupon: any;
    onClose: () => void;
    onUpdated: (data: any) => void;
    apiErrors?: any;
}

export default function EditCoupon({ show, coupon, onClose, onUpdated, apiErrors }: EditCouponProps) {
    return (
        <CouponForm
            show={show}
            initialData={coupon}
            onCancel={onClose}
            onSubmit={onUpdated}
            apiErrors={apiErrors}
        />
    );
}


