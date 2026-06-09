"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { CheckoutStep, steps } from "./lib";
import { useRouter } from "next/navigation";
import { useWebSettings } from "@/features/settings/hooks";

export default function CheckoutHeader({
  currentStep,
  index,
}: {
  currentStep: CheckoutStep;
  index: number;
}) {
  const router = useRouter();
  const { data: webSettings } = useWebSettings();
  const settings = webSettings?.data;

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-[var(--cream-dark)] sticky top-0 z-40 md:px-10 transition-all duration-300">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between min-h-16 py-3">
          <div className="flex items-center gap-3">
            <div className="relative hover:scale-105 transition-transform duration-200">
              <Image
                src="/logo_kab_sleman.png"
                alt="Slemanmart Logo"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>

            <div className="h-6 w-px bg-[var(--cream-dark)]"></div>

            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity duration-200">
                <Image
                  src={settings?.site_identity?.logo_url || "/slemanmartlogo.png"}
                  alt={settings?.site_identity?.app_name || "Slemanmart Logo"}
                  width={130}
                  height={130}
                  className="object-contain"
                />
              </Link>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-2 text-sm font-semibold">
            <Link href="/" className="text-[var(--text-secondary)] hover:text-[var(--terracotta)] transition-colors duration-200">
              Beranda
            </Link>
            <i className="fas fa-chevron-right text-[var(--text-muted)] opacity-50 text-[10px]"></i>

            <Link
              href="/keranjang"
              className="text-[var(--text-secondary)] hover:text-[var(--terracotta)] transition-colors duration-200"
            >
              Keranjang
            </Link>

            {steps.slice(0, index + 1).map((s) => (
              <React.Fragment key={s.key}>
                <i className="fas fa-chevron-right text-[var(--text-muted)] opacity-50 text-[10px]"></i>
                <span
                  className={
                    s.key === currentStep
                      ? "text-[var(--terracotta)] font-bold"
                      : "text-[var(--text-muted)] font-medium"
                  }
                >
                  {s.label}
                </span>
              </React.Fragment>
            ))}
          </nav>

          <button
            onClick={() => router.back()}
            className="group flex items-center gap-1.5 text-sm font-bold text-[var(--text-secondary)] hover:cursor-pointer hover:text-[var(--terracotta)] transition-colors duration-200 bg-white hover:bg-[var(--cream)] px-4 py-1.5 rounded-full border border-[var(--cream-dark)] hover:border-[var(--terracotta-light)]/40 shadow-sm"
          >
            <i className="fas fa-arrow-left text-xs transition-transform duration-200 group-hover:-translate-x-1"></i>
            <span>Kembali</span>
          </button>
        </div>
      </div>
    </header>
  );
}
