"use client";

import { useCallback, useState } from "react";
import apiClient from "@/lib/api/client";
import { publicEndpoints } from "@/lib/api/endpoints";
import { useToastContext } from "@/contexts/ToastContext";

export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
  status?: "active" | "inactive" | string;
  parent_id?: number | null;
  sort_order?: number;
  children?: ProductCategory[];
  image?: string | null;
  description?: string | null;
  [key: string]: any;
}

export interface CategoryListResponse {
  items: ProductCategory[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface GetCategoriesParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: "active" | "inactive";
  parent_id?: string | number;
  format?: "tree" | "flat";
  sort_by?: "name" | "sort_order" | "created_at";
  sort_order?: "ASC" | "DESC";
}

export interface GetCategoryBySlugParams {
  include?: string;
  include_products?: string;
  include_children?: string;
}

export interface CategoryProductsResponse<TProduct = any> {
  items: TProduct[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function useProductCategories() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { showError } = useToastContext();

  const buildQuery = (params?: Record<string, any>) => {
    const searchParams = new URLSearchParams();
    if (!params) return "";

    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;
      searchParams.set(key, String(value));
    });

    const query = searchParams.toString();
    return query ? `?${query}` : "";
  };

  const fetchCategories = useCallback(
    async (params?: GetCategoriesParams): Promise<CategoryListResponse | null> => {
      try {
        setIsLoading(true);
        const url = `${publicEndpoints.productCategories.list}${buildQuery(
          params
        )}`;

        const response = await apiClient.get<{
          success?: boolean;
          data?: CategoryListResponse;
          items?: ProductCategory[];
          meta?: CategoryListResponse["meta"];
        }>(url);

        if (response.data?.data) return response.data.data;
        if (response.data?.items && response.data?.meta) {
          return {
            items: response.data.items,
            meta: response.data.meta,
          };
        }

        return null;
      } catch (error: any) {
        const msg =
          error.response?.data?.message ||
          error.message ||
          "Không thể tải danh mục sản phẩm";
        setErrorMessage(msg);
        showError(msg);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [showError]
  );

  const fetchTree = useCallback(
    async (params?: Omit<GetCategoriesParams, "format">) =>
      fetchCategories({ ...params, format: "tree" }),
    [fetchCategories]
  );

  const fetchRoot = useCallback(
    async (params?: Omit<GetCategoriesParams, "format">) => {
      try {
        setIsLoading(true);
        const url = `${publicEndpoints.productCategories.root}${buildQuery(
          params
        )}`;

        const response = await apiClient.get<{
          success?: boolean;
          data?: ProductCategory[];
          items?: ProductCategory[];
        }>(url);

        if (Array.isArray(response.data)) {
          return response.data as unknown as ProductCategory[];
        }

        if (response.data?.data && Array.isArray(response.data.data)) {
          return response.data.data;
        }

        if (response.data?.items && Array.isArray(response.data.items)) {
          return response.data.items;
        }

        return [];
      } catch (error: any) {
        const msg =
          error.response?.data?.message ||
          error.message ||
          "Không thể tải danh mục gốc";
        setErrorMessage(msg);
        showError(msg);
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    [showError]
  );

  const fetchCategoryProducts = useCallback(
    async <TProduct = any>(
      categoryId: number,
      params?: { page?: number; limit?: number }
    ): Promise<CategoryProductsResponse<TProduct> | null> => {
      try {
        setIsLoading(true);
        const url = `${publicEndpoints.productCategories.products(
          categoryId
        )}${buildQuery(params)}`;

        const response = await apiClient.get<{
          success?: boolean;
          data?: CategoryProductsResponse<TProduct>;
          items?: TProduct[];
          meta?: CategoryProductsResponse<TProduct>["meta"];
        }>(url);

        if (response.data?.data) return response.data.data;
        if (response.data?.items && response.data?.meta) {
          return {
            items: response.data.items,
            meta: response.data.meta as CategoryProductsResponse<TProduct>["meta"],
          };
        }

        return null;
      } catch (error: any) {
        const msg =
          error.response?.data?.message ||
          error.message ||
          "Không thể tải sản phẩm theo danh mục";
        setErrorMessage(msg);
        showError(msg);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [showError]
  );

  const fetchCategoryBySlug = useCallback(
    async (
      slug: string,
      params?: GetCategoryBySlugParams
    ): Promise<ProductCategory | null> => {
      try {
        setIsLoading(true);
        const url = `${publicEndpoints.productCategories.showBySlug(
          slug
        )}${buildQuery(params)}`;

        const response = await apiClient.get<{
          success?: boolean;
          data?: ProductCategory;
        }>(url);

        if (response.data?.data) return response.data.data;

        if (!response.data?.success) {
          return response.data as unknown as ProductCategory;
        }

        return null;
      } catch (error: any) {
        const msg =
          error.response?.data?.message ||
          error.message ||
          "Không thể tải chi tiết danh mục";
        setErrorMessage(msg);
        showError(msg);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [showError]
  );

  return {
    isLoading,
    errorMessage,
    fetchCategories,
    fetchTree,
    fetchRoot,
    fetchCategoryProducts,
    fetchCategoryBySlug,
  };
}




