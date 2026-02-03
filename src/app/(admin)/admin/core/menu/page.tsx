import { Suspense } from "react";
import { Metadata } from "next";
import AdminMenus from "@/components/admin/core/menus/AdminMenus";
import PageMeta from "@/components/ui/navigation/PageMeta";

export const metadata: Metadata = {
  title: "Quáº£n lÃ½ Menu | Admin",
  description: "Quáº£n lÃ½ cáº¥u trÃºc danh má»¥c vÃ  liÃªn káº¿t",
};

export default function AdminMenusPage() {
  return (
    <div className="w-full p-4">
      <PageMeta
        title="Quáº£n lÃ½ Menu"
        breadcrumbs={[
          { label: "Trang quáº£n trá»‹", href: "/admin", },
          { label: "Giao diá»‡n" },
          { label: "Menu" },
        ]}
      />
      <Suspense fallback={<div>Äang táº£i...</div>}>
        <AdminMenus />
      </Suspense>
    </div>
  );
}



