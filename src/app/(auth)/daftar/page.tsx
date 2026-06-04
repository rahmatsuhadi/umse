"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "sonner";
import { ArrowRight, Eye, EyeOff, FileText, LockKeyhole, Mail, Phone, User2 } from "lucide-react";
import { withMask } from "use-mask-input";

import { useRegister } from "@/features/auth/hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import SelectASNApiSearch from "@/components/auth/SelectAsn";

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

const formSchema = z
  .object({
    phone_number: z
      .string()
      .min(1, { message: "Nomor HP tidak boleh kosong." })
      .transform((val) => val.replace(/\s+/g, ""))
      .refine((val) => /^08[0-9]{8,12}$/.test(val), {
        message: "Nomor harus diawali 08 dan panjangnya 10-14 digit",
      }),
    name: z.string().min(1, { message: "Nama tidak boleh kosong." }),
    password: z
      .string()
      .min(8, { message: "Password minimal 8 karakter." })
      .regex(/[A-Z]/, { message: "Password harus mengandung huruf besar." })
      .regex(/[a-z]/, { message: "Password harus mengandung huruf kecil." })
      .regex(/[0-9]/, { message: "Password harus mengandung angka." })
      .regex(/[^A-Za-z0-9]/, { message: "Password harus mengandung simbol." }),
    password_confirmation: z.string().min(1, { message: "Konfirmasi password wajib diisi." }),
    email: z
      .string()
      .min(1, { message: "Email tidak boleh kosong." })
      .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
        message: "Format email tidak valid.",
      }),
    is_asn: z.boolean(),
    asn_proof_document: z.file().optional(),
    organization_id: z.string().optional(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Konfirmasi password tidak cocok.",
    path: ["password_confirmation"],
  })
  .refine((data) => !data.is_asn || !!data.organization_id, {
    message: "Badan usaha wajib dipilih untuk ASN.",
    path: ["organization_id"],
  })
  .refine((data) => !data.is_asn || !!data.asn_proof_document, {
    message: "Dokumen ASN wajib diunggah.",
    path: ["asn_proof_document"],
  })
  .superRefine((data, ctx) => {
    const file = data.asn_proof_document;
    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      ctx.addIssue({
        code: "custom",
        path: ["asn_proof_document"],
        message: "File harus JPG, JPEG, PNG, atau WEBP.",
      });
    }
    if (file.size > MAX_FILE_SIZE) {
      ctx.addIssue({
        code: "custom",
        path: ["asn_proof_document"],
        message: "Ukuran file maksimal 2MB.",
      });
    }
  });

/* Shared inline styles -------------------------------------------------- */
const inputStyle: React.CSSProperties = {
  height: "48px",
  borderRadius: "12px",
  border: "1.5px solid var(--cream-dark, #F0D5C2)",
  background: "white",
  paddingLeft: "44px",
  paddingRight: "16px",
  paddingTop: "12px",
  paddingBottom: "12px",
};

const inputWithRightStyle: React.CSSProperties = {
  ...inputStyle,
  paddingRight: "44px",
};

const iconStyle: React.CSSProperties = {
  position: "absolute",
  left: "14px",
  top: "50%",
  transform: "translateY(-50%)",
  color: "var(--brown-light, #9B7B5A)",
};

const labelStyle: React.CSSProperties = {
  fontWeight: 600,
  color: "var(--text-secondary, #4A3728)",
};
/* ----------------------------------------------------------------------- */

