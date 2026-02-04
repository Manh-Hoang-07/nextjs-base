import { Suspense } from "react";
import { Metadata } from "next";
import AdminCertificates from "@/components/introduction/certificate/admin/AdminCertificates";
import PageMeta from "@/components/shared/ui/navigation/PageMeta";

export const metadata: Metadata = {
  title: "Chứng chỉ & Giải thưởng | Admin",
  description: "Quản lý chứng chỉ và giải thưởng của công ty",
};

export default function AdminCertificatesPage() {
  return (
    <div className="w-full p-4">
      <PageMeta
        title="Chứng chỉ & Giải thưởng"
        breadcrumbs={[
          { label: "Trang quản trị", href: "/admin", },
          { label: "Giới thiệu", href: "/admin/about-sections" },
          { label: "Chứng chỉ" },
        ]}
      />
      <Suspense fallback={<div>Đang tải...</div>}>
        <AdminCertificates />
      </Suspense>
    </div>
  );
}




