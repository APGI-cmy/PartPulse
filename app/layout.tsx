import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/ui/sidebar";
import AuthProvider from "@/components/auth/SessionProvider";

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
        <AuthProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 overflow-auto bg-gray-50 lg:ml-0">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
