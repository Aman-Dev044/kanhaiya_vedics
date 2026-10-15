import { getProducts, getSettings } from "@/lib/data";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { WhatsappButton } from "@/components/layout/WhatsappButton";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Intro } from "@/components/layout/Intro";
import { ScrollProgress } from "@/components/ui/Motion";

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const [settings, products] = await Promise.all([getSettings(), getProducts()]);
  return (
    <SmoothScroll>
      <Intro name={settings.brand.name} />
      <ScrollProgress />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <AnnouncementBar />
      <Header />
      <main id="main">{children}</main>
      <Footer settings={settings} products={products} />
      <CartDrawer />
      <WhatsappButton />
    </SmoothScroll>
  );
}
