"use client";

import { useCallback, useEffect, useState } from "react";
import apiClient from "@/lib/api/client";
import { adminEndpoints } from "@/lib/api/endpoints";
import { useToastContext } from "@/contexts/ToastContext";
import FormField from "@/components/shared/ui/forms/FormField";
import Actions from "@/components/shared/ui/data-display/Actions";
import SearchableSelect from "@/components/shared/ui/forms/SearchableSelect";

interface TransferRow {
  id: number;
  from_warehouse_id: number;
  to_warehouse_id: number;
  product_variant_id: number;
  quantity: number;
  status?: string;
  notes?: string;
  created_at?: string;
}

export default function WarehouseTransfersClient() {
  const { showSuccess, showError } = useToastContext();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<TransferRow[]>([]);
  const [filters, setFilters] = useState<{ status?: string; warehouse_id?: string }>({});

  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    from_warehouse_id: "",
    to_warehouse_id: "",
    product_variant_id: "",
    quantity: "",
    notes: "",
  });

  const fetchTransfers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(adminEndpoints.warehouses.transfers.list, {
        params: {
          ...(filters.status ? { status: filters.status } : {}),
          ...(filters.warehouse_id ? { warehouse_id: filters.warehouse_id } : {}),
        },
      });
      const data = response.data?.data ?? response.data ?? [];
      setItems(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setItems([]);
      showError(
        e?.response?.data?.message ||
        "Không thể tải danh sách chuyển kho (BE hiện đang placeholder có thể trả rỗng)"
      );
    } finally {
      setLoading(false);
    }
  }, [filters, showError]);

  useEffect(() => {
    fetchTransfers();
  }, [fetchTransfers]);

  const createTransfer = async () => {
    const fromId = Number(form.from_warehouse_id);
    const toId = Number(form.to_warehouse_id);
    const variantId = Number(form.product_variant_id);
    const qty = Number(form.quantity);

    if (!fromId || !toId || !variantId) {
      showError("Vui lòng nhập đầy đủ from/to warehouse và product_variant_id");
      return;
    }
    if (fromId === toId) {
      showError("from_warehouse_id và to_warehouse_id không được trùng nhau");
      return;
    }
    if (!qty || qty < 1) {
      showError("quantity phải >= 1");
      return;
    }

    setCreating(true);
    try {
      await apiClient.post(adminEndpoints.warehouses.transfers.create, {
        from_warehouse_id: fromId,
        to_warehouse_id: toId,
        product_variant_id: variantId,
        quantity: qty,
        notes: form.notes || undefined,
      });
      showSuccess(
        "Đã tạo phiếu chuyển kho (BE hiện đang placeholder nên có thể chưa phản ánh dữ liệu)"
      );
      setForm({
        from_warehouse_id: "",
        to_warehouse_id: "",
        product_variant_id: "",
        quantity: "",
        notes: "",
      });
      fetchTransfers();
    } catch (e: any) {
      showError(e?.response?.data?.message || "Tạo phiếu chuyển kho thất bại");
    } finally {
      setCreating(false);
    }
  };

  const doAction = async (id: number, action: "approve" | "complete" | "cancel") => {
    try {
      const endpoint =
        action === "approve"
          ? adminEndpoints.warehouses.transfers.approve(id)
          : action === "complete"
            ? adminEndpoints.warehouses.transfers.complete(id)
            : adminEndpoints.warehouses.transfers.cancel(id);
      await apiClient.put(endpoint);
      showSuccess(
        `Đã gửi thao tác ${action} (BE hiện đang placeholder nên có thể chưa phản ánh dữ liệu)`
      );
      fetchTransfers();
    } catch (e: any) {
      showError(e?.response?.data?.message || "Thao tác thất bại");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-lg font-bold mb-4">Tạo phiếu chuyển kho</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div className="w-full">
            <label className="block text-sm font-semibold mb-1.5 text-gray-700">
              Từ kho (from_warehouse_id)
            </label>
            <SearchableSelect
              value={form.from_warehouse_id ? Number(form.from_warehouse_id) : null}
              searchApi={adminEndpoints.warehouses.list}
              labelField="name"
              placeholder="Tìm kho theo tên/mã..."
              onChange={(v) => setForm((p) => ({ ...p, from_warehouse_id: v ? String(v) : "" }))}
            />
          </div>
          <div className="w-full">
            <label className="block text-sm font-semibold mb-1.5 text-gray-700">
              Đến kho (to_warehouse_id)
            </label>
            <SearchableSelect
              value={form.to_warehouse_id ? Number(form.to_warehouse_id) : null}
              searchApi={adminEndpoints.warehouses.list}
              labelField="name"
              placeholder="Tìm kho theo tên/mã..."
              onChange={(v) => setForm((p) => ({ ...p, to_warehouse_id: v ? String(v) : "" }))}
            />
          </div>
          <div className="w-full">
            <label className="block text-sm font-semibold mb-1.5 text-gray-700">
              Biến thể (product_variant_id)
            </label>
            <SearchableSelect
              value={form.product_variant_id ? Number(form.product_variant_id) : null}
              searchApi={adminEndpoints.productVariants.list}
              labelField="sku"
              placeholder="Tìm theo SKU..."
              onChange={(v) => setForm((p) => ({ ...p, product_variant_id: v ? String(v) : "" }))}
            />
          </div>
          <FormField
            label="quantity"
            type="number"
            value={form.quantity}
            onChange={(e) => setForm((p) => ({ ...p, quantity: e.target.value }))}
            placeholder="5"
            min={1}
          />
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <FormField
            label="notes (optional)"
            type="textarea"
            rows={2}
            value={form.notes}
            onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
            placeholder="Ghi chú..."
          />
          <div className="flex justify-end">
            <button
              onClick={createTransfer}
              disabled={creating}
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {creating ? "Đang tạo..." : "Tạo phiếu"}
            </button>
          </div>
        </div>
        <div className="text-xs text-gray-500 mt-2">
          Lưu ý: API transfer hiện đang placeholder ở BE — FE vẫn cho thao tác để không block luồng.
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-lg font-bold mb-4">Bộ lọc</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <FormField
            label="status"
            value={filters.status || ""}
            onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value }))}
            placeholder="pending/approved/..."
          />
          <FormField
            label="warehouse_id"
            type="number"
            value={filters.warehouse_id || ""}
            onChange={(e) => setFilters((p) => ({ ...p, warehouse_id: e.target.value }))}
            placeholder="1"
            min={1}
          />
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={fetchTransfers}
            className="px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-sm"
            disabled={loading}
          >
            Áp dụng
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
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Từ / Đến
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Variant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Qty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {items.map((t) => (
                  <tr key={t.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {t.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {t.from_warehouse_id} → {t.to_warehouse_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {t.product_variant_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {t.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {t.status || "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Actions
                        item={t}
                        showEdit={false}
                        showDelete={false}
                        additionalActions={[
                          {
                            label: "Duyệt",
                            icon: "check",
                            action: () => doAction(t.id, "approve"),
                          },
                          {
                            label: "Hoàn tất",
                            icon: "check",
                            action: () => doAction(t.id, "complete"),
                          },
                          {
                            label: "Huỷ",
                            icon: "pause",
                            action: () => doAction(t.id, "cancel"),
                          },
                        ]}
                      />
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-6 text-center text-gray-500">
                      Không có dữ liệu chuyển kho (BE hiện đang placeholder)
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




