"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePasswordChange } from "@/features/auth/hooks";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Eye, EyeOff, KeyRound, LockKeyhole, ShieldCheck } from "lucide-react";

const passwordSchema = z
  .object({
    old_password: z.string().min(1, { message: "Password saat ini diperlukan." }),
    new_password: z
      .string()
      .min(8, { message: "Password minimal 8 karakter." })
      .regex(/[A-Z]/, { message: "Harus mengandung huruf besar." })
      .regex(/[a-z]/, { message: "Harus mengandung huruf kecil." })
      .regex(/[0-9]/, { message: "Harus mengandung angka." })
      .regex(/[^A-Za-z0-9]/, { message: "Harus mengandung simbol." }),
    new_password_confirmation: z.string().min(1, { message: "Konfirmasi password diperlukan." }),
  })
  .refine((data) => data.new_password === data.new_password_confirmation, {
    message: "Password dan konfirmasi tidak cocok.",
    path: ["new_password_confirmation"],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

const inputStyle: React.CSSProperties = {
  height: 48,
  borderRadius: 12,
  border: "1.5px solid var(--cream-dark, #F0D5C2)",
  background: "white",
  paddingLeft: 44,
  paddingRight: 44,
};

const iconStyle: React.CSSProperties = {
  position: "absolute",
  left: 14,
  top: "50%",
  transform: "translateY(-50%)",
  color: "var(--brown-light, #9B7B5A)",
  pointerEvents: "none",
};

const labelStyle: React.CSSProperties = {
  fontWeight: 600,
  fontSize: 13,
  color: "var(--text-secondary, #4A3728)",
};

export default function PasswordSettingsPage() {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    mode: "onSubmit",
    criteriaMode: "all",
    defaultValues: { old_password: "", new_password: "", new_password_confirmation: "" },
  });

  const { mutate: updatePassword, isPending } = usePasswordChange();

  const onSubmit = (data: PasswordFormValues) => {
    updatePassword(data);
  };

  const EyeToggle = ({ show, onToggle }: { show: boolean; onToggle: () => void }) => (
    <button
      type="button"
      onClick={onToggle}
      style={{
        position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
        background: "none", border: "none", cursor: "pointer",
        color: "var(--brown-light, #9B7B5A)", display: "flex", alignItems: "center",
      }}
    >
      {show ? <EyeOff size={16} /> : <Eye size={16} />}
    </button>
  );

  return (
    <div style={{ background: "var(--cream, #FFF9F4)", minHeight: "100vh" }}>
      {/* Sub-header */}
      <div
        style={{
          background: "white",
          borderBottom: "1px solid var(--cream-dark, #F0D5C2)",
          padding: "0 20px",
          height: 56,
          display: "flex",
          alignItems: "center",
          gap: 12,
          position: "sticky",
          top: 0,
          zIndex: 40,
        }}
      >
        <Link
          href="/pengguna"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 36, height: 36, borderRadius: 10,
            background: "var(--cream, #FFF9F4)",
            color: "var(--text-primary, #1A1008)",
            textDecoration: "none",
            border: "1.5px solid var(--cream-dark, #F0D5C2)",
          }}
        >
          <ArrowLeft size={18} />
        </Link>
        <h1 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary, #1A1008)", margin: 0 }}>
          Keamanan Akun
        </h1>
      </div>

      <main style={{ maxWidth: 520, margin: "0 auto", padding: "28px 16px 64px" }}>

        {/* Info box */}
        <div
          style={{
            background: "rgba(247,98,10,0.06)",
            border: "1.5px solid rgba(247,98,10,0.18)",
            borderRadius: 14,
            padding: "14px 18px",
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
            marginBottom: 20,
          }}
        >
          <ShieldCheck size={20} style={{ color: "var(--terracotta, #F7620A)", flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: 13, color: "var(--text-secondary, #4A3728)", margin: 0, lineHeight: 1.6 }}>
            Password harus minimal <strong>8 karakter</strong> dengan kombinasi huruf besar, huruf kecil, angka, dan simbol.
          </p>
        </div>

        <div
          style={{
            background: "white",
            borderRadius: 20,
            border: "1.5px solid var(--cream-dark, #F0D5C2)",
            boxShadow: "0 4px 20px rgba(44,24,16,0.08)",
            padding: "32px 28px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: "rgba(247,98,10,0.08)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--terracotta, #F7620A)",
            }}>
              <KeyRound size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "var(--text-primary, #1A1008)", margin: 0 }}>
                Ubah Password
              </h2>
              <p style={{ fontSize: 12, color: "var(--text-muted, #6B4C2A)", margin: 0 }}>Perbarui keamanan akun Anda</p>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: 18 }}>

              {/* Password Lama */}
              <FormField
                control={form.control}
                name="old_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel style={labelStyle}>Password Saat Ini</FormLabel>
                    <FormControl>
                      <div style={{ position: "relative" }}>
                        <LockKeyhole size={16} style={iconStyle} />
                        <Input
                          autoComplete="current-password"
                          type={showOld ? "text" : "password"}
                          placeholder="Password saat ini"
                          style={inputStyle}
                          {...field}
                        />
                        <EyeToggle show={showOld} onToggle={() => setShowOld(v => !v)} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Divider */}
              <div style={{ height: 1, background: "var(--cream-dark, #F0D5C2)", margin: "4px 0" }} />

              {/* Password Baru */}
              <FormField
                control={form.control}
                name="new_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel style={labelStyle}>Password Baru</FormLabel>
                    <FormControl>
                      <div style={{ position: "relative" }}>
                        <LockKeyhole size={16} style={iconStyle} />
                        <Input
                          autoComplete="new-password"
                          type={showNew ? "text" : "password"}
                          placeholder="Password baru"
                          style={inputStyle}
                          {...field}
                        />
                        <EyeToggle show={showNew} onToggle={() => setShowNew(v => !v)} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Konfirmasi */}
              <FormField
                control={form.control}
                name="new_password_confirmation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel style={labelStyle}>Konfirmasi Password Baru</FormLabel>
                    <FormControl>
                      <div style={{ position: "relative" }}>
                        <LockKeyhole size={16} style={iconStyle} />
                        <Input
                          autoComplete="new-password"
                          type={showConfirm ? "text" : "password"}
                          placeholder="Ulangi password baru"
                          style={inputStyle}
                          {...field}
                        />
                        <EyeToggle show={showConfirm} onToggle={() => setShowConfirm(v => !v)} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <button
                type="submit"
                disabled={isPending}
                style={{
                  height: 48, borderRadius: 12,
                  background: "var(--terracotta, #F7620A)",
                  color: "white", border: "none",
                  fontWeight: 700, fontSize: 15,
                  cursor: isPending ? "not-allowed" : "pointer",
                  opacity: isPending ? 0.75 : 1,
                  width: "100%", marginTop: 4,
                  transition: "opacity 0.2s",
                }}
              >
                {isPending ? "Memperbarui..." : "Ubah Password"}
              </button>
            </form>
          </Form>
        </div>
      </main>
    </div>
  );
}
