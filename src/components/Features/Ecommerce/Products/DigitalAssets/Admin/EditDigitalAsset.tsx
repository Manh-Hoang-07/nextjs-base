"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Modal from "@/components/UI/Feedback/Modal";
import FormField from "@/components/UI/Forms/FormField";
import SingleSelectEnhanced from "@/components/UI/Forms/SingleSelectEnhanced";
import { adminEndpoints } from "@/lib/api/endpoints";
import apiClient from "@/lib/api/client";

const editAssetSchema = z.object({
    product_id: z.coerce.number().min(1, "Vui lòng chọn sản phẩm"),
    product_variant_id: z.coerce.number().optional().nullable(),
    content: z.string().min(1, "Nội dung không được để trống"),
    status: z.enum(["available", "sold"]),
});

type EditAssetFormValues = z.infer<typeof editAssetSchema>;

interface EditDigitalAssetProps {
    show: boolean;
    asset: any;
    onClose: () => void;
    onSuccess: () => void;
}

export default function EditDigitalAsset({
    show,
    asset,
    onClose,
    onSuccess,
}: EditDigitalAssetProps) {
    const [productOptions, setProductOptions] = useState<any[]>([]);
    const [variantOptions, setVariantOptions] = useState<any[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [loadingVariants, setLoadingVariants] = useState(false);

    const {
        handleSubmit,
        control,
        watch,
        reset,
        setValue,
        formState: { isSubmitting, errors },
    } = useForm<EditAssetFormValues>({
        resolver: zodResolver(editAssetSchema),
        defaultValues: {
            product_id: 0,
            product_variant_id: null,
            content: "",
            status: "available",
        },
    });

    const productId = watch("product_id");

    // Initialize form
    useEffect(() => {
        if (show && asset) {
            reset({
                product_id: asset.product_id,
                product_variant_id: asset.product_variant_id,
                content: asset.content || "", // Make sure content is string
                status: asset.status,
            });
        }
    }, [show, asset, reset]);

    // Load products
    useEffect(() => {
        const loadProducts = async () => {
            setLoadingProducts(true);
            try {
                const response = await apiClient.get(adminEndpoints.products.list, {
                    params: { limit: 100 },
                });
                const items = response.data?.data || response.data?.items || [];
                setProductOptions(
                    items.map((p: any) => ({
                        value: p.id,
                        label: p.name + (p.sku ? ` (${p.sku})` : ""),
                        is_variable: p.is_variable,
                    }))
                );
            } catch (error) {
                console.error("Failed to load products", error);
            } finally {
                setLoadingProducts(false);
            }
        };

        if (show) {
            loadProducts();
        }
    }, [show]);

    // Load variants
    useEffect(() => {
        const loadVariants = async () => {
            if (!productId) {
                setVariantOptions([]);
                return;
            }

            setLoadingVariants(true);
            try {
                const response = await apiClient.get(
                    adminEndpoints.productVariants.byProduct(productId)
                );
                const items = response.data?.data || response.data || [];
                setVariantOptions(
                    items.map((v: any) => ({
                        value: v.id,
                        label: v.name || v.sku || `Biến thể #${v.id}`,
                    }))
                );
            } catch (error) {
                console.error("Failed to load variants", error);
                setVariantOptions([]);
            } finally {
                setLoadingVariants(false);
            }
        };

        loadVariants();
    }, [productId]);

    const onSubmit = async (values: EditAssetFormValues) => {
        try {
            await apiClient.put(adminEndpoints.productDigitalAssets.update(asset.id), values);
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Update failed", error);
        }
    };

    return (
        <Modal
            show={show}
            onClose={onClose}
            title="Chỉnh sửa tài sản số"
            size="lg"
            loading={isSubmitting}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <section className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <Controller
                                name="product_id"
                                control={control}
                                render={({ field }) => (
                                    <div className="space-y-1">
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                                            Sản phẩm <span className="text-red-500">*</span>
                                        </label>
                                        <SingleSelectEnhanced
                                            placeholder="-- Chọn sản phẩm --"
                                            options={productOptions}
                                            loading={loadingProducts}
                                            value={field.value}
                                            onChange={field.onChange}
                                            error={errors.product_id?.message}
                                            required
                                        />
                                    </div>
                                )}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <Controller
                                name="product_variant_id"
                                control={control}
                                render={({ field }) => (
                                    <div className="space-y-1">
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                                            Biến thể
                                        </label>
                                        <SingleSelectEnhanced
                                            placeholder="-- Chọn biến thể --"
                                            options={variantOptions}
                                            loading={loadingVariants}
                                            value={field.value}
                                            onChange={field.onChange}
                                            disabled={variantOptions.length === 0}
                                            error={errors.product_variant_id?.message}
                                        />
                                    </div>
                                )}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <Controller
                                name="status"
                                control={control}
                                render={({ field }) => (
                                    <div className="space-y-1">
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                                            Trạng thái
                                        </label>
                                        <SingleSelectEnhanced
                                            options={[
                                                { value: "available", label: "Sẵn có" },
                                                { value: "sold", label: "Đã bán" },
                                            ]}
                                            value={field.value}
                                            onChange={field.onChange}
                                            error={errors.status?.message}
                                        />
                                    </div>
                                )}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <FormField
                                label="Nội dung"
                                type="textarea"
                                rows={5}
                                {...control.register("content")}
                                error={errors.content?.message}
                                required
                            />
                        </div>
                    </div>
                </section>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-8 py-3 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all active:scale-95"
                    >
                        Hủy bỏ
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                    >
                        {isSubmitting ? "Đang xử lý..." : "Cập nhật"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
