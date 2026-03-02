import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/shared/Navbar";

export default function ProductLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
}