export default function DaftarPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordAgain, setShowPasswordAgain] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState<string | null>(null);
  const captchaRef = useRef<ReCAPTCHA>(null);
  const { mutate: handleRegister, isPending } = useRegister();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    criteriaMode: "all",
    defaultValues: {
      phone_number: "",
      email: "",
      password: "",
      password_confirmation: "",
      name: "",
      is_asn: false,
      organization_id: "",
    },
  });

  const isAsnChecked = form.watch("is_asn");

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!captchaToken) {
      setCaptchaError("Harap selesaikan verifikasi reCAPTCHA terlebih dahulu.");
      return;
    }
    setCaptchaError(null);

    handleRegister(
      { ...values, captchaToken },
      {
        onSuccess: () => {
          captchaRef.current?.reset();
          setCaptchaToken(null);
          toast.success("Pendaftaran Berhasil", {
            description: "Akun berhasil dibuat. Silakan login.",
          });
          router.push("/masuk");
        },
        onError: (error) => {
          captchaRef.current?.reset();
          setCaptchaToken(null);
          toast.error("Pendaftaran Gagal", {
            description: error.message || "Periksa data yang Anda masukkan.",
          });
        },
      }
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    form.clearErrors("asn_proof_document");
    if (!file) {
      form.setValue("asn_proof_document", undefined);
      return;
    }
    form.setValue("asn_proof_document", file, { shouldValidate: true });
  };

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
            Bergabung dengan <span>Sleman Mart</span>.
          </h1>
          
          <p className="auth-split-desc">
            Daftarkan akun untuk menikmati pengalaman belanja produk lokal Sleman yang lebih mudah, aman, dan terpercaya.
          </p>
          
          {/* Info Card inside Left Panel */}
          <div className="auth-split-features">
            <div className="auth-split-feature-item">
              <div className="auth-split-feature-icon">
                <FileText size={18} />
              </div>
              <div>
                <h4 className="auth-split-feature-title">Registrasi Gratis</h4>
                <p className="auth-split-feature-desc">Daftar sekarang tanpa biaya sepeser pun dan nikmati akses penuh.</p>
              </div>
            </div>
            
            <div className="auth-split-feature-item">
              <div className="auth-split-feature-icon">
                <i className="fas fa-store"></i>
              </div>
              <div>
                <h4 className="auth-split-feature-title">Ratusan Merchant</h4>
                <p className="auth-split-feature-desc">Temukan dan beli produk segar dan kerajinan tangan khas Sleman.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Slogan Footer */}
        <div className="auth-split-left-footer">
          <span>&copy; {new Date().getFullYear()} Sleman Mart. All rights reserved.</span>
        </div>
      </section>

      {/* Right Column: Registration Form */}
      <section className="auth-split-right">
        <div className="auth-split-form-container">
          {/* Brand Logo & Header */}
          <div className="auth-split-header">
            <div className="auth-split-logo-fallback">
              <span className="auth-split-logo-badge">SM</span>
              <span className="auth-split-logo-text-primary">Sleman</span><span className="auth-split-logo-text-accent">Mart</span>
            </div>
            
            <h2 className="auth-split-form-title">
              Buat Akun Baru
            </h2>
            <p className="auth-split-form-subtitle">
              Lengkapi data berikut untuk membuat akun belanja Anda.
            </p>
          </div>

          {/* Form */}
          <div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Nama */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="checkout-input-group mb-0">
                      <FormLabel className="checkout-input-label">Nama Lengkap</FormLabel>
                      <FormControl>
                        <div className="checkout-input-wrapper">
                          <User2 size={16} className="checkout-input-icon" />
                          <Input
                            {...field}
                            placeholder="Masukkan nama lengkap Anda"
                            className="checkout-input"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="checkout-input-group mb-0">
                      <FormLabel className="checkout-input-label">Email</FormLabel>
                      <FormControl>
                        <div className="checkout-input-wrapper">
                          <Mail size={16} className="checkout-input-icon" />
                          <Input
                            {...field}
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

                {/* Nomor HP */}
                <FormField
                  control={form.control}
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem className="checkout-input-group mb-0">
                      <FormLabel className="checkout-input-label">Nomor HP</FormLabel>
                      <FormControl>
                        <div className="checkout-input-wrapper">
                          <Phone size={16} className="checkout-input-icon" />
                          <Input
                            {...field}
                            autoComplete="tel"
                            placeholder="08xx xxxx xxxx"
                            className="checkout-input"
                            ref={withMask("999 9999 9999 999999", {
                              placeholder: "",
                              showMaskOnHover: false,
                            }) as unknown as React.Ref<HTMLInputElement>}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="checkout-input-group mb-0">
                      <FormLabel className="checkout-input-label">Password</FormLabel>
                      <FormControl>
                        <div className="checkout-input-wrapper">
                          <LockKeyhole size={16} className="checkout-input-icon" />
                          <Input
                            autoComplete="new-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Minimal 8 karakter"
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

                {/* Konfirmasi Password */}
                <FormField
                  control={form.control}
                  name="password_confirmation"
                  render={({ field }) => (
                    <FormItem className="checkout-input-group mb-0">
                      <FormLabel className="checkout-input-label">Konfirmasi Password</FormLabel>
                      <FormControl>
                        <div className="checkout-input-wrapper">
                          <LockKeyhole size={16} className="checkout-input-icon" />
                          <Input
                            autoComplete="new-password"
                            type={showPasswordAgain ? "text" : "password"}
                            placeholder="Ulangi password Anda"
                            className="checkout-input"
                            style={{ paddingRight: "44px" }}
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswordAgain((prev) => !prev)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--brown-light)] hover:text-[var(--terracotta)] cursor-pointer flex items-center justify-center transition-colors"
                            aria-label="Toggle confirm password visibility"
                          >
                            {showPasswordAgain ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* ASN Checkbox */}
                <FormField
                  control={form.control}
                  name="is_asn"
                  render={({ field }) => (
                    <FormItem className="mb-0">
                      <div
                        className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[var(--cream-dark)] bg-white cursor-pointer hover:border-[var(--terracotta)] transition-colors"
                        onClick={() => field.onChange(!field.value)}
                      >
                        <Checkbox checked={field.value} />
                        <span className="text-xs lg:text-sm font-semibold text-[var(--text-secondary)] select-none">
                          Apakah Anda ASN (Aparatur Sipil Negara)?
                        </span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* ASN Fields (conditional) */}
                {isAsnChecked && (
                  <div className="space-y-4 p-4 rounded-2xl bg-[var(--cream)] border border-[var(--cream-dark)] animate-slide-up">
                    <FormField
                      control={form.control}
                      name="organization_id"
                      render={({ field }) => (
                        <FormItem className="mb-0">
                          <FormLabel className="checkout-input-label">Badan Usaha</FormLabel>
                          <FormControl>
                            <SelectASNApiSearch onChange={field.onChange} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="asn_proof_document"
                      render={() => (
                        <FormItem className="checkout-input-group mb-0">
                          <FormLabel className="checkout-input-label">Unggah Bukti ASN</FormLabel>
                          <FormControl>
                            <Input
                              type="file"
                              accept=".jpeg,.jpg,.png,.webp"
                              onChange={handleFileChange}
                              className="checkout-input pt-2"
                              style={{ paddingLeft: "16px" }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* reCAPTCHA */}
                <div className="flex items-center justify-center p-2 border border-[var(--cream-dark)] rounded-2xl bg-white shadow-xs">
                  <ReCAPTCHA
                    ref={captchaRef}
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                    onChange={(token) => {
                      setCaptchaToken(token);
                      if (token) setCaptchaError(null);
                    }}
                  />
                </div>
                {captchaError && (
                  <p className="text-xs text-[#E74C3C] mt-1 flex items-center gap-1 font-medium">
                    <span>⚠</span> {captchaError}
                  </p>
                )}

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={isPending}
                  className="checkout-btn-full w-full h-12 rounded-xl text-base font-bold transition-all duration-200 mt-2"
                >
                  {isPending ? "Memproses..." : "Daftar Sekarang"}
                </Button>
              </form>
            </Form>
          </div>

          {/* Social SSO / Switcher links */}
          <div className="flex flex-col gap-4 pt-4 border-t border-[var(--cream-dark)]/40 mt-6">
            <div className="auth-split-divider">
              <div className="auth-split-divider-line" />
              <span>atau daftar dengan</span>
              <div className="auth-split-divider-line" />
            </div>

            {/* Google SSO Button */}
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
              <span>Daftar dengan Google</span>
            </Button>

            <p className="text-sm text-[var(--text-muted)] text-center">
              Sudah punya akun?{" "}
              <Link
                href="/masuk"
                className="text-[var(--terracotta)] hover:text-[var(--terracotta-dark)] font-extrabold inline-flex items-center gap-1.5 transition-colors group"
              >
                <span>Masuk Sekarang</span>
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

      {/* Styles */}
      <style>{`
        /* Form error message styling */
        [data-slot="form-message"],
        .form-message {
          font-size: 11px !important;
          color: #E74C3C !important;
          margin-top: 6px !important;
          display: flex !important;
          align-items: center !important;
          gap: 4px !important;
          font-weight: 500 !important;
        }
      `}</style>
    </main>
  );
}
