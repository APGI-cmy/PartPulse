import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/ui/sidebar";

export const metadata: Metadata = {
  title: "PartPulse - Part Distribution App",
  description: "Internal transfer and warranty claims management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 overflow-auto bg-gray-50">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
