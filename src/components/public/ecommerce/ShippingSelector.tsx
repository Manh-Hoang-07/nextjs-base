"use client";

import { useEffect, useState } from "react";
import { useShippingMethods, ShippingMethod, CalculateShippingRequest, CalculateShippingResponse } from "@/hooks/useShippingMethods";

interface ShippingSelectorProps {
  cartValue: number;
  weight?: number;
  destination?: string;
  onShippingChange?: (payload: {
    method: ShippingMethod;
    cost: number;
    detail: CalculateShippingResponse | null;
  }) => void;
}

export default function ShippingSelector({
  cartValue,
  weight,
  destination,
  onShippingChange,
}: ShippingSelectorProps) {
  const { isLoading, fetchActive, calculateShipping } = useShippingMethods();
  const [methods, setMethods] = useState<ShippingMethod[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [shippingCost, setShippingCost] = useState<number>(0);
  const [calculation, setCalculation] =
    useState<CalculateShippingResponse | null>(null);

  useEffect(() => {
    async function loadMethods() {
      const data = await fetchActive();
      setMethods(data);
      if (data.length > 0 && !selectedId) {
        setSelectedId(data[0].id);
      }
    }

    loadMethods();
  }, [fetchActive, selectedId]);

  useEffect(() => {
    async function recalc() {
      if (!selectedId) return;

      const payload: CalculateShippingRequest = {
        shipping_method_id: selectedId,
        cart_value: cartValue,
        weight,
        destination,
      };

      const res = await calculateShipping(payload);
      if (res) {
        setCalculation(res);
        setShippingCost(res.cost);
        const method = methods.find((m) => m.id === selectedId);
        if (method && onShippingChange) {
          onShippingChange({
            method,
            cost: res.cost,
            detail: res,
          });
        }
      }
    }

    recalc();
  }, [selectedId, cartValue, weight, destination, calculateShipping, methods, onShippingChange]);

  if (methods.length === 0) {
    return (
      <div className="rounded-lg border border-dashed px-4 py-3 text-sm text-gray-500">
        Hiện chưa có phương thức vận chuyển khả dụng.
      </div>
    );
  }

  return (
    <section className="space-y-3 rounded-lg border bg-white p-4">
      <header className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">
          Phương thức vận chuyển
        </h3>
        {isLoading && (
          <span className="text-xs text-gray-500">Đang tính phí...</span>
        )}
      </header>

      <div className="space-y-2">
        {methods.map((method) => (
          <label
            key={method.id}
            className="flex cursor-pointer items-center justify-between rounded-md border px-3 py-2 text-sm hover:border-primary"
          >
            <div className="flex items-center gap-2">
              <input
                type="radio"
                name="shipping_method"
                className="h-4 w-4 text-primary"
                checked={selectedId === method.id}
                onChange={() => setSelectedId(method.id)}
              />
              <div>
                <div className="font-medium text-gray-900">{method.name}</div>
                {method.description && (
                  <p className="text-xs text-gray-500">
                    {method.description}
                  </p>
                )}
              </div>
            </div>

            <div className="text-right text-sm font-semibold text-primary">
              {shippingCost
                ? new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(shippingCost)
                : "--"}
            </div>
          </label>
        ))}
      </div>

      {calculation?.estimated_delivery_time && (
        <p className="text-xs text-gray-500">
          Dự kiến giao: {calculation.estimated_delivery_time}
        </p>
      )}
    </section>
  );
}


