"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Modal from "@/components/ui/feedback/Modal";
import FormField from "@/components/ui/forms/FormField";
import SearchableSelect from "@/components/ui/forms/SearchableSelect";
import ImageUploader from "@/components/ui/forms/ImageUploader";
import SingleSelectEnhanced from "@/components/ui/forms/SingleSelectEnhanced";
import apiClient from "@/lib/api/client";
import { adminEndpoints } from "@/lib/api/endpoints";
import { TrashIcon, PlusIcon } from "lucide-react";
import { useToastContext } from "@/contexts/ToastContext";

// --- Schema Definition ---
const schema = z.object({
  product_id: z.coerce.number().min(1, "Sản phẩm là bắt buộc"),
  name: z.string().min(1, "Tên là bắt buộc").max(255, "Tên tối đa 255 ký tự"),
  slug: z.string().max(255, "Slug tối đa 255 ký tự").optional().nullable(),
  sku: z.string().min(1, "SKU là bắt buộc").max(100, "SKU tối đa 100 ký tự"),
  price: z.string().min(1, "Giá là bắt buộc"),
  sale_price: z.string().optional().nullable(),
  cost_price: z.string().optional().nullable(),
  stock_quantity: z.coerce.number().min(0, "Tồn kho không được âm"),
  weight: z.string().optional().nullable(),
  image: z.string().max(500, "Image URL tối đa 500 ký tự").optional().nullable(),
  status: z.enum(["active", "inactive"]).optional().nullable(),
  attributes: z
    .array(
      z.object({
        id: z.any().optional(),
        product_attribute_id: z.coerce.number().min(1, "Chọn thuộc tính"),
        product_attribute_value_id: z.coerce.number().min(1, "Chọn giá trị"),
      })
    )
    .optional(),
});

type FormValues = z.infer<typeof schema>;

// --- Interfaces ---
interface ProductVariant {
  id?: number;
  product_id?: number;
  name?: string;
  slug?: string;
  sku?: string;
  price?: string;
  sale_price?: string;
  cost_price?: string;
  stock_quantity?: number;
  weight?: string;
  image?: string;
  is_active?: boolean;
  status?: string;
  attributes?: Array<{
    id?: string | number;
    product_attribute_id: string | number;
    product_attribute_value_id: string | number;
  }>;
}

interface ProductVariantFormProps {
  show: boolean;
  variant?: ProductVariant | null;
  apiErrors?: Record<string, string | string[]>;
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
}

