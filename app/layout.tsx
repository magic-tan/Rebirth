import type { Metadata } from "next";
import "./globals.css";
import { Agentation } from "agentation";
import { ClerkProvider } from '@clerk/nextjs'

export const metadata: Metadata = {
  title: "重生 - 目标拆解管理",
  description: "设定大目标，AI帮你拆解成可执行的小任务",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="zh-CN">
        <body>
          {children}
          {process.env.NODE_ENV === "development" && <Agentation />}
        </body>
      </html>
    </ClerkProvider>
  );
}
