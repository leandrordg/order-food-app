import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { Header } from "@/components/header";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OrderFoodNow",
  description: "Peça a sua comida favorita de forma rápida e prática",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <html lang="pt-BR">
        <body className={`${inter.className} antialiased`}>
          <Toaster />
          <Header />
          {children}
        </body>
      </html>
    </SessionProvider>
  );
}