export default function ProductVariantForm({
  show,
  variant,
  apiErrors = {},
  onSubmit,
  onCancel,
}: ProductVariantFormProps) {
  const isEdit = !!variant?.id;
  const { showError } = useToastContext();

  // State to control the loading sequence
  // "Pending" -> "AttributesLoaded" (We know attributes are reachable/ready) -> Form Populated
  const [attributesReady, setAttributesReady] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      product_id: 0,
      name: "",
      sku: "",
      price: "",
      stock_quantity: 0,
      status: "active",
      attributes: [],
      image: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "attributes",
  });

  const watchedAttributes = watch("attributes");

  // 1. SEQUENCE CONTROL: Load Attributes API First
  useEffect(() => {
    if (!show) {
      setAttributesReady(false);
      return;
    }

    const initSequence = async () => {
      setLoadingInitial(true);
      try {
        // We fetch the attributes list mainly to ensure the API is responsive
        // and to mimic the "Load Attributes First" flow requested.
        await apiClient.get(adminEndpoints.productAttributes.simple, {
          params: { limit: 10 }
        });
      } catch (error) {
        console.error("Failed to init attributes", error);
        // We prefer not to block the UI entirely, but we warn
        // showError("Lỗi tải thông tin thuộc tính");
      } finally {
        setAttributesReady(true);
        setLoadingInitial(false);
      }
    };

    initSequence();
  }, [show]);

  // 2. POPULATE FORM: Only after Attributes are Ready
  // Track if we have already initialized the form for the current session/variant
  const [hasInitialized, setHasInitialized] = useState(false);

  // Reset initialization state when modal closes or variant ID changes
  useEffect(() => {
    if (!show) {
      setHasInitialized(false);
    }
  }, [show, variant?.id]);

  // 2. POPULATE FORM: Only after Attributes are Ready and Not Initialized
  useEffect(() => {
    // If not ready, or already initialized for this variant, skip
    if (!show || !attributesReady || hasInitialized) {
      return;
    }

    if (variant) {
      const resetData = {
        product_id: variant.product_id || 0,
        name: variant.name || "",
        slug: variant.slug || "",
        sku: variant.sku || "",
        price: String(variant.price || ""),
        sale_price: variant.sale_price ? String(variant.sale_price) : "",
        cost_price: variant.cost_price ? String(variant.cost_price) : "",
        stock_quantity: variant.stock_quantity || 0,
        weight: variant.weight || "",
        image: variant.image || "",
        status: (variant.status as any) || (variant.is_active === false ? "inactive" : "active"),
        attributes: variant.attributes?.map((a) => ({
          id: a.id,
          product_attribute_id: Number(a.product_attribute_id),
          product_attribute_value_id: Number(a.product_attribute_value_id),
        })) || [],
      };
      reset(resetData);
    } else {
      reset({
        product_id: 0,
        name: "",
        slug: "",
        sku: "",
        price: "",
        stock_quantity: 0,
        status: "active",
        attributes: [],
        image: "",
      });
    }

    setHasInitialized(true);
  }, [show, attributesReady, variant, hasInitialized, reset]);

  // Handle API Errors
  useEffect(() => {
    if (!apiErrors) return;
    Object.keys(apiErrors).forEach((key) => {
      setError(key as any, { message: Array.isArray(apiErrors[key]) ? apiErrors[key][0] : String(apiErrors[key]) });
    });
  }, [apiErrors, setError]);

  const handleFormSubmit = (data: FormValues) => {
    console.log("[ProductVariantForm] Valid Submit:", data);
    onSubmit?.(data);
  };

  const handleFormErrors = (errors: any) => {
    console.log("[ProductVariantForm] Validation Errors:", errors);
  };

  if (!show) return null;

  return (
    <Modal
      show={show}
      onClose={onCancel || (() => { })}
      title={isEdit ? "Cập nhật biến thể" : "Thêm biến thể mới"}
      size="xl"
      // We show loading state on the modal if we are initializing or submitting
      loading={isSubmitting || loadingInitial}
    >
      <form onSubmit={handleSubmit(handleFormSubmit, handleFormErrors)} className="space-y-6">
        {/* Product & SKU */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-1 md:col-span-2">
            <Controller
              control={control}
              name="product_id"
              render={({ field }) => (
                <SearchableSelect
                  value={field.value}
                  searchApi={adminEndpoints.products.list}
                  labelField="name"
                  placeholder="Chọn sản phẩm..."
                  disabled={isEdit}
                  label="Sản phẩm"
                  required
                  error={errors.product_id?.message}
                  onChange={(val) => field.onChange(Number(val))}
                />
              )}
            />
          </div>

          <FormField label="SKU" {...register("sku")} error={errors.sku?.message} required />
          <FormField label="Tên biến thể" {...register("name")} error={errors.name?.message} required />
        </div>

        {/* Pricing & Stock */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg">
          <FormField label="Giá bán" {...register("price")} error={errors.price?.message} required placeholder="0" />
          <FormField label="Giá khuyến mãi" {...register("sale_price")} error={errors.sale_price?.message} placeholder="0" />
          <FormField label="Giá vốn" {...register("cost_price")} error={errors.cost_price?.message} placeholder="0" />
          <FormField label="Tồn kho" type="number" {...register("stock_quantity")} error={errors.stock_quantity?.message} required />
        </div>

        {/* Extra Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Cân nặng (ví dụ: 500g)" {...register("weight")} error={errors.weight?.message} />
          <div className="w-full">
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <SingleSelectEnhanced
                  label="Trạng thái"
                  options={[
                    { value: "active", label: "Hoạt động" },
                    { value: "inactive", label: "Ngừng hoạt động" },
                  ]}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.status?.message}
                />
              )}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5 text-gray-700">Ảnh đại diện</label>
          <Controller
            control={control}
            name="image"
            render={({ field }) => (
              <ImageUploader
                value={field.value}
                onChange={(val) => field.onChange(val)}
                name={field.name}
              />
            )}
          />
          {errors.image?.message && (
            <p className="mt-1.5 text-sm text-red-500">{errors.image.message}</p>
          )}
        </div>

        {/* Attributes Section */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-800">Thuộc tính biến thể</h3>
            <button
              type="button"
              onClick={() => append({ product_attribute_id: 0, product_attribute_value_id: 0 })}
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              <PlusIcon className="w-4 h-4" />
              Thêm thuộc tính
            </button>
          </div>

          <div className="space-y-3">
            {/* Show a clear message if we are waiting for the sequence to allow rendering attributes safely */}
            {!attributesReady && (
              <div className="text-sm text-gray-400 py-2 italic text-center">Đang tải cấu hình thuộc tính...</div>
            )}

            {attributesReady && fields.map((field, index) => {
              // Get current attribute selection to filter values
              const currentAttrId = watchedAttributes?.[index]?.product_attribute_id;

              // Only construct the value search API if we have a valid attribute ID
              const valueSearchApi = currentAttrId
                ? adminEndpoints.productAttributeValues.byAttribute(currentAttrId)
                : "";

              return (
                <div key={field.id} className="flex gap-3 items-end p-3 bg-gray-50 border border-gray-100 rounded-md">
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 mb-1 block">Thuộc tính</label>
                    <Controller
                      control={control}
                      name={`attributes.${index}.product_attribute_id` as const}
                      render={({ field: controllerField }) => (
                        <SearchableSelect
                          value={controllerField.value}
                          searchApi={adminEndpoints.productAttributes.simple}
                          labelField="name"
                          placeholder="Chọn thuộc tính..."
                          onChange={(val) => {
                            controllerField.onChange(Number(val));
                            // When attribute changes, reset value to 0 to prevent mismatch
                            setValue(`attributes.${index}.product_attribute_value_id`, 0);
                          }}
                          error={errors.attributes?.[index]?.product_attribute_id?.message}
                        />
                      )}
                    />
                  </div>

                  <div className="flex-1">
                    <label className="text-xs text-gray-500 mb-1 block">Giá trị</label>
                    <Controller
                      control={control}
                      name={`attributes.${index}.product_attribute_value_id` as const}
                      render={({ field: controllerField }) => (
                        <SearchableSelect
                          value={controllerField.value}
                          searchApi={valueSearchApi}
                          placeholder={currentAttrId ? "Chọn giá trị..." : "Chọn thuộc tính trước"}
                          disabled={!currentAttrId}
                          onChange={(val) => controllerField.onChange(Number(val))}
                          error={errors.attributes?.[index]?.product_attribute_value_id?.message}
                        />
                      )}
                    />
                  </div>

                  <div className="pt-7">
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-red-500 hover:text-red-700 p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                      title="Xóa thuộc tính này"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}

            {attributesReady && fields.length === 0 && (
              <div className="text-sm text-gray-400 text-center py-4 border border-dashed rounded-md">
                Chưa có thuộc tính nào được chọn.
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            disabled={isSubmitting || loadingInitial}
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {isEdit ? "Cập nhật biến thể" : "Tạo biến thể mới"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
