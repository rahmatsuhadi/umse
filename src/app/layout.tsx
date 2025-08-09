import type { Metadata } from "next";
import {Plus_Jakarta_Sans, Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import { Toaster } from "@/components/ui/sonner";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

const jakarta = Plus_Jakarta_Sans({ // Daftarkan font Plus Jakarta Sans
  subsets: ["latin", ],
  weight: ["400", "500", "600", "700", "800",],
  display: "swap",
  style: ["normal", "italic"],
  variable: "--font-jakarta",
});


export const metadata: Metadata = {
  title: "Sleman Mart",
  description: "Markeplace UMKM",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
       className={`
        ${jakarta.variable} antialiased bg-white`}
      >
        <Navbar /> 
        {children}
        <Toaster />
      </body>
    </html>
  );
}
