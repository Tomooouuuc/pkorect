"use client";
import BasicLayout from "@/layouts/BasicLayout";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "@ant-design/v5-patch-for-react-19";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AntdRegistry>
          {/* <SessionLayout> */}
          <BasicLayout>{children}</BasicLayout>
          {/* </SessionLayout> */}
        </AntdRegistry>
      </body>
    </html>
  );
}
