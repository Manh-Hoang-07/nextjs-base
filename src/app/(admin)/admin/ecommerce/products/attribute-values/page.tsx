import { Suspense } from "react";
import { Metadata } from "next";
import AdminProductAttributeValues from "@/components/Features/Ecommerce/Products/AttributeValues/Admin/AdminProductAttributeValues";
import PageMeta from "@/components/UI/Navigation/PageMeta";

export const metadata: Metadata = {
  title: "Giá trị thuộc tính sản phẩm | Admin",
  description: "Quản lý giá trị thuộc tính sản phẩm",
};

export default function AdminProductAttributeValuesPage() {
  return (
    <div className="w-full p-4">
      <PageMeta
        title="Giá trị thuộc tính sản phẩm"
        breadcrumbs={[
          { label: "Trang quản trị", href: "/admin" },
          { label: "Ecommerce" },
          { label: "Giá trị thuộc tính sản phẩm" },
        ]}
      />
      <Suspense fallback={<div>Đang tải...</div>}>
        <AdminProductAttributeValues />
      </Suspense>
    </div>
  );
}


