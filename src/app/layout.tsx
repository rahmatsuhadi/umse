import type { Metadata } from "next";
import {Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import { Toaster } from "@/components/ui/sonner";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // Sertakan berbagai weight yang dibutuhkan
  variable: "--font-poppins", // Buat CSS variable
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
       className={`${poppins.variable} antialiased bg-white`}
      >
        <Navbar /> 
        {children}
        <Toaster />
      </body>
    </html>
  );
}
