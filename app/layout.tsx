import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google"; // Switch to Google Font
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DietTracker Protocol",
  description: "Daily protocol tracker for Vegetarian Transformation",
  manifest: "/manifest.json",
  icons: {
    icon: "/Icon.png",
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "DietTracker",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#020617",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased bg-slate-950`}
      >
        {children}
      </body>
    </html>
  );
}
