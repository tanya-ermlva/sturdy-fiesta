import type { Metadata } from "next";
import "./globals.css";
import { themeScript } from "./theme-script";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Just working on my portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
