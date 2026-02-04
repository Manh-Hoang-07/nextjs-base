import { getSystemConfig } from "@/lib/api/public/general";
import { PublicHeader, PublicFooter, PublicLayoutWrapper } from "@/components/shared/layout/public";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const systemConfig = await getSystemConfig("general");

  return (
    <PublicLayoutWrapper
      contactChannels={systemConfig?.contact_channels}
      header={<PublicHeader key="header" systemConfig={systemConfig} />}
      footer={<PublicFooter key="footer" systemConfig={systemConfig} />}
    >
      {children}
    </PublicLayoutWrapper>
  );
}






