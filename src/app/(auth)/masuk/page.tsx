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
    <main
      style={{
        minHeight: "calc(100vh - 96px)",
        background: "var(--cream, #FFF9F4)",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 20px",
      }}
    >
      {/* Decorative blobs */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "-5%",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "rgba(247, 98, 10, 0.08)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          right: "-5%",
          width: "350px",
          height: "350px",
          borderRadius: "50%",
          background: "rgba(245, 166, 35, 0.12)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      {/* Two-column grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "40px",
          maxWidth: "960px",
          width: "100%",
          alignItems: "center",
          position: "relative",
          zIndex: 1,
        }}
        className="login-grid"
      >
        {/* Left info section */}
        <section
          style={{
            background: "white",
            borderRadius: "24px",
            border: "1.5px solid var(--cream-dark, #F0D5C2)",
            padding: "40px",
            boxShadow: "var(--shadow-md, 0 4px 20px rgba(44,24,16,0.12))",
          }}
          className="login-left-section"
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(247, 98, 10, 0.1)",
              color: "var(--terracotta-dark, #D45508)",
              padding: "6px 16px",
              borderRadius: "50px",
              fontSize: "14px",
              fontWeight: 600,
              marginBottom: "20px",
            }}
          >
            <ShieldCheck size={16} />
            Login Aman
          </span>

          <h1
            style={{
              fontSize: "clamp(28px, 3.5vw, 40px)",
              fontWeight: 800,
              color: "var(--text-primary, #1A1008)",
              lineHeight: 1.2,
              marginBottom: "16px",
            }}
          >
            Masuk ke Akun
            <br />
            <span style={{ color: "var(--terracotta, #F7620A)" }}>Sleman Mart</span>
          </h1>

          <p
            style={{
              fontSize: "15px",
              color: "var(--text-muted, #6B4C2A)",
              lineHeight: 1.7,
              maxWidth: "340px",
            }}
          >
            Akses pesanan, checkout lebih cepat, dan lanjutkan belanja produk UMKM lokal Sleman.
          </p>

          <div
            style={{
              marginTop: "32px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {[
              { icon: "🛒", text: "Pantau status pesanan real-time" },
              { icon: "⚡", text: "Checkout lebih cepat dengan data tersimpan" },
              { icon: "🏪", text: "Dukung UMKM lokal Sleman" },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  fontSize: "14px",
                  color: "var(--text-secondary, #4A3728)",
                }}
              >
                <span style={{ fontSize: "20px" }}>{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Right card section */}
        <Card
          style={{
            padding: "40px",
            width: "100%",
            borderRadius: "24px",
            border: "1.5px solid var(--cream-dark, #F0D5C2)",
            background: "rgba(255,255,255,0.97)",
            boxShadow: "var(--shadow-md, 0 4px 20px rgba(44,24,16,0.12))",
          }}
        >
          <CardHeader style={{ paddingBottom: "20px", textAlign: "center" }}>
            <CardTitle
              style={{
                fontSize: "28px",
                fontWeight: 800,
                color: "var(--text-primary, #1A1008)",
              }}
            >
              Masuk
            </CardTitle>
            <CardDescription
              style={{ color: "var(--text-muted, #6B4C2A)", fontSize: "14px" }}
            >
              Gunakan email dan password akun Anda
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <FormField
                  control={form.control}
                  disabled={isPending}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        style={{
                          fontWeight: 600,
                          color: "var(--text-secondary, #4A3728)",
                        }}
                      >
                        Email
                      </FormLabel>
                      <FormControl>
                        <div style={{ position: "relative" }}>
                          <Mail
                            size={16}
                            style={{
                              position: "absolute",
                              left: "14px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              color: "var(--brown-light, #9B7B5A)",
                            }}
                          />
                          <Input
                            {...field}
                            autoComplete="email"
                            type="email"
                            placeholder="email@contoh.com"
                            style={{
                              height: "48px",
                              borderRadius: "12px",
                              border: "1.5px solid var(--cream-dark, #F0D5C2)",
                              background: "white",
                              paddingLeft: "44px",
                              paddingRight: "16px",
                              paddingTop: "12px",
                              paddingBottom: "12px",
                            }}
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
                    <FormItem>
                      <FormLabel
                        style={{
                          fontWeight: 600,
                          color: "var(--text-secondary, #4A3728)",
                        }}
                      >
                        Password
                      </FormLabel>
                      <FormControl>
                        <div style={{ position: "relative" }}>
                          <LockKeyhole
                            size={16}
                            style={{
                              position: "absolute",
                              left: "14px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              color: "var(--brown-light, #9B7B5A)",
                            }}
                          />
                          <Input
                            autoComplete="current-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Masukkan password"
                            style={{
                              height: "48px",
                              borderRadius: "12px",
                              border: "1.5px solid var(--cream-dark, #F0D5C2)",
                              background: "white",
                              paddingLeft: "44px",
                              paddingRight: "44px",
                              paddingTop: "12px",
                              paddingBottom: "12px",
                            }}
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            style={{
                              position: "absolute",
                              right: "14px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              color: "var(--brown-light, #9B7B5A)",
                              display: "flex",
                              alignItems: "center",
                            }}
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

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    borderRadius: "12px",
                    border: "1.5px solid var(--cream-dark, #F0D5C2)",
                    background: "white",
                    padding: "8px",
                    overflowX: "auto",
                  }}
                >
                  <ReCAPTCHA
                    ref={captchaRef}
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                    onChange={setCaptchaToken}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isPending || !captchaToken}
                  style={{
                    height: "48px",
                    width: "100%",
                    borderRadius: "12px",
                    background: "var(--terracotta, #F7620A)",
                    color: "white",
                    fontSize: "15px",
                    fontWeight: 700,
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {isPending ? "Memproses..." : "Masuk"}
                </Button>
              </form>
            </Form>
          </CardContent>

          <CardFooter
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              paddingBottom: "28px",
            }}
          >
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                color: "var(--text-muted, #6B4C2A)",
                fontSize: "13px",
              }}
            >
              <div style={{ flex: 1, height: "1px", background: "var(--cream-dark, #F0D5C2)" }} />
              <span>atau</span>
              <div style={{ flex: 1, height: "1px", background: "var(--cream-dark, #F0D5C2)" }} />
            </div>

            <Button
              type="button"
              variant="outline"
              style={{
                height: "48px",
                width: "100%",
                borderRadius: "12px",
                border: "1.5px solid var(--cream-dark, #F0D5C2)",
                color: "var(--text-secondary, #4A3728)",
                fontSize: "14px",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                cursor: "pointer",
                background: "white",
              }}
              onClick={() => {
                window.location.href = "/api/auth/google";
              }}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Lanjut dengan Google
            </Button>

            <p style={{ fontSize: "14px", color: "var(--text-muted, #6B4C2A)" }}>
              Belum punya akun?{" "}
              <Link
                href="/daftar"
                style={{
                  color: "var(--terracotta, #F7620A)",
                  fontWeight: 700,
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                Daftar
                <ArrowRight size={14} />
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .login-grid {
            grid-template-columns: 1fr !important;
          }
          .login-left-section {
            display: none !important;
          }
        }
      `}</style>
    </main>
  );
}
