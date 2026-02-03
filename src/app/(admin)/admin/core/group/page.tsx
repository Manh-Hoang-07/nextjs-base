import { Suspense } from "react";
import { Metadata } from "next";
import AdminGroups from "@/components/admin/core/groups/AdminGroups";
import PageMeta from "@/components/ui/navigation/PageMeta";

export const metadata: Metadata = {
  title: "Quáº£n lÃ½ NhÃ³m | Admin",
  description: "Quáº£n lÃ½ nhÃ³m ngÆ°á»i dÃ¹ng",
};

export default function AdminGroupsPage() {
  return (
    <div className="w-full p-4">
      <PageMeta
        title="Quáº£n lÃ½ NhÃ³m"
        breadcrumbs={[
          { label: "Trang quáº£n trá»‹", href: "/admin", },
          { label: "NhÃ³m & Context", href: "/admin/groups" },
          { label: "NhÃ³m" },
        ]}
      />
      <Suspense fallback={<div>Äang táº£i...</div>}>
        <AdminGroups />
      </Suspense>
    </div>
  );
}


