"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/shared/ui/feedback/Modal";
import FormField from "@/components/shared/ui/forms/FormField";
import SearchableSelect from "@/components/shared/ui/forms/SearchableSelect";
import { adminEndpoints } from "@/lib/api/endpoints";

interface UpdateInventoryModalProps {
    show: boolean;
    warehouseId: string | number;
    onClose: () => void;
    onUpdated: (data: any) => void;
    apiErrors?: any;
}

export default function UpdateInventoryModal({
    show,
    warehouseId,
    onClose,
    onUpdated,
    apiErrors,
}: UpdateInventoryModalProps) {
    const [form, setForm] = useState({
        product_variant_id: "",
        quantity: "",
        min_quantity: "",
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onUpdated({
                warehouse_id: Number(warehouseId),
                product_variant_id: Number(form.product_variant_id),
                quantity: Number(form.quantity),
                min_quantity: form.min_quantity === "" ? undefined : Number(form.min_quantity),
            });
            setForm({ product_variant_id: "", quantity: "", min_quantity: "" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} title="Cập nhật tồn kho" onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="w-full">
                    <label className="block text-sm font-semibold mb-1.5 text-gray-700">
                        Biến thể (product_variant_id)
                    </label>
                    <SearchableSelect
                        value={form.product_variant_id ? Number(form.product_variant_id) : null}
                        searchApi={adminEndpoints.productVariants.list}
                        labelField="sku"
                        placeholder="Tìm theo SKU..."
                        onChange={(v) =>
                            setForm((p) => ({ ...p, product_variant_id: v ? String(v) : "" }))
                        }
                    />
                    <div className="text-xs text-gray-500 mt-1">
                        Tip: gõ SKU để tìm nhanh (ví dụ: SKU-1050-BLUE-128)
                    </div>
                </div>

                <FormField
                    label="Số lượng"
                    type="number"
                    value={form.quantity}
                    onChange={(e) => setForm((p) => ({ ...p, quantity: e.target.value }))}
                    placeholder="Ví dụ: 100"
                    required
                    min={0}
                    error={apiErrors?.quantity}
                />

                <FormField
                    label="Số lượng tối thiểu (Cảnh báo)"
                    type="number"
                    value={form.min_quantity}
                    onChange={(e) => setForm((p) => ({ ...p, min_quantity: e.target.value }))}
                    placeholder="Ví dụ: 10"
                    min={0}
                    error={apiErrors?.min_quantity}
                />

                <div className="flex justify-end gap-3 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? "Đang cập nhật..." : "Cập nhật"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}


