"use client";
import BasicLayout from "@/layouts/BasicLayout";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "@ant-design/v5-patch-for-react-19";
import { SessionProvider } from "next-auth/react";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <AntdRegistry>
            <BasicLayout>{children}</BasicLayout>
          </AntdRegistry>
        </SessionProvider>
      </body>
    </html>
  );
}
