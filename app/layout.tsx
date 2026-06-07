import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AppShell } from "@/components/AppShell";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "UTPreneurs - UTP Marketplace",
  description:
    "A centralized online marketplace platform for UTP students to promote and sell their products.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", inter.variable)}>
      <body
        className={`${inter.variable} ${geistMono.variable} bg-muted antialiased`}
      >
        <div className="mx-auto max-w-md min-h-screen bg-background shadow-2xl relative overflow-x-hidden">
          <AppShell>{children}</AppShell>
        </div>
      </body>
    </html>
  );
}
