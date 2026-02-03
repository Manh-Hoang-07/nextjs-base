import { Suspense } from "react";
import { Metadata } from "next";
import AdminContexts from "@/components/admin/core/contexts/AdminContexts";
import PageMeta from "@/components/ui/navigation/PageMeta";

export const metadata: Metadata = {
  title: "Quáº£n lÃ½ Context | Admin",
  description: "Quáº£n lÃ½ ngá»¯ cáº£nh vÃ  phÃ¢n quyá»n chuyÃªn sÃ¢u",
};

export default function AdminContextsPage() {
  return (
    <div className="w-full p-4">
      <PageMeta
        title="Quáº£n lÃ½ Context"
        breadcrumbs={[
          { label: "Trang quáº£n trá»‹", href: "/admin", },
          { label: "NhÃ³m & Context", href: "/admin/groups" },
          { label: "Context" },
        ]}
      />
      <Suspense fallback={<div>Äang táº£i...</div>}>
        <AdminContexts />
      </Suspense>
    </div>
  );
}



