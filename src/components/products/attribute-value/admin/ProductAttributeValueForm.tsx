"use client";

import { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Modal from "@/components/shared/ui/feedback/Modal";
import FormField from "@/components/shared/ui/forms/FormField";
import { adminEndpoints } from "@/lib/api/endpoints";
import SingleSelectEnhanced from "@/components/shared/ui/forms/SingleSelectEnhanced";

const productAttributeValueSchema = z.object({
  attribute_id: z.coerce.number().min(1, "Thuộc tính là bắt buộc"),
  value: z
    .string()
    .min(1, "Giá trị là bắt buộc")
    .max(255, "Giá trị không được vượt quá 255 ký tự"),
  label: z.string().max(255, "Nhãn không được vượt quá 255 ký tự").optional().nullable(),
  color_code: z.string().max(100, "Mã màu không được vượt quá 100 ký tự").optional().nullable(),
  sort_order: z.coerce.number().int().min(0, "Thứ tự không được âm").default(0),
  product_variant_id: z.coerce.number().optional().nullable(),
});

type ProductAttributeValueFormValues = z.infer<typeof productAttributeValueSchema>;

interface ProductAttributeValue {
  id?: number;
  product_attribute_id?: number;
  attribute_id?: number;
  value?: string;
  label?: string | null;
  color_code?: string | null;
  sort_order?: number;
  product_variant_id?: number | null;
  attribute?: {
    id: number;
    name: string;
    code: string;
    type: string;
  };
}

interface ProductAttributeValueFormProps {
  show: boolean;
  attributeValue?: ProductAttributeValue | null;
  apiErrors?: Record<string, string | string[]>;
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
}

export default function ProductAttributeValueForm({
  show,
  attributeValue,
  apiErrors = {},
  onSubmit,
  onCancel,
}: ProductAttributeValueFormProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProductAttributeValueFormValues>({
    resolver: zodResolver(productAttributeValueSchema),
    defaultValues: {
      attribute_id: undefined,
      value: "",
      label: "",
      color_code: "",
      sort_order: 0,
      product_variant_id: null,
    },
  });

  const selectedAttributeId = watch("attribute_id");

  useEffect(() => {
    if (show) {
      if (attributeValue) {
        reset({
          attribute_id: attributeValue.product_attribute_id || attributeValue.attribute_id || undefined,
          value: attributeValue.value || "",
          label: attributeValue.label || "",
          color_code: attributeValue.color_code || "",
          sort_order: attributeValue.sort_order || 0,
          product_variant_id: attributeValue.product_variant_id || null,
        });
      } else {
        reset({
          attribute_id: undefined,
          value: "",
          label: "",
          color_code: "",
          sort_order: 0,
          product_variant_id: null,
        });
      }
    }
  }, [attributeValue, show, reset]);

  useEffect(() => {
    if (apiErrors) {
      Object.keys(apiErrors).forEach((key) => {
        const message = Array.isArray(apiErrors[key])
          ? apiErrors[key][0]
          : String(apiErrors[key]);
        setError(key as any, { message });
      });
    }
  }, [apiErrors, setError]);

  const formTitle = attributeValue
    ? "Chỉnh sửa giá trị thuộc tính"
    : "Thêm giá trị thuộc tính";

  if (!show) return null;

  return (
    <Modal
      show={show}
      onClose={onCancel || (() => {})}
      title={formTitle}
      size="xl"
      loading={isSubmitting}
    >
      <form
        onSubmit={handleSubmit((data) => onSubmit?.(data))}
        className="space-y-8 p-1"
      >
        <section className="space-y-6 rounded-2xl border border-gray-100 bg-gray-50/50 p-6">
          <header className="mb-2 flex items-center space-x-3">
            <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Thông tin giá trị thuộc tính
              </h3>
              <p className="text-xs text-gray-500">
                Cấu hình giá trị cho thuộc tính sản phẩm
              </p>
            </div>
          </header>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <Controller
                name="attribute_id"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <div className="space-y-1">
                    <label className="mb-1 block text-sm font-semibold text-gray-700">
                      Thuộc tính <span className="text-red-500">*</span>
                    </label>
                    <SingleSelectEnhanced
                      value={value}
                      searchApi={adminEndpoints.productAttributes.simple}
                      labelField="name"
                      valueField="id"
                      onChange={onChange}
                      placeholder="Chọn thuộc tính..."
                    />
                    {errors.attribute_id && (
                      <p className="text-xs text-red-500">
                        {errors.attribute_id.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>

            <div className="md:col-span-2">
              <FormField
                label="Giá trị"
                {...register("value")}
                placeholder="Ví dụ: Đỏ, XL, Cotton..."
                error={errors.value?.message}
                required
              />
            </div>

            <div className="md:col-span-2">
              <FormField
                label="Nhãn hiển thị"
                {...register("label")}
                placeholder="Nhãn hiển thị (nếu khác với giá trị)"
                error={errors.label?.message}
              />
            </div>

            <div>
              <FormField
                label="Mã màu (Hex)"
                {...register("color_code")}
                placeholder="#FF0000"
                error={errors.color_code?.message}
              />
              {selectedAttributeId && (
                <div className="mt-2 flex items-center space-x-2">
                  {watch("color_code") && (
                    <div
                      className="h-8 w-16 rounded border border-gray-300"
                      style={{
                        backgroundColor: watch("color_code") || "transparent",
                      }}
                    />
                  )}
                  <span className="text-xs text-gray-500">
                    Dùng cho thuộc tính màu sắc
                  </span>
                </div>
              )}
            </div>

            <div>
              <FormField
                label="Thứ tự hiển thị"
                type="number"
                {...register("sort_order")}
                error={errors.sort_order?.message}
              />
            </div>
          </div>
        </section>

        <div className="flex justify-end space-x-4 border-t border-gray-100 pt-6">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-gray-300 bg-white px-8 py-3 font-bold text-gray-700 transition-all hover:bg-gray-50 active:scale-95"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-3 font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5 hover:shadow-blue-500/50 active:scale-95 disabled:pointer-events-none disabled:opacity-50"
          >
            {isSubmitting
              ? "Đang xử lý..."
              : attributeValue
              ? "Cập nhật giá trị"
              : "Thêm giá trị"}
          </button>
        </div>
      </form>
    </Modal>
  );
}



