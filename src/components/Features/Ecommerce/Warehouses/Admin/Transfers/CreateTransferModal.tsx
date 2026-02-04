"use client";

import { useState, useEffect } from "react";
import FormWrapper from "@/components/UI/Forms/FormWrapper";
import FormField from "@/components/UI/Forms/FormField";
import SearchableSelect from "@/components/UI/Forms/SearchableSelect";
import { adminEndpoints } from "@/lib/api/endpoints";
import apiClient from "@/lib/api/client";
import { useToastContext } from "@/contexts/ToastContext";
import Modal from "@/components/UI/Feedback/Modal";

interface CreateTransferModalProps {
    show: boolean;
    onClose: () => void;
    onCreated: (data: any) => Promise<void>;
    apiErrors?: any;
}

export default function CreateTransferModal({ show, onClose, onCreated, apiErrors }: CreateTransferModalProps) {
    const { showError } = useToastContext();
    const [warehouses, setWarehouses] = useState<{ value: string | number; label: string }[]>([]);

    // Form state
    const [formData, setFormData] = useState({
        from_warehouse_id: "",
        to_warehouse_id: "",
        product_variant_id: "",
        quantity: 1,
        notes: "",
    });

    useEffect(() => {
        if (!show) return;

        const fetchWarehouses = async () => {
            try {
                const res = await apiClient.get(adminEndpoints.warehouses.simple);
                // Check response structure
                const data = res.data?.data || res.data || [];
                if (Array.isArray(data)) {
                    setWarehouses(data.map((w: any) => ({ value: w.id, label: w.name })));
                }
            } catch (e) {
                console.error("Failed to fetch warehouses", e);
            }
        };
        fetchWarehouses();
    }, [show]);

    const handleSubmit = async () => {
        if (!formData.from_warehouse_id) {
            showError("Vui lòng chọn kho nguồn");
            return;
        }
        if (!formData.to_warehouse_id) {
            showError("Vui lòng chọn kho đích");
            return;
        }
        if (formData.from_warehouse_id == formData.to_warehouse_id) {
            showError("Kho nguồn và kho đích không được trùng nhau");
            return;
        }
        if (!formData.product_variant_id) {
            showError("Vui lòng chọn sản phẩm");
            return;
        }
        if (formData.quantity <= 0) {
            showError("Số lượng phải lớn hơn 0");
            return;
        }

        await onCreated(formData);
    };

    return (
        <Modal
            show={show}
            onClose={onClose}
            title="Tạo phiếu chuyển kho"
            size="lg"
        >
            <FormWrapper
                onCancel={onClose}
                onSubmit={handleSubmit}
                submitText="Tạo phiếu"
                apiErrors={apiErrors}
            >
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        label="Kho nguồn"
                        type="select"
                        name="from_warehouse_id"
                        value={formData.from_warehouse_id}
                        onChange={(e) => setFormData({ ...formData, from_warehouse_id: e.target.value })}
                        options={warehouses}
                        required
                        error={apiErrors?.from_warehouse_id}
                        placeholder="Chọn kho nguồn"
                    />
                    <FormField
                        label="Kho đích"
                        type="select"
                        name="to_warehouse_id"
                        value={formData.to_warehouse_id}
                        onChange={(e) => setFormData({ ...formData, to_warehouse_id: e.target.value })}
                        options={warehouses.filter(w => String(w.value) !== String(formData.from_warehouse_id))}
                        required
                        error={apiErrors?.to_warehouse_id}
                        placeholder="Chọn kho đích"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-semibold mb-1.5 text-gray-700">
                        Sản phẩm (Variant) <span className="text-red-500">*</span>
                    </label>
                    <SearchableSelect
                        searchApi={adminEndpoints.productVariants.search}
                        value={formData.product_variant_id}
                        onChange={(val) => setFormData({ ...formData, product_variant_id: val as string })}
                        placeholder="Tìm kiếm sản phẩm (Tên, SKU)..."
                        error={apiErrors?.product_variant_id}
                    />
                </div>

                <FormField
                    label="Số lượng"
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                    required
                    min={1}
                    error={apiErrors?.quantity}
                />

                <FormField
                    label="Ghi chú"
                    type="textarea"
                    name="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    error={apiErrors?.notes}
                />
            </FormWrapper>
        </Modal>
    );
}


