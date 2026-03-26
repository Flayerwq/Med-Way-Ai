import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/toaster";
import Script from "next/script";
// import { LogoutTimerProvider } from '@/lib/LogoutTimerContext';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ReportRx - The advanced medical AI",
  description:
    "ReportRx is a secure and intelligent AI platform for healthcare. Diagnose, report, and collaborate smarter and faster.",
  applicationName: "ReportRx",
  keywords: [
    "Medical AI",
    "Healthcare platform",
    "AI Diagnosis",
    "Medical Reports",
    "HIPAA Compliant",
  ],
  authors: [{ name: "ReportRx Team", url: "https://reportrx.in" }],
  creator: "ReportRx",
  publisher: "ReportRx Inc.",
  metadataBase: new URL("https://reportrx.in"),
  openGraph: {
    title: "ReportRx - The advanced medical AI",
    description:
      "A secure, fast, and reliable AI platform for medical image analysis and reporting.",
    url: "https://reportrx.in",
    siteName: "ReportRx",
    images: [
      {
        url: "https://i.postimg.cc/4dCLmmgt/6100173661924344835.jpg", // ✅ Place your logo in public folder
        width: 800,
        height: 600,
        alt: "ReportRx Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ReportRx - The advanced medical AI",
    description:
      "Diagnose and manage medical reports with AI-powered precision.",
    images: ["https://i.postimg.cc/4dCLmmgt/6100173661924344835.jpg"],
    creator: "@ReportRx",
  },
  icons: {
    icon: "https://i.postimg.cc/4dCLmmgt/6100173661924344835.jpg",
    shortcut: "https://i.postimg.cc/4dCLmmgt/6100173661924344835.jpg",
    apple: "https://i.postimg.cc/4dCLmmgt/6100173661924344835.jpg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            {children}
            <Toaster />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
