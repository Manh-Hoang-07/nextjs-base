import { Suspense } from "react";
import { Metadata } from "next";
import AdminPaymentMethods from "@/components/admin/payment/method/AdminPaymentMethods";
import PageMeta from "@/components/ui/navigation/PageMeta";

export const metadata: Metadata = {
  title: "Phương thức thanh toán | Admin",
  description: "Quản lý danh sách phương thức thanh toán (COD, VNPAY, ...)",
};

export default function AdminPaymentMethodsPage() {
  return (
    <div className="w-full p-4">
      <PageMeta
        title="Phương thức thanh toán"
        breadcrumbs={[
          { label: "Trang quản trị", href: "/admin" },
          { label: "Ecommerce" },
          { label: "Phương thức thanh toán" },
        ]}
      />
      <Suspense fallback={<div>Đang tải...</div>}>
        <AdminPaymentMethods />
      </Suspense>
    </div>
  );
}


