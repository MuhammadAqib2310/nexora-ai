import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "NEXORA AI — The AI Business Operating System",
    template: "%s | NEXORA AI",
  },
  description:
    "Build, automate, and scale your business with NEXORA AI — the world's first AI-native Business Operating System.",
  keywords: [
    "AI business platform",
    "CRM",
    "marketing automation",
    "AI CEO",
    "business operating system",
  ],
  openGraph: {
    title: "NEXORA AI",
    description: "The AI Operating System For Modern Businesses",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
