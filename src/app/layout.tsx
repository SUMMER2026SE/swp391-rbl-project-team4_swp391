import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://quali-ielts.com"),
  title: "Quali IELTS | Nền tảng Luyện thi IELTS AI thế hệ mới",
  description: "Quali IELTS - Nền tảng luyện thi IELTS AI thế hệ mới, đầy đủ tài liệu, bài luyện, phương pháp giúp bạn chinh phục IELTS dễ dàng hơn mỗi ngày.",
  icons: {
    icon: "/icon.png",
  },
  openGraph: {
    title: "Quali IELTS | Nền tảng Luyện thi IELTS AI thế hệ mới",
    description: "Quali IELTS - Nền tảng luyện thi IELTS AI thế hệ mới, đầy đủ tài liệu, bài luyện, phương pháp giúp bạn chinh phục IELTS dễ dàng hơn mỗi ngày.",
    images: [
      {
        url: "/opengraph-image.png",
        width: 512,
        height: 512,
        alt: "Quali IELTS Logo",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>{children}</body>
    </html>
  );
}
