"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Modal from "@/components/UI/Feedback/Modal";
import FormField from "@/components/UI/Forms/FormField";
import ImageUploader from "@/components/UI/Forms/ImageUploader";
import MultipleImageUploader from "@/components/UI/Forms/MultipleImageUploader";
import CKEditor from "@/components/UI/Forms/CKEditor";
import SingleSelectEnhanced from "@/components/UI/Forms/SingleSelectEnhanced";
import MultipleSelect from "@/components/UI/Forms/MultipleSelect";
import { userEndpoints, adminEndpoints } from "@/lib/api/endpoints";
import api from "@/lib/api/client";

// Product Schema
const productSchema = z.object({
  name: z
    .string()
    .min(3, "Tên sản phẩm tối thiểu 3 ký tự")
    .max(255, "Tên sản phẩm tối đa 255 ký tự")
    // Allow Vietnamese (Unicode letters), numbers, spaces, hyphen, underscore
    .regex(/^[\p{L}\p{N}\s\-_]+$/u, "Tên chỉ được chứa chữ, số, khoảng trắng, dấu gạch ngang và gạch dưới"),
  slug: z
    .string()
    .max(255, "Slug tối đa 255 ký tự")
    .regex(/^[a-z0-9\-]+$/, "Slug chỉ được chứa chữ thường, số và dấu gạch ngang")
    .optional()
    .nullable()
    .or(z.literal("")),
  sku: z
    .string()
    .min(3, "SKU tối thiểu 3 ký tự")
    .max(100, "SKU tối đa 100 ký tự")
    .regex(/^[a-zA-Z0-9\-_]+$/, "SKU chỉ được chứa chữ, số, dấu gạch ngang và gạch dưới"),
  description: z.string().max(10000, "Mô tả tối đa 10000 ký tự").optional().nullable().or(z.literal("")),
  short_description: z.string().max(500, "Mô tả ngắn tối đa 500 ký tự").optional().nullable().or(z.literal("")),
  min_stock_level: z.coerce.number().int().min(0, "Mức tồn kho tối thiểu không được âm").max(9999, "Mức tồn kho tối đa 9999").default(0),
  image: z.string().url("URL hình ảnh không hợp lệ").max(500, "URL tối đa 500 ký tự").optional().nullable().or(z.literal("")),
  gallery: z.array(z.string()).default([]),
  status: z.enum(["active", "inactive", "draft", "archived"]).default("active"),
  category_ids: z.array(z.string()).default([]),
  is_featured: z.boolean().default(false),
  is_variable: z.boolean().default(true),
  is_digital: z.boolean().default(false),
  download_limit: z.coerce.number().int().min(0, "Giới hạn tải xuống không được âm").max(1000, "Giới hạn tải xuống tối đa 1000").optional().nullable(),
  meta_title: z.string().max(255, "Meta Title tối đa 255 ký tự").optional().nullable().or(z.literal("")),
  meta_description: z.string().max(500, "Meta Description tối đa 500 ký tự").optional().nullable().or(z.literal("")),
  canonical_url: z.string().url("URL không hợp lệ").max(500, "URL tối đa 500 ký tự").optional().nullable().or(z.literal("")),
  og_title: z.string().max(255, "OG Title tối đa 255 ký tự").optional().nullable().or(z.literal("")),
  og_description: z.string().max(500, "OG Description tối đa 500 ký tự").optional().nullable().or(z.literal("")),
  og_image: z.string().url("URL không hợp lệ").max(500, "URL tối đa 500 ký tự").optional().nullable().or(z.literal("")),
});

type ProductFormValues = z.infer<typeof productSchema>;

const getProductStatusArray = () => [
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Ngừng hoạt động" },
  { value: "draft", label: "Bản nháp" },
  { value: "archived", label: "Lưu trữ" },
];

interface Product {
  id?: string | number;
  name?: string;
  slug?: string;
  sku?: string;
  description?: string;
  short_description?: string;
  min_stock_level?: number;
  image?: string | null;
  gallery?: string[];
  status?: string;
  category_ids?: string[];
  categories?: Array<{ id: string | number; name: string }>;
  is_featured?: boolean;
  is_variable?: boolean;
  is_digital?: boolean;
  download_limit?: number | null;
  meta_title?: string;
  meta_description?: string;
  canonical_url?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
}

interface ProductFormProps {
  show: boolean;
  product?: Product | null;
  statusEnums?: Array<{ value: string; label?: string; name?: string }>;
  apiErrors?: Record<string, string | string[]>;
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
}

