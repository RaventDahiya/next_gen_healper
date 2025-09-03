import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Provider from "./provider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NextGenHelper AI - Professional AI Assistant",
  description:
    "Advanced AI Assistant with multiple AI models including ChatGPT, Gemini, DeepSeek, and more. Boost your productivity with personalized AI assistants.",
  keywords:
    "AI assistant, ChatGPT, Gemini, DeepSeek, AI chat, productivity, artificial intelligence, OpenAI, conversation AI",
  authors: [{ name: "NextGenHelper Team" }],
  creator: "NextGenHelper",
  publisher: "NextGenHelper",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "NextGenHelper AI - Professional AI Assistant",
    description:
      "Advanced AI Assistant with multiple AI models for enhanced productivity",
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    siteName: "NextGenHelper AI",
    images: [
      {
        url: "/nextgenhelper_ai_logo.png",
        width: 1200,
        height: 630,
        alt: "NextGenHelper AI Assistant",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NextGenHelper AI - Professional AI Assistant",
    description:
      "Advanced AI Assistant with multiple AI models for enhanced productivity",
    images: ["/nextgenhelper_ai_logo.png"],
    creator: "@nextgenhelper",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your verification tokens here when available
    // google: 'your-google-verification-token',
    // yandex: 'your-yandex-verification-token',
    // bing: 'your-bing-verification-token',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Provider>{children}</Provider>
        <Toaster />
      </body>
    </html>
  );
}
