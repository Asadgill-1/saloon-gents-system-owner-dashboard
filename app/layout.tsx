import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  title: "Gents Saloon Platform",
  description: "Platform operations dashboard",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body><a href="#main-content" className="skip-link">Skip to main content</a><div id="main-content" tabIndex={-1}>{children}</div></body>
    </html>
  );
}
