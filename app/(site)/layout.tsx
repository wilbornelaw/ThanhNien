import { FooterBrand } from "@/components/site/footer-brand";
import { Header } from "@/components/site/header";
import { getSiteSettings } from "@/lib/queries/public";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <div className="min-h-screen">
      <Header settings={settings} />
      {children}
      <FooterBrand settings={settings} />
    </div>
  );
}
