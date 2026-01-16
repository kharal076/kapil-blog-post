import type { Metadata } from "next";
import {  Inter } from "next/font/google";
import "./globals.css";

import ThemeProvider from '@/components/ThemeProvider';
import Navbar from '@/components/Navbar';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BlogPlatform - Share Your Stories',
  description: 'Create, publish, and manage your blog posts effortlessly',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
