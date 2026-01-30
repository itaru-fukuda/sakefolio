import type { Metadata } from "next";
import { Inter, Noto_Serif_JP } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ScrollToTop } from "@/components/scroll-to-top";
import { Toaster } from "@/components/ui/sonner";
import { InstallPrompt } from "@/components/pwa/install-prompt";
import { GlobalLoaderProvider } from "@/components/global-loader-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const notoSerifJP = Noto_Serif_JP({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-serif",
});

export const viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Prevent zooming for native app feel
};

export const metadata: Metadata = {
  appleWebApp: {
    title: "SAKEfolio",
    statusBarStyle: "default",
    startupImage: ["/images/pwa/apple-icon.png"],
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://sakefolio.vercel.app"),
  title: {
    default: "SAKEfolio - 日本酒記録・評価アプリ",
    template: "%s | SAKEfolio",
  },
  description: "SAKEfolio（サケフォリオ）は、あなたの日本酒ライフを豊かにするための記録ツールです。飲んだ銘柄の感想や評価を記録し、あなただけの日本酒ポートフォリオを作成しましょう。",
  keywords: ["日本酒", "日本酒アプリ", "日本酒記録", "SAKEfolio", "日本酒評価", "日本酒データベース", "純米大吟醸", "酒蔵検索"],
  authors: [{ name: "SAKEfolio Team" }],
  creator: "SAKEfolio Team",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "/",
    title: "SAKEfolio - 日本酒記録・評価アプリ",
    description: "SAKEfolioで、至高の一杯を、美しく記録する。日々の感動を、確かな記憶へ。",
    siteName: "SAKEfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "SAKEfolio - 日本酒記録・評価アプリ",
    description: "あなたの日本酒ライフを豊かにするための記録ツール。",
    creator: "@sakefolio",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={`${inter.variable} ${notoSerifJP.variable} font-sans antialiased bg-background text-foreground`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Suspense fallback={null}>
            <GlobalLoaderProvider>
              <div className="relative flex min-h-screen flex-col">
                <SiteHeader />
                <main className="flex-1">{children}</main>
                <SiteFooter />
              </div>
              <InstallPrompt />
              <ScrollToTop />
              <Toaster />
            </GlobalLoaderProvider>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
