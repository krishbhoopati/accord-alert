import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AccordAlert — Contract Compliance Tracker",
  description: "AI-powered contract compliance tracking platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
