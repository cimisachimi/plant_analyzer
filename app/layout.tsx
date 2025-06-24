// Filename: app/layout.tsx (Versi Final yang Benar)

import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Header from '@/components/Header';
import AuthProvider from "@/components/AuthProvider"; // <-- Impor di sini

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tomato Disease Analyzer",
  description: "Analyze your tomato leaf diseases",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={geistSans.variable}>
      <body>
        <AuthProvider> {/* <-- BUNGKUS SEMUANYA DI SINI */}
          <Header />
          <main>
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}