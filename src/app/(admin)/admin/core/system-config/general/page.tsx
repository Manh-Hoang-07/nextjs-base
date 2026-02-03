import { Metadata } from "next";
import SystemConfigForm from "@/components/admin/core/system-configs/SystemConfigForm";
import ContactChannelsManager from "@/components/admin/core/system-configs/ContactChannelsManager";
import PageMeta from "@/components/ui/navigation/PageMeta";

export const metadata: Metadata = {
  title: "Cáº¥u hÃ¬nh chung | Admin",
  description: "Quáº£n lÃ½ thÃ´ng tin chung cá»§a há»‡ thá»‘ng",
};

export default function AdminSystemConfigGeneralPage() {
  const fields: any[] = [
    { key: "site_name", label: "TÃªn Website", type: "text", placeholder: "Nháº­p tÃªn website" },
    { key: "site_description", label: "MÃ´ táº£ Website", type: "textarea", placeholder: "Nháº­p mÃ´ táº£ ngáº¯n vá» website" },
    { key: "site_logo", label: "Logo", type: "image", description: "Logo hiá»ƒn thá»‹ trÃªn Header vÃ  cÃ¡c trang" },
    { key: "site_favicon", label: "Favicon", type: "image", description: "Biá»ƒu tÆ°á»£ng hiá»ƒn thá»‹ trÃªn tab trÃ¬nh duyá»‡t" },
    { key: "site_email", label: "Email liÃªn há»‡", type: "email", placeholder: "contact@example.com" },
    { key: "site_phone", label: "Sá»‘ Ä‘iá»‡n thoáº¡i", type: "text", placeholder: "19001234" },
    { key: "site_addres", label: "Äá»‹a chá»‰", type: "textarea", placeholder: "Nháº­p Ä‘á»‹a chá»‰ trá»¥ sá»Ÿ" },
    { key: "site_copyright", label: "ThÃ´ng tin báº£n quyá»n", type: "text", placeholder: "Â© 2024. All rights reserved." },
    { key: "timezone", label: "MÃºi giá» (Timezone)", type: "text", placeholder: "Asia/Ho_Chi_Minh" },
    { key: "locale", label: "NgÃ´n ngá»¯ (Locale)", type: "text", placeholder: "vi" },
    { key: "currency", label: "Tiá»n tá»‡ (Currency)", type: "text", placeholder: "VND" },
    {
      key: "contact_channels",
      label: "KÃªnh liÃªn há»‡ (Contact Channels)",
      type: "custom",
      component: ContactChannelsManager
    },
    { key: "meta_title", label: "SEO Meta Title", type: "text" },
    { key: "meta_keywords", label: "SEO Meta Keywords", type: "textarea" },
    { key: "og_title", label: "OG Title (Social)", type: "text" },
    { key: "og_description", label: "OG Description (Social)", type: "textarea" },
    { key: "og_image", label: "OG Image (Social)", type: "image" },
    { key: "canonical_url", label: "Canonical URL", type: "text", placeholder: "https://example.com" },
    { key: "google_analytics_id", label: "Google Analytics ID", type: "text", placeholder: "UA-XXXXXXXXX-X" },
    { key: "google_search_console", label: "Google Search Console Key", type: "text" },
    { key: "facebook_pixel_id", label: "Facebook Pixel ID", type: "text" },
    { key: "twitter_site", label: "Twitter ID (Site)", type: "text" },
  ];

  return (
    <div className="w-full p-4">
      <PageMeta
        title="Cáº¥u hÃ¬nh chung"
        breadcrumbs={[
          { label: "Trang quáº£n trá»‹", href: "/admin", },
          { label: "Cáº¥u hÃ¬nh há»‡ thá»‘ng" },
          { label: "Cáº¥u hÃ¬nh chung" },
        ]}
      />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Cáº¥u hÃ¬nh chung</h1>
        <p className="text-gray-500 mt-2">Quáº£n lÃ½ thÃ´ng tin cÆ¡ báº£n vÃ  SEO cá»§a website</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 sm:p-8">
          <SystemConfigForm group="general" fields={fields} />
        </div>
      </div>
    </div>
  );
}


