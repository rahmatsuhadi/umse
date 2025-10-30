"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { CheckoutStep, steps } from "./lib";
import { useRouter } from "next/navigation";

export default function CheckoutHeader({
  currentStep,
  index,
}: {
  currentStep: CheckoutStep;
  index: number;
}) {
  const router = useRouter();

  return (
    <header className="bg-white shadow-md sticky top-0 z-40 md:px-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between min-h-16 py-2">
          <div className="flex items-center">
            <Image
              src="/logo_kab_sleman.png"
              alt="Slemanmart Logo"
              width={45}
              height={45}
            />

            <div className="flex-shrink-0 ml-4">
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/slemanmartlogo.png"
                  alt="Slemanmart Logo"
                  width={150}
                  height={150}
                />
              </Link>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-600 hover:text-primary">
              Beranda
            </Link>
            <i className="fas fa-chevron-right text-gray-400 text-xs"></i>

            <Link
              href="/keranjang"
              className="text-gray-600 hover:text-primary"
            >
              Keranjang
            </Link>

            {steps.slice(0, index + 1).map((s, index) => (
              <React.Fragment key={index}>
                <i className="fas fa-chevron-right text-gray-400 text-xs"></i>
                <span
                  className={
                    s.key === currentStep
                      ? "text-primary font-medium"
                      : "text-gray-600"
                  }
                >
                  {s.label}
                </span>
              </React.Fragment>
            ))}
          </nav>

          {/* <Link href="/keranjang" className="text-gray-600 hover:text-primary">
                            <i className="fas fa-arrow-left mr-2"></i>Kembali
                        </Link>
                         */}
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:cursor-pointer hover:text-primary"
          >
            <i className="fas fa-arrow-left mr-2"></i>Kembali
          </button>
        </div>
      </div>
    </header>
  );
}
