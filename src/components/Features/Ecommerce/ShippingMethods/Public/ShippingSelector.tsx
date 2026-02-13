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

      const method = methods.find((m) => m.id === selectedId);
      if (!method) return;

      // Notify parent immediately of selection (even if cost is pending)
      onShippingChange?.({
        method,
        cost: shippingCost || 0,
        detail: calculation,
      });

      // Don't calculate if destination is empty or just generic comma
      if (!destination || destination.trim() === "," || destination.trim().length < 5) return;

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
        onShippingChange?.({
          method,
          cost: res.cost,
          detail: res,
        });
      }
    }

    recalc();
  }, [selectedId, cartValue, weight, destination, calculateShipping, methods, onShippingChange]);

  const renderCost = (method: ShippingMethod) => {
    if (selectedId !== method.id) return null;
    if (isLoading) return <span className="animate-pulse">Đang tính...</span>;
    if (calculation && selectedId === method.id) {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(shippingCost);
    }
    return "--";
  };

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
      </header>

      <div className="space-y-2">
        {methods.map((method) => (
          <label
            key={method.id}
            className={`flex cursor-pointer items-center justify-between rounded-md border px-3 py-3 text-sm transition-all ${selectedId === method.id
                ? 'border-primary bg-primary/5 ring-1 ring-primary'
                : 'hover:border-gray-300'
              }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="shipping_method"
                className="h-4 w-4 text-primary focus:ring-primary"
                checked={selectedId === method.id}
                onChange={() => setSelectedId(method.id)}
              />
              <div>
                <div className="font-bold text-gray-900">{method.name}</div>
                {method.description && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    {method.description}
                  </p>
                )}
              </div>
            </div>

            <div className="text-right text-sm font-bold text-primary">
              {renderCost(method)}
            </div>
          </label>
        ))}
      </div>

      {calculation?.estimated_delivery_time && (
        <p className="text-xs text-gray-500 flex items-center gap-1 mt-2">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Dự kiến giao: {calculation.estimated_delivery_time}
        </p>
      )}
    </section>
  );
}




