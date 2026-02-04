"use client";

import { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Modal from "@/components/shared/ui/feedback/Modal";
import FormField from "@/components/shared/ui/forms/FormField";
import SingleSelectEnhanced from "@/components/shared/ui/forms/SingleSelectEnhanced";
import { slugify } from "@/utils/string";

const productAttributeSchema = z.object({
  name: z
    .string()
    .min(1, "Tên thuộc tính là bắt buộc")
    .max(255, "Tên thuộc tính không được vượt quá 255 ký tự"),
  code: z
    .string()
    .max(100, "Mã thuộc tính không được vượt quá 100 ký tự")
    .optional()
    .nullable(),
  description: z.string().optional().nullable(),
  type: z
    .enum(["text", "select", "multiselect", "color", "image"], {
      errorMap: () => ({ message: "Loại thuộc tính không hợp lệ" }),
    })
    .default("text"),
  default_value: z.string().optional().nullable(),
  is_required: z.boolean().default(true),
  is_variation: z.boolean().default(false),
  is_filterable: z.boolean().default(true),
  is_visible_on_frontend: z.boolean().default(true),
  sort_order: z.coerce.number().int().min(0, "Thứ tự không được âm").default(0),
  status: z.string().min(1, "Trạng thái là bắt buộc").default("active"),
  validation_rules: z.string().optional().nullable(),
});

type ProductAttributeFormValues = z.infer<typeof productAttributeSchema>;

const getBasicStatusArray = () => [
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Ngừng hoạt động" },
];

const getAttributeTypeArray = () => [
  { value: "text", label: "Văn bản" },
  { value: "select", label: "Chọn một" },
  { value: "multiselect", label: "Chọn nhiều" },
  { value: "color", label: "Màu sắc" },
  { value: "image", label: "Hình ảnh" },
];

interface ProductAttribute {
  id?: string | number;
  name?: string;
  code?: string;
  description?: string;
  type?: string;
  default_value?: string | null;
  is_required?: boolean;
  is_variation?: boolean;
  is_filterable?: boolean;
  is_visible_on_frontend?: boolean;
  sort_order?: number;
  status?: string;
  validation_rules?: string | null;
}

interface ProductAttributeFormProps {
  show: boolean;
  attribute?: ProductAttribute | null;
  statusEnums?: Array<{ value: string; label?: string; name?: string }>;
  apiErrors?: Record<string, string | string[]>;
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
}

export default function ProductAttributeForm({
  show,
  attribute,
  statusEnums = [],
  apiErrors = {},
  onSubmit,
  onCancel,
}: ProductAttributeFormProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductAttributeFormValues>({
    resolver: zodResolver(productAttributeSchema),
    defaultValues: {
      name: "",
      code: "",
      description: "",
      type: "text",
      default_value: "",
      is_required: true,
      is_variation: false,
      is_filterable: true,
      is_visible_on_frontend: true,
      sort_order: 0,
      status: "active",
      validation_rules: "",
    },
  });

  const nameValue = watch("name");
  const codeValue = watch("code");

  // Auto-generate code from name if code is empty
  useEffect(() => {
    if (nameValue && !codeValue && !attribute?.id) {
      const generatedCode = slugify(nameValue);
      setValue("code", generatedCode);
    }
  }, [nameValue, codeValue, attribute?.id, setValue]);

  const statusOptions = useMemo(() => {
    const statusArray =
      statusEnums && statusEnums.length > 0 ? statusEnums : getBasicStatusArray();
    return statusArray.map((opt) => ({
      value: opt.value,
      label: opt.label || (opt as any).name || opt.value,
    }));
  }, [statusEnums]);

  const typeOptions = useMemo(() => {
    return getAttributeTypeArray().map((opt) => ({
      value: opt.value,
      label: opt.label,
    }));
  }, []);

  useEffect(() => {
    if (show) {
      if (attribute) {
        reset({
          name: attribute.name || "",
          code: attribute.code || "",
          description: attribute.description || "",
          type: (attribute.type as any) || "text",
          default_value: attribute.default_value || "",
          is_required: attribute.is_required ?? true,
          is_variation: attribute.is_variation ?? false,
          is_filterable: attribute.is_filterable ?? true,
          is_visible_on_frontend: attribute.is_visible_on_frontend ?? true,
          sort_order: attribute.sort_order || 0,
          status: attribute.status || "active",
          validation_rules: attribute.validation_rules || "",
        });
      } else {
        reset({
          name: "",
          code: "",
          description: "",
          type: "text",
          default_value: "",
          is_required: true,
          is_variation: false,
          is_filterable: true,
          is_visible_on_frontend: true,
          sort_order: 0,
          status: "active",
          validation_rules: "",
        });
      }
    }
  }, [attribute, show, reset]);

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

  const formTitle = attribute
    ? "Chỉnh sửa thuộc tính sản phẩm"
    : "Thêm thuộc tính sản phẩm";

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
                Thông tin thuộc tính sản phẩm
              </h3>
              <p className="text-xs text-gray-500">
                Tên, mã và cấu hình cơ bản của thuộc tính
              </p>
            </div>
          </header>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <FormField
                label="Tên thuộc tính"
                {...register("name")}
                placeholder="Ví dụ: Màu sắc, Kích thước..."
                error={errors.name?.message}
                required
              />
            </div>

            <div className="md:col-span-2">
              <FormField
                label="Mã thuộc tính"
                {...register("code")}
                placeholder="Để trống để tự động tạo từ tên (ví dụ: color, size)..."
                error={errors.code?.message}
                helpText="Mã thuộc tính dùng để tham chiếu trong code (chỉ chấp nhận chữ thường, số, dấu gạch dưới)"
              />
            </div>

            <div className="md:col-span-2">
              <FormField
                label="Mô tả"
                type="textarea"
                rows={3}
                {...register("description")}
                placeholder="Mô tả chi tiết về thuộc tính này..."
                error={errors.description?.message}
              />
            </div>

            <div>
              <Controller
                name="type"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <div className="space-y-1">
                    <label className="mb-1 block text-sm font-semibold text-gray-700">
                      Loại thuộc tính <span className="text-red-500">*</span>
                    </label>
                    <SingleSelectEnhanced
                      value={value}
                      options={typeOptions}
                      onChange={onChange}
                      placeholder="Chọn loại thuộc tính..."
                    />
                    {errors.type && (
                      <p className="text-xs text-red-500">
                        {errors.type.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>

            <div>
              <FormField
                label="Giá trị mặc định"
                {...register("default_value")}
                placeholder="Giá trị mặc định (nếu có)..."
                error={errors.default_value?.message}
              />
            </div>

            <div>
              <Controller
                name="status"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <div className="space-y-1">
                    <label className="mb-1 block text-sm font-semibold text-gray-700">
                      Trạng thái <span className="text-red-500">*</span>
                    </label>
                    <SingleSelectEnhanced
                      value={value}
                      options={statusOptions}
                      onChange={onChange}
                      placeholder="Chọn trạng thái..."
                    />
                    {errors.status && (
                      <p className="text-xs text-red-500">
                        {errors.status.message}
                      </p>
                    )}
                  </div>
                )}
              />
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

        <section className="space-y-6 rounded-2xl border border-gray-100 bg-gray-50/50 p-6">
          <header className="mb-2 flex items-center space-x-3">
            <div className="rounded-lg bg-green-100 p-2 text-green-600">
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
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Cấu hình</h3>
              <p className="text-xs text-gray-500">
                Các tùy chọn hiển thị và hành vi của thuộc tính
              </p>
            </div>
          </header>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Controller
                name="is_required"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => onChange(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Bắt buộc nhập
                    </span>
                  </label>
                )}
              />
            </div>

            <div className="flex items-center space-x-3">
              <Controller
                name="is_variation"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => onChange(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Dùng để tạo biến thể sản phẩm
                    </span>
                  </label>
                )}
              />
            </div>

            <div className="flex items-center space-x-3">
              <Controller
                name="is_filterable"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => onChange(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Có thể dùng để lọc sản phẩm
                    </span>
                  </label>
                )}
              />
            </div>

            <div className="flex items-center space-x-3">
              <Controller
                name="is_visible_on_frontend"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => onChange(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Hiển thị ở frontend
                    </span>
                  </label>
                )}
              />
            </div>
          </div>

          <div className="mt-4">
            <FormField
              label="Quy tắc validation (JSON)"
              type="textarea"
              rows={3}
              {...register("validation_rules")}
              placeholder='{"min": 1, "max": 100} hoặc để trống'
              error={errors.validation_rules?.message}
              helpText="Nhập quy tắc validation dạng JSON (tùy chọn)"
            />
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
              : attribute
              ? "Cập nhật thuộc tính"
              : "Thêm thuộc tính"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

