"use client";

import { useState, useEffect } from "react";
import FormWrapper from "@/components/UI/Forms/FormWrapper";
import FormField from "@/components/UI/Forms/FormField";
import SearchableSelect from "@/components/UI/Forms/SearchableSelect";
import { adminEndpoints } from "@/lib/api/endpoints";
import apiClient from "@/lib/api/client";
import { useToastContext } from "@/contexts/ToastContext";
import Modal from "@/components/UI/Feedback/Modal";

interface CreateImportModalProps {
    show: boolean;
    onClose: () => void;
    onCreated: (data: any) => Promise<void>;
    apiErrors?: any;
}

interface ImportItem {
    tempId: number;
    product_variant_id: string | number;
    quantity: number;
}

export default function CreateImportModal({ show, onClose, onCreated, apiErrors }: CreateImportModalProps) {
    const { showError } = useToastContext();
    const [warehouses, setWarehouses] = useState<{ value: string | number; label: string }[]>([]);

    const [formData, setFormData] = useState({
        warehouse_id: "",
        notes: "",
    });

    const [items, setItems] = useState<ImportItem[]>([
        { tempId: Date.now(), product_variant_id: "", quantity: 1 }
    ]);

    useEffect(() => {
        if (!show) return;

        const fetchWarehouses = async () => {
            try {
                const res = await apiClient.get(adminEndpoints.warehouses.simple);
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

    const addItem = () => {
        setItems([...items, { tempId: Date.now(), product_variant_id: "", quantity: 1 }]);
    };

    const removeItem = (tempId: number) => {
        if (items.length <= 1) return;
        setItems(items.filter(item => item.tempId !== tempId));
    };

    const updateItem = (tempId: number, field: keyof ImportItem, value: any) => {
        setItems(items.map(item => item.tempId === tempId ? { ...item, [field]: value } : item));
    };

    const handleSubmit = async () => {
        if (!formData.warehouse_id) {
            showError("Vui lòng chọn kho nhập");
            return;
        }

        // Validate items
        const validItems = items.filter(item => item.product_variant_id && item.quantity > 0);
        if (validItems.length === 0) {
            showError("Vui lòng thêm ít nhất một sản phẩm hợp lệ");
            return;
        }

        for (const item of validItems) {
            if (!item.product_variant_id) {
                showError("Vui lòng chọn sản phẩm cho tất cả các dòng");
                return;
            }
            if (!item.quantity || item.quantity <= 0) {
                showError("Số lượng phải lớn hơn 0");
                return;
            }
        }

        const payload = {
            warehouse_id: formData.warehouse_id,
            notes: formData.notes,
            items: validItems.map(item => ({
                product_variant_id: item.product_variant_id,
                quantity: item.quantity
            }))
        };

        await onCreated(payload);
    };

    return (
        <Modal
            show={show}
            onClose={onClose}
            title="Tạo phiếu nhập kho"
            size="xl" // Wider modal for table
        >
            <FormWrapper
                onCancel={onClose}
                onSubmit={handleSubmit}
                submitText="Tạo phiếu"
                apiErrors={apiErrors}
            >
                <div className="grid grid-cols-1 gap-4 mb-4">
                    <FormField
                        label="Kho nhập"
                        type="select"
                        name="warehouse_id"
                        value={formData.warehouse_id}
                        onChange={(e) => setFormData({ ...formData, warehouse_id: e.target.value })}
                        options={warehouses}
                        required
                        error={apiErrors?.warehouse_id}
                        placeholder="Chọn kho nhập"
                    />
                    <FormField
                        label="Ghi chú nhập hàng"
                        type="textarea"
                        name="notes"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        error={apiErrors?.notes || apiErrors?.reason}
                    />
                </div>

                <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-semibold text-gray-700">
                            Danh sách sản phẩm <span className="text-red-500">*</span>
                        </label>
                        <button
                            type="button"
                            onClick={addItem}
                            className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded hover:bg-blue-100"
                        >
                            + Thêm sản phẩm
                        </button>
                    </div>

                    <div className="space-y-3">
                        {items.map((item, index) => (
                            <div key={item.tempId} className="flex gap-3 items-end p-3 border rounded-md bg-gray-50">
                                <div className="flex-1">
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Sản phẩm #{index + 1}</label>
                                    <SearchableSelect
                                        searchApi={adminEndpoints.productVariants.search}
                                        value={item.product_variant_id}
                                        onChange={(val) => updateItem(item.tempId, 'product_variant_id', val as string)}
                                        placeholder="Tên sp, SKU..."
                                    />
                                </div>
                                <div className="w-24">
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Số lượng</label>
                                    <input
                                        type="number"
                                        min="1"
                                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                                        value={item.quantity}
                                        onChange={(e) => updateItem(item.tempId, 'quantity', parseInt(e.target.value) || 0)}
                                    />
                                </div>
                                {items.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeItem(item.tempId)}
                                        className="mb-1 p-2 text-red-500 hover:text-red-700"
                                        title="Xóa dòng"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </FormWrapper>
        </Modal>
    );
}


