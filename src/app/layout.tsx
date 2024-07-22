import TopProgressBar from "@/components/TopProgressBar";
import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";
import { Providers } from "./providers";



export const metadata: Metadata = {
  title: "Leave Management",
  description: "Leave Management System",
  icons:"/favicon.ico",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body >
        <TopProgressBar>
          <Providers>
            {children}
            <Toaster richColors />
          </Providers>
        </TopProgressBar>
      </body>
    </html>
  );
}
