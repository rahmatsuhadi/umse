"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, ShieldCheck } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { setToken } from "@/lib/token-service";

export default function GoogleAuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const hasTriggered = useRef(false);

  useEffect(() => {
    async function handleGoogleCallback() {
      if (hasTriggered.current) return;
      hasTriggered.current = true;

      const code = searchParams.get("code");
      const error = searchParams.get("error");

      if (error) {
        toast.error("Otorisasi Dibatalkan", {
          description: "Anda membatalkan login dengan Google.",
        });
        router.push("/masuk");
        return;
      }

      if (!code) {
        toast.error("Login Gagal", {
          description: "Kode otorisasi Google tidak ditemukan.",
        });
        router.push("/masuk");
        return;
      }

      try {
        const response = await fetch("/api/auth/google/callback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Gagal memverifikasi akun Google.");
        }

        queryClient.setQueryData(["user"], data.user);
        if (data.token) setToken(data.token);

        toast.success("Login Berhasil", {
          description: `Selamat datang kembali, ${data.user.name}.`,
        });
        router.push("/");
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Terjadi kesalahan saat memproses login Google.";
        toast.error("Login Gagal", {
          description: message,
        });
        router.push("/masuk");
      }
    }

    handleGoogleCallback();
  }, [queryClient, router, searchParams]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--cream)] px-4">
      <div className="absolute -left-16 top-10 h-56 w-56 rounded-full bg-[var(--terracotta)]/15 blur-3xl" />
      <div className="absolute -right-16 bottom-8 h-72 w-72 rounded-full bg-[#F5A623]/20 blur-3xl" />

      <section className="relative z-10 w-full max-w-md rounded-3xl border border-[var(--cream-dark)] bg-white/95 p-8 text-center shadow-[var(--shadow-md)]">
        <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-[var(--terracotta)]/10 px-4 py-1.5 text-sm font-semibold text-[var(--terracotta-dark)]">
          <ShieldCheck className="h-4 w-4" />
          Otentikasi Google
        </span>
        <Loader2 className="mx-auto mb-4 h-10 w-10 animate-spin text-[var(--terracotta)]" />
        <h1 className="text-2xl font-extrabold text-[var(--text-primary)]">Memproses Login</h1>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Mohon tunggu sebentar, kami sedang menyelesaikan autentikasi akun Anda.
        </p>
      </section>
    </main>
  );
}
