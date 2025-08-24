import type { Metadata } from "next";
import { Plus_Jakarta_Sans, 
  // Poppins
 } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import NextTopLoader from 'nextjs-toploader';
// const poppins = Poppins({
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700"],
//   variable: "--font-poppins",
// });

const jakarta = Plus_Jakarta_Sans({ // Daftarkan font Plus Jakarta Sans
  subsets: ["latin",],
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
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
          integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body
        className={`${jakarta.variable} antialiased font-jakarta bg-white`}
      >
        <NextTopLoader  color="#e57f39" />
        <ReactQueryProvider>
        {children}
        </ReactQueryProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
