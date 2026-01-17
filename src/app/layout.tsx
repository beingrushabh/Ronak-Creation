import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Ronak Creation – Lehenga Catalog",
  description: "Manufacturers of fancy lehenga and ethnic wear for retailers across India",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 w-full mx-auto p-4 max-w-7xl">{children}</main>
      </body>
    </html>
  );
}
