import type { Metadata, Viewport } from "next";
import { DM_Sans, Lora } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { getSettings } from "@/lib/data";
import { SITE_URL, absoluteUrl } from "@/lib/site";
import { ThemeProvider, ThemeScript } from "@/components/providers/ThemeProvider";
import { SettingsProvider } from "@/components/providers/SettingsProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { CartProvider } from "@/components/providers/CartProvider";
import { JsonLd } from "@/components/JsonLd";

const lora = Lora({ subsets: ["latin"], variable: "--font-lora", display: "swap" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans", display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  const { seo, brand } = await getSettings();
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: seo.title, template: `%s | ${brand.name}` },
    description: seo.description,
    keywords: seo.keywords,
    applicationName: brand.name,
    authors: [{ name: brand.name }],
    creator: brand.name,
    publisher: brand.name,
    category: "food",
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: SITE_URL,
      siteName: brand.name,
      title: seo.title,
      description: seo.description,
    },
    twitter: { card: "summary_large_image", title: seo.title, description: seo.description },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    },
    formatDetection: { telephone: true, email: true, address: true },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbf8f1" },
    { media: "(prefers-color-scheme: dark)", color: "#0d130c" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();

  const organization = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: settings.brand.name,
        url: SITE_URL,
        logo: absoluteUrl("/icon.svg"),
        slogan: settings.brand.tagline,
        description: settings.brand.description,
        email: settings.contact.email,
        telephone: settings.contact.phone,
        sameAs: Object.values(settings.social).filter(Boolean),
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: settings.brand.name,
        publisher: { "@id": `${SITE_URL}/#organization` },
        inLanguage: "en-IN",
      },
    ],
  };

  return (
    <html lang="en-IN" suppressHydrationWarning className={`${lora.variable} ${dmSans.variable}`}>
      <head>
        <ThemeScript defaultMode={settings.theme.defaultMode} />
        <JsonLd data={organization} />
      </head>
      <body className="min-h-dvh">
        <ThemeProvider defaultMode={settings.theme.defaultMode}>
          <SettingsProvider settings={settings}>
            <AuthProvider>
              <CartProvider>
                {children}
                <Toaster
                  position="top-center"
                  richColors
                  closeButton
                  toastOptions={{ style: { fontFamily: "var(--font-dm-sans)" } }}
                />
              </CartProvider>
            </AuthProvider>
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
