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
  const captchaRef = useRef<ReCAPTCHA>(null);
  const { mutate: handleRegister, isPending } = useRegister();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
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
    if (!captchaToken) return;

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
          top: "8%",
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
          bottom: "8%",
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
          alignItems: "start",
          position: "relative",
          zIndex: 1,
        }}
        className="daftar-grid"
      >
        {/* Left info section */}
        <section
          style={{
            background: "white",
            borderRadius: "24px",
            border: "1.5px solid var(--cream-dark, #F0D5C2)",
            padding: "40px",
            boxShadow: "var(--shadow-md, 0 4px 20px rgba(44,24,16,0.12))",
            position: "sticky",
            top: "24px",
          }}
          className="daftar-left-section"
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
            <FileText size={16} />
            Akun Baru
          </span>

          <h1
            style={{
              fontSize: "clamp(26px, 3vw, 38px)",
              fontWeight: 800,
              color: "var(--text-primary, #1A1008)",
              lineHeight: 1.2,
              marginBottom: "16px",
            }}
          >
            Bergabung dengan
            <br />
            <span style={{ color: "var(--terracotta, #F7620A)" }}>Sleman Mart</span>
          </h1>

          <p
            style={{
              fontSize: "15px",
              color: "var(--text-muted, #6B4C2A)",
              lineHeight: 1.7,
              maxWidth: "320px",
            }}
          >
            Daftarkan akun untuk menikmati pengalaman belanja UMKM lokal yang lebih cepat dan aman.
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
              { icon: "✅", text: "Daftar gratis, tanpa biaya apapun" },
              { icon: "🛡️", text: "Data Anda aman & terenkripsi" },
              { icon: "🏪", text: "Akses ratusan produk UMKM Sleman" },
              { icon: "⚡", text: "Proses checkout yang lebih cepat" },
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
                <span style={{ fontSize: "18px" }}>{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Right card — Registration form */}
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
              Daftar
            </CardTitle>
            <CardDescription
              style={{ color: "var(--text-muted, #6B4C2A)", fontSize: "14px" }}
            >
              Lengkapi data berikut untuk membuat akun
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                style={{ display: "flex", flexDirection: "column", gap: "16px" }}
              >
                {/* Nama */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel style={labelStyle}>Nama Lengkap</FormLabel>
                      <FormControl>
                        <div style={{ position: "relative" }}>
                          <User2 size={16} style={iconStyle} />
                          <Input
                            {...field}
                            placeholder="Nama lengkap"
                            style={inputStyle}
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
                    <FormItem>
                      <FormLabel style={labelStyle}>Email</FormLabel>
                      <FormControl>
                        <div style={{ position: "relative" }}>
                          <Mail size={16} style={iconStyle} />
                          <Input
                            {...field}
                            type="email"
                            placeholder="email@contoh.com"
                            style={inputStyle}
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
                    <FormItem>
                      <FormLabel style={labelStyle}>Nomor HP</FormLabel>
                      <FormControl>
                        <div style={{ position: "relative" }}>
                          <Phone size={16} style={iconStyle} />
                          <Input
                            {...field}
                            autoComplete="tel"
                            placeholder="08xx xxxx xxxx"
                            style={inputStyle}
                            ref={withMask("999 9999 9999 999999", {
                              placeholder: "",
                              showMaskOnHover: false,
                            })}
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
                    <FormItem>
                      <FormLabel style={labelStyle}>Password</FormLabel>
                      <FormControl>
                        <div style={{ position: "relative" }}>
                          <LockKeyhole size={16} style={iconStyle} />
                          <Input
                            {...field}
                            autoComplete="new-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Minimal 8 karakter"
                            style={inputWithRightStyle}
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

                {/* Konfirmasi Password */}
                <FormField
                  control={form.control}
                  name="password_confirmation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel style={labelStyle}>Konfirmasi Password</FormLabel>
                      <FormControl>
                        <div style={{ position: "relative" }}>
                          <LockKeyhole size={16} style={iconStyle} />
                          <Input
                            {...field}
                            autoComplete="new-password"
                            type={showPasswordAgain ? "text" : "password"}
                            placeholder="Ulangi password"
                            style={inputWithRightStyle}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswordAgain((prev) => !prev)}
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
                    <FormItem>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          padding: "12px 16px",
                          borderRadius: "12px",
                          border: "1.5px solid var(--cream-dark, #F0D5C2)",
                          background: "white",
                          cursor: "pointer",
                        }}
                        onClick={() => field.onChange(!field.value)}
                      >
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                        />
                        <span
                          style={{
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "var(--text-secondary, #4A3728)",
                          }}
                        >
                          Apakah Anda ASN (Aparatur Sipil Negara)?
                        </span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* ASN Fields (conditional) */}
                {isAsnChecked && (
                  <>
                    <FormField
                      control={form.control}
                      name="organization_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel style={labelStyle}>Badan Usaha</FormLabel>
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
                        <FormItem>
                          <FormLabel style={labelStyle}>Upload Bukti ASN</FormLabel>
                          <FormControl>
                            <Input
                              type="file"
                              accept=".jpeg,.jpg,.png,.webp"
                              onChange={handleFileChange}
                              style={{
                                height: "48px",
                                borderRadius: "12px",
                                border: "1.5px solid var(--cream-dark, #F0D5C2)",
                                background: "white",
                                padding: "12px 16px",
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {/* reCAPTCHA */}
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

                {/* Submit */}
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
                  {isPending ? "Memproses..." : "Daftar Sekarang"}
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
            {/* Divider */}
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
              <span>atau daftar dengan</span>
              <div style={{ flex: 1, height: "1px", background: "var(--cream-dark, #F0D5C2)" }} />
            </div>

            {/* Google SSO Button */}
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
              Daftar dengan Google
            </Button>

            <p style={{ fontSize: "14px", color: "var(--text-muted, #6B4C2A)" }}>
              Sudah punya akun?{" "}
              <Link
                href="/masuk"
                style={{
                  color: "var(--terracotta, #F7620A)",
                  fontWeight: 700,
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                Masuk
                <ArrowRight size={14} />
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .daftar-grid {
            grid-template-columns: 1fr !important;
          }
          .daftar-left-section {
            display: none !important;
          }
        }
      `}</style>
    </main>
  );
}
