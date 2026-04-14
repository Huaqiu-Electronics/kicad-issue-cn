import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { Heart, Coffee } from "lucide-react";
import "./globals.css";
import ThemeToggle from "@/components/ThemeToggle";
import { ThemeProvider } from "@/components/ui/ThemeContext";
import ThemeApplier from "@/components/ThemeApplier";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KiCad Issue CN",
  description: "KiCad Issue Tracker (Chinese)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <ThemeApplier>
            <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between">
                  <Link href="/" className="text-2xl font-bold text-card-foreground">
                    KiCad Issue CN
                  </Link>
                  <div className="flex items-center gap-4">
                    <Link href="/issues" className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      问题列表
                    </Link>
                    <ThemeToggle />
                  </div>
                </div>
              </div>
            </header>
            <main className="flex-1">
              {children}
            </main>
            <footer className="border-t border-border bg-card">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-muted-foreground">
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <p className="flex items-center gap-1">
                    Powered by{" "}
                    <Link href="https://www.eda.cn/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline dark:text-blue-400">
                      eda.cn
                    </Link>
                  </p>
                  <span className="text-muted-foreground">•</span>
                  <p className="flex items-center gap-1">
                    Made with <Heart className="w-4 h-4 text-red-500" /> and <Coffee className="w-4 h-4 text-amber-600" />
                  </p>
                </div>
              </div>
            </footer>
          </ThemeApplier>
        </ThemeProvider>
      </body>
    </html>
  );
}
