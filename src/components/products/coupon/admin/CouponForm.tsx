"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import FormField from "@/components/shared/ui/forms/FormField";
import SingleSelectEnhanced from "@/components/shared/ui/forms/SingleSelectEnhanced";
import Modal from "@/components/shared/ui/feedback/Modal";
import { CouponType } from "./types";

interface CouponFormProps {
    show: boolean;
    initialData?: any;
    onSubmit: (data: any) => void;
    onCancel: () => void;
    apiErrors?: any;
    loading?: boolean;
}

export default function CouponForm({ show, initialData, onSubmit, onCancel, apiErrors, loading }: CouponFormProps) {
    const formTitle = initialData ? "Chỉnh sửa mã khuyến mãi" : "Thêm mã khuyến mãi mới";

    const { register, handleSubmit, reset, watch, control, setError, formState: { errors, isSubmitting } } = useForm({
        defaultValues: {
            code: "",
            name: "",
            description: "",
            type: CouponType.PERCENTAGE,
            value: 0,
            min_order_value: 0,
            max_discount: null,
            usage_limit: null,
            start_date: "",
            end_date: "",
            status: "active",
        },
    });

    const couponType = watch("type");

    useEffect(() => {
        if (show) {
            if (initialData) {
                reset({
                    code: initialData.code || "",
                    name: initialData.name || "",
                    description: initialData.description || "",
                    type: initialData.type || CouponType.PERCENTAGE,
                    value: initialData.value || 0,
                    min_order_value: initialData.min_order_value || 0,
                    max_discount: initialData.max_discount || null,
                    usage_limit: initialData.usage_limit || null,
                    start_date: initialData.start_date ? new Date(initialData.start_date).toISOString().split('T')[0] : "",
                    end_date: initialData.end_date ? new Date(initialData.end_date).toISOString().split('T')[0] : "",
                    status: initialData.status || "active",
                });
            } else {
                reset({
                    code: "",
                    name: "",
                    description: "",
                    type: CouponType.PERCENTAGE,
                    value: 0,
                    min_order_value: 0,
                    max_discount: null,
                    usage_limit: null,
                    start_date: "",
                    end_date: "",
                    status: "active",
                });
            }
        }
    }, [initialData, show, reset]);

    useEffect(() => {
        if (apiErrors) {
            Object.keys(apiErrors).forEach((key) => {
                const message = Array.isArray(apiErrors[key]) ? apiErrors[key][0] : String(apiErrors[key]);
                setError(key as any, { message });
            });
        }
    }, [apiErrors, setError]);

    const couponTypeOptions = [
        { value: CouponType.PERCENTAGE, label: "Phần trăm (%)" },
        { value: CouponType.FIXED_AMOUNT, label: "Số tiền cố định (VND)" },
        { value: CouponType.FREE_SHIPPING, label: "Miễn phí vận chuyển" },
    ];

    const statusOptions = [
        { value: "active", label: "Hoạt động" },
        { value: "inactive", label: "Vô hiệu" },
    ];

    const handleFormSubmit = (data: any) => {
        // Chuyển đổi các trường ngày tháng rỗng thành null
        const processedData = {
            ...data,
            start_date: data.start_date && data.start_date.trim() !== "" ? data.start_date : null,
            end_date: data.end_date && data.end_date.trim() !== "" ? data.end_date : null,
        };
        onSubmit(processedData);
    };

    if (!show) return null;

    return (
        <Modal
            show={show}
            onClose={onCancel}
            title={formTitle}
            size="xl"
            loading={loading || isSubmitting}
        >
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8 p-1">
                {/* SECTION: THÔNG TIN CƠ BẢN */}
                <section className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">
                    <header className="flex items-center space-x-3 mb-2">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 7l5 5" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Thông tin mã khuyến mãi</h3>
                            <p className="text-xs text-gray-500">Mã định danh và tên chương trình</p>
                        </div>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-1">
                            <FormField
                                label="Mã khuyến mãi"
                                {...register("code")}
                                placeholder="VÍ DỤ: GIAM20, TET2024..."
                                error={errors.code?.message}
                                required
                                helpText="Mã này khách hàng sẽ nhập khi thanh toán"
                            />
                        </div>
                        <div className="md:col-span-1">
                            <FormField
                                label="Tên chương trình"
                                {...register("name")}
                                placeholder="Tên hiển thị cho chương trình"
                                error={errors.name?.message}
                                required
                            />
                        </div>
                        <div className="md:col-span-2">
                            <FormField
                                label="Mô tả"
                                type="textarea"
                                rows={2}
                                {...register("description")}
                                placeholder="Mô tả ngắn về chương trình khuyến mãi..."
                                error={errors.description?.message}
                            />
                        </div>
                    </div>
                </section>

                {/* SECTION: CẤU HÌNH GIẢM GIÁ */}
                <section className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">
                    <header className="flex items-center space-x-3 mb-2">
                        <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Cấu hình giảm giá</h3>
                            <p className="text-xs text-gray-500">Loại giảm, giá trị và điều kiện áp dụng</p>
                        </div>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Controller
                            name="type"
                            control={control}
                            render={({ field }) => (
                                <SingleSelectEnhanced
                                    {...field}
                                    label="Loại giảm giá"
                                    options={couponTypeOptions}
                                    placeholder="Chọn loại giảm giá..."
                                    error={errors.type?.message}
                                    required
                                />
                            )}
                        />
                        <FormField
                            label={couponType === CouponType.PERCENTAGE ? "Giá trị giảm (%)" : "Giá trị giảm (VND)"}
                            type="number"
                            {...register("value")}
                            error={errors.value?.message}
                            disabled={couponType === CouponType.FREE_SHIPPING}
                            required={couponType !== CouponType.FREE_SHIPPING}
                            placeholder="Nhập giá trị"
                        />
                        <FormField
                            label="Giá trị đơn hàng tối thiểu"
                            type="number"
                            {...register("min_order_value")}
                            error={errors.min_order_value?.message}
                            placeholder="0"
                        />
                        <FormField
                            label="Giá trị giảm tối đa (VND)"
                            type="number"
                            {...register("max_discount")}
                            error={errors.max_discount?.message}
                            disabled={couponType !== CouponType.PERCENTAGE}
                            placeholder="Không giới hạn"
                        />
                    </div>
                </section>

                {/* SECTION: GIỚI HẠN & THỜI GIAN */}
                <section className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">
                    <header className="flex items-center space-x-3 mb-2">
                        <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Giới hạn & Thời gian</h3>
                            <p className="text-xs text-gray-500">Thời gian hiệu lực và số lần sử dụng</p>
                        </div>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            label="Giới hạn sử dụng"
                            type="number"
                            {...register("usage_limit")}
                            error={errors.usage_limit?.message}
                            placeholder="Không giới hạn"
                        />
                        <Controller
                            name="status"
                            control={control}
                            render={({ field }) => (
                                <SingleSelectEnhanced
                                    {...field}
                                    label="Trạng thái"
                                    options={statusOptions}
                                    placeholder="Chọn trạng thái..."
                                    error={errors.status?.message}
                                    required
                                />
                            )}
                        />
                        <FormField
                            label="Ngày bắt đầu"
                            type="date"
                            {...register("start_date")}
                            error={errors.start_date?.message}
                        />
                        <FormField
                            label="Ngày kết thúc"
                            type="date"
                            {...register("end_date")}
                            error={errors.end_date?.message}
                        />
                    </div>
                </section>

                {/* FOOTER ACTIONS */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-8 py-3 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all active:scale-95"
                    >
                        Hủy bỏ
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting || loading}
                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                    >
                        {isSubmitting ? "Đang xử lý..." : initialData ? "Cập nhật mã" : "Thêm mã mới"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
