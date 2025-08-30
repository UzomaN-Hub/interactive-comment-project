import type { Metadata } from "next";
import { rubik } from '@/app/fonts';
import './globals.css';


export const metadata: Metadata = {
  title: "Interactive Comment Section",
  description: "A modern, interactive comment section built with Next.js and React.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${rubik.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
