"use client";

import { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Modal from "@/components/shared/ui/feedback/Modal";
import FormField from "@/components/shared/ui/forms/FormField";

const shippingMethodSchema = z.object({
  name: z
    .string()
    .min(1, "Tên phương thức là bắt buộc")
    .max(191, "Tên không được vượt quá 191 ký tự"),
  code: z
    .string()
    .min(1, "Mã là bắt buộc")
    .max(100, "Mã không được vượt quá 100 ký tự")
    .regex(
      /^[A-Z0-9_]+$/,
      "Mã chỉ được chứa A-Z, 0-9, dấu gạch dưới và viết hoa"
    ),
  cost: z
    .union([z.coerce.number().nonnegative(), z.nan()])
    .optional()
    .nullable(),
  description: z.string().optional().nullable(),
  status: z.enum(["active", "inactive"]).default("active"),
});

export type ShippingMethodFormValues = z.infer<typeof shippingMethodSchema>;

const getBasicStatusArray = () => [
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Ngừng hoạt động" },
];

export interface ShippingMethod {
  id?: number;
  name?: string;
  code?: string;
  status?: "active" | "inactive";
  description?: string | null;
  price?: string | null; // Decimal từ DB (string)
  cost?: number | null; // Number cho form input
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

interface ShippingMethodFormProps {
  show: boolean;
  shippingMethod?: ShippingMethod | null;
  apiErrors?: Record<string, string | string[]>;
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
}

export default function ShippingMethodForm({
  show,
  shippingMethod,
  apiErrors = {},
  onSubmit,
  onCancel,
}: ShippingMethodFormProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ShippingMethodFormValues>({
    resolver: zodResolver(shippingMethodSchema),
    defaultValues: {
      name: "",
      code: "",
      cost: undefined,
      description: "",
      status: "active",
    },
  });

  const statusOptions = useMemo(() => getBasicStatusArray(), []);

  useEffect(() => {
    if (show) {
      if (shippingMethod) {
        // Parse price (string) từ DB thành cost (number) cho form
        const costValue = shippingMethod.price
          ? parseFloat(shippingMethod.price)
          : shippingMethod.cost ?? undefined;
        
        reset({
          name: shippingMethod.name || "",
          code: shippingMethod.code || "",
          cost: typeof costValue === "number" && !isNaN(costValue) ? costValue : undefined,
          description: shippingMethod.description || "",
          status: shippingMethod.status || "active",
        });
      } else {
        reset({
          name: "",
          code: "",
          cost: undefined,
          description: "",
          status: "active",
        });
      }
    }
  }, [shippingMethod, show, reset]);

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

  const formTitle = shippingMethod
    ? "Chỉnh sửa phương thức vận chuyển"
    : "Thêm phương thức vận chuyển";

  if (!show) return null;

  const handleInternalSubmit = (data: ShippingMethodFormValues) => {
    const payload: any = {
      name: data.name,
      code: data.code.toUpperCase(),
      description: data.description || undefined,
      status: data.status,
      cost:
        data.cost && !Number.isNaN(data.cost)
          ? Number(data.cost)
          : undefined,
    };

    // Remove undefined values
    Object.keys(payload).forEach((key) => {
      if (payload[key] === undefined) {
        delete payload[key];
      }
    });

    onSubmit?.(payload);
  };

  return (
    <Modal
      show={show}
      onClose={onCancel || (() => {})}
      title={formTitle}
      size="lg"
      loading={isSubmitting}
    >
      <form
        onSubmit={handleSubmit(handleInternalSubmit)}
        className="space-y-6 p-1"
      >
        <section className="space-y-6 rounded-2xl border border-gray-100 bg-gray-50/50 p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              label="Tên phương thức"
              {...register("name")}
              placeholder="Giao hàng tiêu chuẩn"
              error={errors.name?.message}
              required
            />
            <FormField
              label="Mã"
              {...register("code")}
              placeholder="STANDARD, EXPRESS..."
              error={errors.code?.message}
              helpText="Viết hoa, không dấu, không khoảng trắng. Ví dụ: STANDARD, EXPRESS"
              required
              disabled={!!shippingMethod?.id}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              label="Chi phí vận chuyển (VND)"
              type="number"
              {...register("cost")}
              placeholder="Ví dụ: 60000"
              error={errors.cost?.message}
              helpText="Chi phí vận chuyển cơ bản (sẽ được lưu thành 'price' trong DB)"
            />
            <Controller
              name="status"
              control={control}
              render={({ field: { value, onChange } }) => (
                <FormField
                  label="Trạng thái"
                  required
                  type="select"
                  value={value}
                  onChange={onChange}
                  options={statusOptions}
                  error={errors.status?.message}
                />
              )}
            />
          </div>

          <FormField
            label="Mô tả"
            type="textarea"
            rows={3}
            {...register("description")}
            placeholder="Ví dụ: Giao hàng trong 24-48h"
            error={errors.description?.message}
          />
        </section>

        <div className="flex justify-end space-x-4 border-t border-gray-100 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 active:scale-95"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-2 text-sm font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg active:scale-95 disabled:pointer-events-none disabled:opacity-50"
          >
            {isSubmitting
              ? "Đang xử lý..."
              : shippingMethod
              ? "Cập nhật phương thức"
              : "Thêm phương thức"}
          </button>
        </div>
      </form>
    </Modal>
  );
}




