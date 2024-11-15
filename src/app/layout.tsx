
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { JotaiProvider } from "@/components/jotai-provider";
import { Modals } from "@/components/modals";
import { Toaster } from "@/components/ui/sonner";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { HeaderLayout } from "@/components/header/header-layout";
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { FooterLayout } from "@/components/footer/footer-layout";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Đặt vé xem phim",
  description: "Đặt vé xem phim online",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}
        >
          <ConvexClientProvider>
          <NuqsAdapter>
            <JotaiProvider>
            <HeaderLayout />
              
              <Toaster />
              <Modals />
              {children}
            <FooterLayout />
            </JotaiProvider>
            </NuqsAdapter>
          </ConvexClientProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
