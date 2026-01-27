"use client";

import { useCallback, useState } from "react";
import apiClient from "@/lib/api/client";
import { publicEndpoints } from "@/lib/api/endpoints";
import { useToastContext } from "@/contexts/ToastContext";

export interface ShippingMethod {
  id: number;
  name: string;
  code: string;
  status: "active" | "inactive" | string;
  description?: string | null;
  base_price?: number;
  price_rules?: any;
  metadata?: Record<string, any>;
}

export interface ShippingMethodListResponse {
  items: ShippingMethod[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CalculateShippingRequest {
  shipping_method_id: number;
  cart_value: number;
  weight?: number;
  destination?: string;
}

export interface CalculateShippingResponse {
  shipping_method_id: number;
  cost: number;
  estimated_delivery_time?: string;
  notes?: string;
  [key: string]: any;
}

export function useShippingMethods() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { showError } = useToastContext();

  const fetchList = useCallback(
    async (params?: {
      page?: number;
      limit?: number;
      search?: string;
      status?: string;
      sort?: string;
    }): Promise<ShippingMethodListResponse | null> => {
      try {
        setIsLoading(true);
        const searchParams = new URLSearchParams();

        if (params?.page) searchParams.set("page", String(params.page));
        if (params?.limit) searchParams.set("limit", String(params.limit));
        if (params?.search) searchParams.set("search", params.search);
        if (params?.status) searchParams.set("status", params.status);
        if (params?.sort) searchParams.set("sort", params.sort);

        const url = `${publicEndpoints.shippingMethods.list}${
          searchParams.toString() ? `?${searchParams.toString()}` : ""
        }`;

        const response = await apiClient.get<{
          success?: boolean;
          data?: ShippingMethodListResponse;
          items?: ShippingMethod[];
          meta?: ShippingMethodListResponse["meta"];
        }>(url);

        // Hỗ trợ cả 2 kiểu: {success, data} hoặc {items, meta}
        if (response.data?.data) {
          return response.data.data;
        }

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
          "Không thể tải danh sách phương thức vận chuyển";
        setErrorMessage(msg);
        showError(msg);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [showError]
  );

  const fetchActive = useCallback(async (): Promise<ShippingMethod[]> => {
    try {
      setIsLoading(true);
      const response = await apiClient.get<{
        success?: boolean;
        data?: ShippingMethod[];
      }>(publicEndpoints.shippingMethods.active);

      if (Array.isArray(response.data)) {
        return response.data as unknown as ShippingMethod[];
      }

      if (response.data?.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }

      return [];
    } catch (error: any) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Không thể tải danh sách phương thức vận chuyển";
      setErrorMessage(msg);
      showError(msg);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [showError]);

  const calculateShipping = useCallback(
    async (
      payload: CalculateShippingRequest
    ): Promise<CalculateShippingResponse | null> => {
      try {
        setIsLoading(true);
        const response = await apiClient.post<{
          success?: boolean;
          data?: CalculateShippingResponse;
        }>(publicEndpoints.shippingMethods.calculate, payload);

        if (response.data?.data) {
          return response.data.data;
        }

        // Trường hợp API trả trực tiếp object
        if (!response.data?.success) {
          return response.data as unknown as CalculateShippingResponse;
        }

        return null;
      } catch (error: any) {
        const msg =
          error.response?.data?.message ||
          error.message ||
          "Không thể tính phí vận chuyển";
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
    fetchList,
    fetchActive,
    calculateShipping,
  };
}


