"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import apiClient from "@/lib/api/client";
import { adminEndpoints } from "@/lib/api/endpoints";
import { useToastContext } from "@/contexts/ToastContext";
import FormField from "@/components/UI/Forms/FormField";
import SearchableSelect from "@/components/UI/Forms/SearchableSelect";

interface InventoryRow {
  id?: number;
  product_variant_id?: number;
  sku?: string;
  variant_name?: string;
  quantity?: number;
  min_stock_level?: number | null;
  updated_at?: string;
}

export default function WarehouseInventoryClient({
  warehouseId,
}: {
  warehouseId: string;
}) {
  const { showSuccess, showError } = useToastContext();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<InventoryRow[]>([]);
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [updating, setUpdating] = useState(false);

  const [form, setForm] = useState({
    product_variant_id: "",
    quantity: "",
    min_stock_level: "",
  });

  const warehouseIdNumber = useMemo(() => Number(warehouseId), [warehouseId]);

  const fetchInventory = useCallback(async () => {
    if (!warehouseIdNumber || Number.isNaN(warehouseIdNumber)) return;
    setLoading(true);
    try {
      const response = await apiClient.get(
        adminEndpoints.warehouses.inventory(warehouseIdNumber),
        { params: { low_stock: lowStockOnly ? "true" : "false" } }
      );
      const data = response.data?.data ?? response.data ?? [];
      setItems(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setItems([]);
      showError(
        e?.response?.data?.message ||
        "Không thể tải tồn kho (BE hiện đang placeholder có thể trả rỗng)"
      );
    } finally {
      setLoading(false);
    }
  }, [warehouseIdNumber, lowStockOnly, showError]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const handleUpdateInventory = async () => {
    if (!warehouseIdNumber || Number.isNaN(warehouseIdNumber)) return;
    const productVariantId = Number(form.product_variant_id);
    const quantity = Number(form.quantity);
    const minStockLevel =
      form.min_stock_level === "" ? undefined : Number(form.min_stock_level);

    if (!productVariantId || Number.isNaN(productVariantId)) {
      showError("Vui lòng nhập product_variant_id hợp lệ");
      return;
    }
    if (Number.isNaN(quantity) || quantity < 0) {
      showError("Vui lòng nhập quantity >= 0");
      return;
    }

    setUpdating(true);
    try {
      const payload: any = {
        warehouse_id: warehouseIdNumber,
        product_variant_id: productVariantId,
        quantity,
      };
      if (minStockLevel !== undefined && !Number.isNaN(minStockLevel)) {
        payload.min_stock_level = minStockLevel;
      }

      await apiClient.put(adminEndpoints.warehouses.updateInventory, payload);
      showSuccess(
        "Đã gửi cập nhật tồn kho (BE hiện đang placeholder nên có thể chưa phản ánh dữ liệu)"
      );
      setForm({ product_variant_id: "", quantity: "", min_stock_level: "" });
      fetchInventory();
    } catch (e: any) {
      showError(e?.response?.data?.message || "Cập nhật tồn kho thất bại");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="text-sm text-gray-600">
              Warehouse ID: <span className="font-mono">{warehouseId}</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Lưu ý: API inventory/update/transfer hiện đang placeholder ở BE —
              FE hiển thị empty-state và vẫn cho thao tác để không block luồng.
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={lowStockOnly}
                onChange={(e) => setLowStockOnly(e.target.checked)}
                className="h-4 w-4"
              />
              Chỉ low stock
            </label>
            <button
              onClick={fetchInventory}
              className="px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-sm"
              disabled={loading}
            >
              Tải lại
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-lg font-bold mb-4">Cập nhật tồn kho (theo biến thể)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="w-full">
            <label className="block text-sm font-semibold mb-1.5 text-gray-700">
              Biến thể (product_variant_id)
            </label>
            <SearchableSelect
              value={form.product_variant_id ? Number(form.product_variant_id) : null}
              searchApi={adminEndpoints.productVariants.list}
              labelField="sku"
              placeholder="Tìm theo SKU..."
              onChange={(v) =>
                setForm((p) => ({ ...p, product_variant_id: v ? String(v) : "" }))
              }
            />
            <div className="text-xs text-gray-500 mt-1">
              Tip: gõ SKU để tìm nhanh (ví dụ: SKU-1050-BLUE-128)
            </div>
          </div>
          <FormField
            label="quantity"
            type="number"
            value={form.quantity}
            onChange={(e) => setForm((p) => ({ ...p, quantity: e.target.value }))}
            placeholder="Ví dụ: 120"
            min={0}
          />
          <FormField
            label="min_stock_level (optional)"
            type="number"
            value={form.min_stock_level}
            onChange={(e) =>
              setForm((p) => ({ ...p, min_stock_level: e.target.value }))
            }
            placeholder="Ví dụ: 10"
            min={0}
          />
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleUpdateInventory}
            disabled={updating}
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {updating ? "Đang cập nhật..." : "Cập nhật tồn kho"}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-4 text-gray-600">Đang tải...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Biến thể
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Qty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Min stock
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {items.map((row, idx) => (
                  <tr key={row.id ?? `${row.product_variant_id}-${idx}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <code className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">
                        {row.sku || "—"}
                      </code>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {row.variant_name || row.product_variant_id || "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {row.quantity ?? "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {row.min_stock_level ?? "—"}
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-6 text-center text-gray-500"
                    >
                      Không có dữ liệu tồn kho (BE hiện đang placeholder)
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}


