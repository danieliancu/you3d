import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "3D Chibi Avatar Creator",
  description: "Convert your photos into cute 3D stylized characters inspired by the provided reference style.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://cdn.tailwindcss.com"
          strategy="beforeInteractive"
        />
      </head>
      <body className="bg-gray-50 min-h-screen">{children}</body>
    </html>
  );
}
