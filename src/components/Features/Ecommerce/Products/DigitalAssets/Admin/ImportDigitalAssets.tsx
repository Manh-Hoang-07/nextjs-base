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

const bulkImportSchema = z.object({
    product_id: z.coerce.number().min(1, "Vui lòng chọn sản phẩm"),
    product_variant_id: z.coerce.number().optional().nullable(),
    contents_text: z.string().min(1, "Vui lòng nhập nội dung tài sản"),
});

type BulkImportFormValues = z.infer<typeof bulkImportSchema>;

interface ImportDigitalAssetsProps {
    show: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialProductId?: number;
}

export default function ImportDigitalAssets({
    show,
    onClose,
    onSuccess,
    initialProductId,
}: ImportDigitalAssetsProps) {
    const [productOptions, setProductOptions] = useState<any[]>([]);
    const [variantOptions, setVariantOptions] = useState<any[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [loadingVariants, setLoadingVariants] = useState(false);

    const {
        handleSubmit,
        control,
        watch,
        reset,
        formState: { isSubmitting, errors },
    } = useForm<BulkImportFormValues>({
        resolver: zodResolver(bulkImportSchema),
        defaultValues: {
            product_id: initialProductId || 0,
            product_variant_id: null,
            contents_text: "",
        },
    });

    useEffect(() => {
        if (show) {
            reset({
                product_id: initialProductId || 0,
                product_variant_id: null,
                contents_text: "",
            });
        }
    }, [show, initialProductId, reset]);

    const productId = watch("product_id");

    // Load products
    useEffect(() => {
        const loadProducts = async () => {
            setLoadingProducts(true);
            try {
                const response = await apiClient.get(adminEndpoints.products.list, {
                    params: { limit: 100 }, // Get a good number of products
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

    // Load variants when product changes
    useEffect(() => {
        const loadVariants = async () => {
            if (!productId) {
                setVariantOptions([]);
                return;
            }

            const product = productOptions.find((p) => p.value === productId);
            if (product && !product.is_variable) {
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
    }, [productId, productOptions]);

    const onSubmit = async (values: BulkImportFormValues) => {
        try {
            // Split contents by newline and filter out empty lines
            const contents = values.contents_text
                .split("\n")
                .map((line) => line.trim())
                .filter((line) => line.length > 0);

            if (contents.length === 0) {
                return;
            }

            await apiClient.post(adminEndpoints.productDigitalAssets.bulkImport, {
                product_id: values.product_id,
                product_variant_id: values.product_variant_id,
                contents,
            });

            reset();
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Bulk import failed", error);
        }
    };

    return (
        <Modal
            show={show}
            onClose={onClose}
            title="Nhập tài sản số hàng loạt"
            size="lg"
            loading={isSubmitting}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 p-1">
                {/* SECTION: THÔNG TIN SẢN PHẨM */}
                <section className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">
                    <header className="flex items-center space-x-3 mb-2">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">
                                Thông tin sản phẩm
                            </h3>
                            <p className="text-xs text-gray-500">
                                Lựa chọn sản phẩm và biến thể cần nhập
                            </p>
                        </div>
                    </header>

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
                                            placeholder={
                                                variantOptions.length > 0
                                                    ? "-- Chọn biến thể --"
                                                    : "Sản phẩm không có biến thể"
                                            }
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
                    </div>
                </section>

                {/* SECTION: DANH SÁCH TÀI SẢN */}
                <section className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">
                    <header className="flex items-center space-x-3 mb-2">
                        <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600">
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                                />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">
                                Danh sách khóa / Tài khoản
                            </h3>
                            <p className="text-xs text-gray-500">
                                Nhập danh sách tài sản, mỗi dòng một mục
                            </p>
                        </div>
                    </header>

                    <div className="md:col-span-2">
                        <FormField
                            label="Nội dung"
                            type="textarea"
                            rows={10}
                            placeholder="Nhập danh sách tài sản, mỗi dòng một tài sản. Ví dụ:
account|password
license-key-xxxx-xxxx"
                            {...control.register("contents_text")}
                            error={errors.contents_text?.message}
                            required
                            helpText="Hệ thống sẽ tự động tách mỗi dòng thành một tài sản."
                        />
                    </div>
                </section>

                {/* FOOTER ACTIONS */}
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
                        {isSubmitting ? "Đang xử lý..." : "Bắt đầu nhập"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
