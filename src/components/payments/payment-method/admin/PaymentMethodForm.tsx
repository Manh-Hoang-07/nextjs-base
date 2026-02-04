"use client";

import { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Modal from "@/components/shared/ui/feedback/Modal";
import FormField from "@/components/shared/ui/forms/FormField";

const paymentMethodSchema = z.object({
  name: z
    .string()
    .min(1, "Tên phương thức là bắt buộc")
    .max(191, "Tên không được vượt quá 191 ký tự"),
  code: z
    .string()
    .min(1, "Mã là bắt buộc")
    .max(100, "Mã không được vượt quá 100 ký tự")
    .regex(/^[A-Z0-9_]+$/, "Mã chỉ được chứa A-Z, 0-9, dấu gạch dưới và viết hoa"),
  type: z.enum(["online", "offline"], {
    required_error: "Loại phương thức là bắt buộc",
  }),
  description: z.string().optional().nullable(),
  status: z.enum(["active", "inactive"]).default("active"),
  config: z.string().optional().nullable(),
});

export type PaymentMethodFormValues = z.infer<typeof paymentMethodSchema>;

const getBasicStatusArray = () => [
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Ngừng hoạt động" },
];

const getPaymentTypeArray = () => [
  { value: "online", label: "Online" },
  { value: "offline", label: "Offline" },
];

export interface PaymentMethod {
  id?: number;
  name?: string;
  code?: string;
  type?: "online" | "offline";
  status?: "active" | "inactive";
  description?: string | null;
  config?: any;
}

interface PaymentMethodFormProps {
  show: boolean;
  paymentMethod?: PaymentMethod | null;
  apiErrors?: Record<string, string | string[]>;
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
}

export default function PaymentMethodForm({
  show,
  paymentMethod,
  apiErrors = {},
  onSubmit,
  onCancel,
}: PaymentMethodFormProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<PaymentMethodFormValues>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      name: "",
      code: "",
      type: "offline",
      description: "",
      status: "active",
      config: "",
    },
  });

  const statusOptions = useMemo(() => getBasicStatusArray(), []);
  const typeOptions = useMemo(() => getPaymentTypeArray(), []);

  useEffect(() => {
    if (show) {
      if (paymentMethod) {
        reset({
          name: paymentMethod.name || "",
          code: paymentMethod.code || "",
          type: paymentMethod.type || "offline",
          description: paymentMethod.description || "",
          status: paymentMethod.status || "active",
          config:
            paymentMethod.config != null
              ? (() => {
                  try {
                    return JSON.stringify(paymentMethod.config, null, 2);
                  } catch {
                    return String(paymentMethod.config);
                  }
                })()
              : "",
        });
      } else {
        reset({
          name: "",
          code: "",
          type: "offline",
          description: "",
          status: "active",
          config: "",
        });
      }
    }
  }, [paymentMethod, show, reset]);

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

  const formTitle = paymentMethod
    ? "Chỉnh sửa phương thức thanh toán"
    : "Thêm phương thức thanh toán";

  if (!show) return null;

  const handleInternalSubmit = (data: PaymentMethodFormValues) => {
    let configValue: any = undefined;
    if (data.config && data.config.trim().length > 0) {
      try {
        configValue = JSON.parse(data.config);
      } catch (e) {
        setError("config", {
          message: "Config phải là JSON hợp lệ",
        });
        return;
      }
    }

    const payload: any = {
      name: data.name,
      code: data.code.toUpperCase(),
      type: data.type,
      description: data.description,
      status: data.status,
      config: configValue,
    };

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
        <section className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Tên phương thức"
              {...register("name")}
              placeholder="Thanh toán khi nhận hàng (COD)"
              error={errors.name?.message}
              required
            />
            <FormField
              label="Mã"
              {...register("code")}
              placeholder="COD, VNPAY..."
              error={errors.code?.message}
              helpText="Viết hoa, không dấu, không khoảng trắng. Ví dụ: COD, VNPAY"
              required
              disabled={!!paymentMethod?.id}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Controller
              name="type"
              control={control}
              render={({ field: { value, onChange } }) => (
                <FormField
                  label="Loại phương thức"
                  required
                  type="select"
                  value={value}
                  onChange={onChange}
                  options={typeOptions}
                  error={errors.type?.message}
                />
              )}
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
            <FormField
              label="Mô tả ngắn"
              {...register("description")}
              placeholder="Mô tả hiển thị cho người dùng"
              error={errors.description?.message}
            />
          </div>

          <FormField
            label="Cấu hình (JSON)"
            type="textarea"
            rows={6}
            {...register("config")}
            placeholder='Ví dụ: { "vnp_TmnCode": "...", "vnp_HashSecret": "..." }'
            error={errors.config?.message}
          />
          <p className="text-xs text-gray-500">
            Tuỳ từng cổng thanh toán (VNPAY, MoMo, PAYOS, ...), bạn có thể lưu
            cấu hình chi tiết ở đây. Hệ thống backend sẽ đọc và sử dụng JSON
            này.
          </p>
        </section>

        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-all active:scale-95"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isSubmitting
              ? "Đang xử lý..."
              : paymentMethod
              ? "Cập nhật phương thức"
              : "Thêm phương thức"}
          </button>
        </div>
      </form>
    </Modal>
  );
}


