import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/toaster";
import QueryProvider from '@/providers/query-provider';
import { TooltipsProvider } from '@/providers/tooltip-provider';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ulster Delt - The Mobile Bank | Banking. But better.",
  description: "Ulster Delt is the mobile bank that lets you manage your finances directly from your smartphone. Open your bank account in minutes and experience banking designed for the 21st century.",
};

export const viewport: Viewport = {
  themeColor: "#4bd1a0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <Providers>
            <TooltipsProvider>
              <Header />
              <main className="pt-[calc(4rem+var(--banner-height,0px))]">
                {children}
              </main>
              <Footer />
              <Toaster />
            </TooltipsProvider>
          </Providers>
        </QueryProvider>
      </body>
    </html>
  );
}