export default function ProductForm({
  show,
  product,
  statusEnums = [],
  apiErrors = {},
  onSubmit,
  onCancel,
}: ProductFormProps) {
  const [categoryOptions, setCategoryOptions] = useState<Array<{ value: string; label: string }>>([]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      slug: "",
      sku: "",
      description: "",
      short_description: "",
      min_stock_level: 0,
      image: "",
      gallery: [],
      status: "active",
      category_ids: [],
      is_featured: false,
      is_variable: true,
      is_digital: false,
      download_limit: null,
      meta_title: "",
      meta_description: "",
      canonical_url: "",
      og_title: "",
      og_description: "",
      og_image: "",
    },
  });

  const isDigital = watch("is_digital");

  const statusOptions = useMemo(() => {
    const statusArray =
      statusEnums && statusEnums.length > 0 ? statusEnums : getProductStatusArray();
    return statusArray.map((opt) => ({
      value: opt.value,
      label: opt.label || (opt as any).name || opt.value,
    }));
  }, [statusEnums]);

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await api.get(adminEndpoints.productCategories.simple);
        const categories = response.data?.data || response.data || [];
        setCategoryOptions(
          categories.map((cat: any) => ({
            value: String(cat.id),
            label: cat.name,
          }))
        );
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    };
    if (show) {
      loadCategories();
    }
  }, [show]);

  // Reset form when product changes
  useEffect(() => {
    if (show) {
      if (product) {
        const categoryIds = product.category_ids || product.categories?.map((c) => String(c.id)) || [];
        const gallery = product.gallery || [];
        reset({
          name: product.name || "",
          slug: product.slug || "",
          sku: product.sku || "",
          description: product.description || "",
          short_description: product.short_description || "",
          min_stock_level: product.min_stock_level || 0,
          image: product.image || "",
          gallery: gallery,
          status: (product.status as "active" | "inactive" | "draft" | "archived") || "active",
          category_ids: categoryIds,
          is_featured: product.is_featured || false,
          is_variable: product.is_variable !== undefined ? product.is_variable : true,
          is_digital: product.is_digital || false,
          download_limit: product.download_limit || null,
          meta_title: product.meta_title || "",
          meta_description: product.meta_description || "",
          canonical_url: product.canonical_url || "",
          og_title: product.og_title || "",
          og_description: product.og_description || "",
          og_image: product.og_image || "",
        });
      } else {
        reset({
          name: "",
          slug: "",
          sku: "",
          description: "",
          short_description: "",
          min_stock_level: 0,
          image: "",
          gallery: [],
          status: "active",
          category_ids: [],
          is_featured: false,
          is_variable: true,
          is_digital: false,
          download_limit: null,
          meta_title: "",
          meta_description: "",
          canonical_url: "",
          og_title: "",
          og_description: "",
          og_image: "",
        });
      }
    }
  }, [product, show, reset]);

  // Map API Errors
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

  // Auto-generate slug from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setValue("slug", slug);
  };


  const formTitle = product ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới";

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
        {/* SECTION: THÔNG TIN CƠ BẢN */}
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Thông tin cơ bản
              </h3>
              <p className="text-xs text-gray-500">
                Tên, mô tả và thông tin chính của sản phẩm
              </p>
            </div>
          </header>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <FormField
                label="Tên sản phẩm"
                {...register("name", { onChange: handleNameChange })}
                placeholder="Ví dụ: Áo thun nam"
                error={errors.name?.message}
                required
              />
            </div>

            <FormField
              label="Slug (URL)"
              {...register("slug")}
              placeholder="Tự động tạo từ tên sản phẩm"
              error={errors.slug?.message}
              helpText="URL thân thiện với SEO, tự động tạo nếu để trống"
            />

            <FormField
              label="Mã SKU"
              {...register("sku")}
              placeholder="Ví dụ: ATN001"
              error={errors.sku?.message}
              required
            />

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Mô tả ngắn
              </label>
              <FormField
                type="textarea"
                rows={3}
                {...register("short_description")}
                placeholder="Mô tả ngắn về sản phẩm..."
                error={errors.short_description?.message}
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Mô tả chi tiết
              </label>
              <Controller
                name="description"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CKEditor
                    value={value || ""}
                    onChange={onChange}
                    height="300px"
                    placeholder="Nhập mô tả chi tiết về sản phẩm..."
                    uploadUrl={userEndpoints.uploads.image}
                  />
                )}
              />
              {errors.description && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* SECTION: HÌNH ẢNH */}
        <section className="space-y-6 rounded-2xl border border-gray-100 bg-gray-50/50 p-6">
          <header className="mb-2 flex items-center space-x-3">
            <div className="rounded-lg bg-purple-100 p-2 text-purple-600">
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
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Hình ảnh</h3>
              <p className="text-xs text-gray-500">
                Hình ảnh chính và thư viện hình ảnh sản phẩm
              </p>
            </div>
          </header>

          <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-6">
            <label className="mb-4 self-start text-sm font-semibold text-gray-700">
              Hình ảnh chính
            </label>
            <Controller
              name="image"
              control={control}
              render={({ field: { value, onChange } }) => (
                <ImageUploader value={value} onChange={onChange} />
              )}
            />
            {errors.image && (
              <p className="mt-2 text-xs text-red-500">
                {errors.image.message}
              </p>
            )}
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <Controller
              name="gallery"
              control={control}
              render={({ field: { value, onChange } }) => (
                <MultipleImageUploader
                  value={value || []}
                  onChange={onChange}
                  label="Thư viện hình ảnh"
                  helpText="Có thể upload nhiều ảnh cùng lúc. Tối đa 10 ảnh, mỗi ảnh tối đa 10MB"
                  error={errors.gallery?.message}
                />
              )}
            />
          </div>
        </section>

        {/* SECTION: DANH MỤC */}
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
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Danh mục</h3>
              <p className="text-xs text-gray-500">
                Chọn danh mục sản phẩm cho sản phẩm này
              </p>
            </div>
          </header>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Danh mục sản phẩm
            </label>
            <Controller
              name="category_ids"
              control={control}
              render={({ field: { value, onChange } }) => (
                <MultipleSelect
                  value={value || []}
                  options={categoryOptions}
                  label="Chọn danh mục"
                  placeholder="Chọn một hoặc nhiều danh mục..."
                  onChange={(val) => onChange(val)}
                />
              )}
            />
            {errors.category_ids && (
              <p className="mt-1 text-xs text-red-500">
                {errors.category_ids.message}
              </p>
            )}
          </div>
        </section>

        {/* SECTION: TỒN KHO & CÀI ĐẶT */}
        <section className="space-y-6 rounded-2xl border border-gray-100 bg-gray-50/50 p-6">
          <header className="mb-2 flex items-center space-x-3">
            <div className="rounded-lg bg-orange-100 p-2 text-orange-600">
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
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Tồn kho & Cài đặt
              </h3>
              <p className="text-xs text-gray-500">
                Quản lý tồn kho và các cài đặt sản phẩm
              </p>
            </div>
          </header>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              label="Mức tồn kho tối thiểu"
              type="number"
              {...register("min_stock_level")}
              error={errors.min_stock_level?.message}
              helpText="Cảnh báo khi tồn kho dưới mức này"
            />

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

            <div className="md:col-span-2 space-y-4">
              <Controller
                name="is_featured"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <FormField
                    type="checkbox"
                    checkboxLabel="Sản phẩm nổi bật"
                    value={value}
                    onChange={(e) => onChange(e.target.checked)}
                  />
                )}
              />

              <Controller
                name="is_variable"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <FormField
                    type="checkbox"
                    checkboxLabel="Sản phẩm có biến thể (màu sắc, kích thước...)"
                    value={value}
                    onChange={(e) => onChange(e.target.checked)}
                  />
                )}
              />

              <Controller
                name="is_digital"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <FormField
                    type="checkbox"
                    checkboxLabel="Sản phẩm số (file tải xuống)"
                    value={value}
                    onChange={(e) => onChange(e.target.checked)}
                  />
                )}
              />

              {isDigital && (
                <FormField
                  label="Giới hạn số lần tải xuống"
                  type="number"
                  {...register("download_limit")}
                  error={errors.download_limit?.message}
                  helpText="Để trống nếu không giới hạn (0-1000)"
                />
              )}
            </div>
          </div>
        </section>

        {/* SECTION: SEO */}
        <section className="space-y-6 rounded-2xl border border-gray-100 bg-gray-50/50 p-6">
          <header className="mb-2 flex items-center space-x-3">
            <div className="rounded-lg bg-indigo-100 p-2 text-indigo-600">
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Tối ưu SEO</h3>
              <p className="text-xs text-gray-500">
                Cấu hình thẻ Meta và URL thân thiện với Google
              </p>
            </div>
          </header>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              label="Meta Title (Tiêu đề SEO)"
              {...register("meta_title")}
              placeholder="Tiêu đề chuẩn SEO (từ 50-60 ký tự)"
              error={errors.meta_title?.message}
            />

            <FormField
              label="Canonical URL"
              {...register("canonical_url")}
              placeholder="https://yourdomain.com/san-pham"
              error={errors.canonical_url?.message}
            />

            <div className="md:col-span-2">
              <FormField
                label="Meta Description"
                type="textarea"
                rows={3}
                {...register("meta_description")}
                placeholder="Mô tả chuẩn SEO (từ 150-160 ký tự)..."
                error={errors.meta_description?.message}
              />
            </div>

            <div className="md:col-span-2 border-t border-gray-200 pt-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-4">
                Open Graph (Social Media)
              </h4>
            </div>

            <FormField
              label="OG Title"
              {...register("og_title")}
              placeholder="Tiêu đề hiển thị trên mạng xã hội"
              error={errors.og_title?.message}
            />

            <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-4">
              <label className="mb-4 self-start text-sm font-semibold text-gray-700">
                OG Image
              </label>
              <Controller
                name="og_image"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <ImageUploader value={value} onChange={onChange} />
                )}
              />
              {errors.og_image && (
                <p className="mt-2 text-xs text-red-500">
                  {errors.og_image.message}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <FormField
                label="OG Description"
                type="textarea"
                rows={2}
                {...register("og_description")}
                placeholder="Mô tả hiển thị trên mạng xã hội..."
                error={errors.og_description?.message}
              />
            </div>
          </div>
        </section>

        {/* Form Actions */}
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
              : product
              ? "Cập nhật sản phẩm"
              : "Tạo sản phẩm"}
          </button>
        </div>
      </form>
    </Modal>
  );
}



