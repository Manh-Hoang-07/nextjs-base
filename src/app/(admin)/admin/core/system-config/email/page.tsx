import { Metadata } from "next";
import SystemConfigForm from "@/components/admin/core/system-configs/SystemConfigForm";

export const metadata: Metadata = {
  title: "Cáº¥u hÃ¬nh Email | Admin",
  description: "Cáº¥u hÃ¬nh SMTP gá»­i email",
};

export default function AdminSystemConfigEmailPage() {
  const fields: any[] = [
    { key: "smtp_host", label: "SMTP Host", type: "text", placeholder: "smtp.gmail.com" },
    { key: "smtp_port", label: "SMTP Port", type: "number", placeholder: "587" },
    { key: "smtp_username", label: "SMTP Username", type: "text", placeholder: "your-email@gmail.com" },
    { key: "smtp_password", label: "SMTP Password", type: "password", placeholder: "********" },
    { key: "smtp_secure", label: "Sá»­ dá»¥ng SSL/TLS (Secure)", type: "checkbox" },
    { key: "from_email", label: "Email gá»­i Ä‘i (From Email)", type: "email", placeholder: "noreply@example.com" },
    { key: "from_name", label: "TÃªn ngÆ°á»i gá»­i (From Name)", type: "text", placeholder: "My Website" },
    { key: "reply_to_email", label: "Email nháº­n pháº£n há»“i (Reply-to)", type: "email", placeholder: "contact@example.com" },
  ];

  return (
    <div className="w-full p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Cáº¥u hÃ¬nh Email</h1>
        <p className="text-gray-500 mt-2">Cáº¥u hÃ¬nh SMTP Ä‘á»ƒ gá»­i email thÃ´ng bÃ¡o tá»« há»‡ thá»‘ng</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 sm:p-8">
          <SystemConfigForm group="email" fields={fields} />
        </div>
      </div>
    </div>
  );
}


