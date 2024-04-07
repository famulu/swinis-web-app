import type { Metadata } from "next";
import "./globals.css";
import { openSans, yesevaOne, signika, garamond } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "SWINIS",
  description: "Swinburne Islamic Society Homepage",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${openSans.variable} ${yesevaOne.variable} ${signika.variable} ${garamond.variable}`}
    >
      <body className="font-sans">{children}</body>
    </html>
  );
}
