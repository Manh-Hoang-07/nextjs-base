"use client";

import CouponForm from "./CouponForm";

interface CreateCouponProps {
    show: boolean;
    onClose: () => void;
    onCreated: (data: any) => void;
    apiErrors?: any;
}

export default function CreateCoupon({ show, onClose, onCreated, apiErrors }: CreateCouponProps) {
    return (
        <CouponForm
            show={show}
            onCancel={onClose}
            onSubmit={onCreated}
            apiErrors={apiErrors}
        />
    );
}
