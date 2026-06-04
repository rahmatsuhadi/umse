"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import ReCAPTCHA from "react-google-recaptcha";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from "lucide-react";

import { useLogin } from "@/features/auth/hooks";
import { getToken, setToken } from "@/lib/token-service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email tidak boleh kosong." })
    .email({ message: "Format email tidak valid." }),
  password: z
    .string()
    .min(1, { message: "Password tidak boleh kosong." })
    .max(100, { message: "Password terlalu panjang." }),
});

export default function LoginPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captchaRef = useRef<ReCAPTCHA>(null);

  const { mutate: handleLogin, isPending } = useLogin();

  useEffect(() => {
    const token = getToken();
    if (token) router.push("/");
  }, [router]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!captchaToken) return;

    handleLogin(
      {
        credentials: { ...values, captchaToken },
        redirectUrl,
      },
      {
        onSuccess: ({ data }, variables) => {
          queryClient.setQueryData(["user"], data.user);
          if (data.token) setToken(data.token);

          toast.success("Login Berhasil", {
            description: `Selamat datang kembali, ${data.user.name}.`,
          });

          captchaRef.current?.reset();
          setCaptchaToken(null);
          router.push(variables.redirectUrl || "/");
        },
        onError: () => {
          captchaRef.current?.reset();
          setCaptchaToken(null);
          toast.error("Login Gagal", {
            description: "Email atau password tidak valid.",
          });
        },
      }
    );
  }

  return (
    <main className="auth-split-wrapper">
      {/* Left Column: Brand Info Banner */}
      <section className="auth-split-left">
        {/* Background Decorative Pattern */}
        <div className="auth-split-pattern"></div>
        
        <div className="auth-split-left-content">
          <span className="auth-split-badge">
            Sleman Mart
          </span>
          
          <h1 className="auth-split-title">
            Temukan Potensi Terbaik <span>Dirimu</span>.
          </h1>
          
          <p className="auth-split-desc">
            Dukung gerakan belanja produk lokal dari ratusan UMKM unggulan Sleman dengan transaksi digital yang aman, cepat, dan transparan.
          </p>
          
          {/* Info Card inside Left Panel */}
          <div className="auth-split-features">
            <div className="auth-split-feature-item">
              <div className="auth-split-feature-icon">
                <ShieldCheck size={18} />
              </div>
              <div>
                <h4 className="auth-split-feature-title">Belanja Aman & Cepat</h4>
                <p className="auth-split-feature-desc">Seluruh pembayaran terenkripsi aman dan diproses langsung secara instan.</p>
              </div>
            </div>
            
            <div className="auth-split-feature-item">
              <div className="auth-split-feature-icon">
                <i className="fas fa-store"></i>
              </div>
              <div>
                <h4 className="auth-split-feature-title">Produk Terkurasi</h4>
                <p className="auth-split-feature-desc">Produk didaftarkan langsung oleh UMKM binaan resmi Kabupaten Sleman.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Slogan Footer */}
        <div className="auth-split-left-footer">
          <span>&copy; {new Date().getFullYear()} Sleman Mart. All rights reserved.</span>
        </div>
      </section>

      {/* Right Column: Login Form */}
      <section className="auth-split-right">
        <div className="auth-split-form-container">
          {/* Brand Logo & Header */}
          <div className="auth-split-header">
            <div className="auth-split-logo-fallback">
              <span className="auth-split-logo-badge">SM</span>
              <span className="auth-split-logo-text-primary">Sleman</span><span className="auth-split-logo-text-accent">Mart</span>
            </div>
            
            <h2 className="auth-split-form-title">
              Masuk ke Akun
            </h2>
            <p className="auth-split-form-subtitle">
              Akses pesanan dan nikmati kemudahan belanja produk lokal.
            </p>
          </div>

          {/* Form */}
          <div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  disabled={isPending}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="checkout-input-group mb-0">
                      <FormLabel className="checkout-input-label">Email</FormLabel>
                      <FormControl>
                        <div className="checkout-input-wrapper">
                          <Mail size={16} className="checkout-input-icon" />
                          <Input
                            {...field}
                            autoComplete="email"
                            type="email"
                            placeholder="email@contoh.com"
                            className="checkout-input"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  disabled={isPending}
                  render={({ field }) => (
                    <FormItem className="checkout-input-group mb-0">
                      <FormLabel className="checkout-input-label">Password</FormLabel>
                      <FormControl>
                        <div className="checkout-input-wrapper">
                          <LockKeyhole size={16} className="checkout-input-icon" />
                          <Input
                            autoComplete="current-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Masukkan password Anda"
                            className="checkout-input"
                            style={{ paddingRight: "44px" }}
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--brown-light)] hover:text-[var(--terracotta)] cursor-pointer flex items-center justify-center transition-colors"
                            aria-label="Toggle password visibility"
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-center p-2 border border-[var(--cream-dark)] rounded-2xl bg-white shadow-xs">
                  <ReCAPTCHA
                    ref={captchaRef}
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                    onChange={setCaptchaToken}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isPending || !captchaToken}
                  className="checkout-btn-full w-full h-12 rounded-xl text-base font-bold transition-all duration-200 mt-2"
                >
                  {isPending ? (
                    <div className="flex items-center justify-center gap-2">
                      <i className="fas fa-spinner animate-spin"></i>
                      <span>Memproses...</span>
                    </div>
                  ) : (
                    <span>Masuk Sekarang</span>
                  )}
                </Button>
              </form>
            </Form>
          </div>

          {/* Social SSO / switch account links */}
          <div className="flex flex-col gap-5 pt-4 border-t border-[var(--cream-dark)]/40 mt-6">
            <div className="auth-split-divider">
              <div className="auth-split-divider-line" />
              <span>atau masuk dengan</span>
              <div className="auth-split-divider-line" />
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full h-12 rounded-xl border border-[var(--cream-dark)] bg-white hover:bg-[var(--cream)] text-[var(--text-secondary)] font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
              onClick={() => {
                window.location.href = "/api/auth/google";
              }}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span>Masuk dengan Google</span>
            </Button>

            <p className="text-sm text-[var(--text-muted)] text-center">
              Belum punya akun?{" "}
              <Link
                href="/daftar"
                className="text-[var(--terracotta)] hover:text-[var(--terracotta-dark)] font-extrabold inline-flex items-center gap-1.5 transition-colors group"
              >
                <span>Daftar Sekarang</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </p>
          </div>
        </div>
        
        {/* Footer info link */}
        <div className="auth-split-footer-link">
          <Link href="/" className="text-xs text-[var(--text-muted)] hover:text-[var(--terracotta)] inline-flex items-center gap-1.5 font-bold transition-colors">
            <i className="fas fa-arrow-left"></i> Kembali ke Beranda Utama
          </Link>
        </div>
      </section>
    </main>
  );
}
