"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useUpdateProfile, useUser } from "@/features/auth/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Camera, Mail, Phone, Save, User2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const profileSchema = z.object({
  name: z.string().min(3, "Nama lengkap minimal 3 karakter."),
  email: z.email("Format email tidak valid."),
  phone_number: z.string().min(10, "Nomor HP tidak valid."),
  profilePhoto: z.any().optional(),
});

const MAX_SIZE_UPLOAD = 2 * 1024 * 1024;

const inputStyle: React.CSSProperties = {
  height: 48,
  borderRadius: 12,
  border: "1.5px solid var(--cream-dark, #F0D5C2)",
  background: "white",
  paddingLeft: 44,
  paddingRight: 16,
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

export default function EditProfilePage() {
  const { data, isLoading } = useUser();
  const user = data?.data;
  const { mutate: updateUser, isPending } = useUpdateProfile();
  const [fileError, setFileError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: "", email: "", phone_number: "", profilePhoto: null },
  });

  useEffect(() => {
    if (user) {
      form.setValue("name", user?.name ?? "");
      form.setValue("email", user?.email ?? "");
      form.setValue("phone_number", user?.phone_number ?? "");
    }
  }, [user, form]);

  function onSubmit(values: z.infer<typeof profileSchema>) {
    updateUser({ ...values, profilePhoto: values.profilePhoto?.[0] });
  }

  const initials = user?.name
    ? user.name.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase()
    : "U";

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
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 36,
            height: 36,
            borderRadius: 10,
            background: "var(--cream, #FFF9F4)",
            color: "var(--text-primary, #1A1008)",
            textDecoration: "none",
            border: "1.5px solid var(--cream-dark, #F0D5C2)",
          }}
        >
          <ArrowLeft size={18} />
        </Link>
        <h1 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary, #1A1008)", margin: 0 }}>
          Edit Profil
        </h1>
      </div>

      <main style={{ maxWidth: 520, margin: "0 auto", padding: "28px 16px 64px" }}>
        <div
          style={{
            background: "white",
            borderRadius: 20,
            border: "1.5px solid var(--cream-dark, #F0D5C2)",
            boxShadow: "0 4px 20px rgba(44,24,16,0.08)",
            padding: "32px 28px",
          }}
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* Avatar upload */}
              <FormField
                control={form.control}
                name="profilePhoto"
                render={({ field }) => (
                  <FormItem style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <FormControl>
                      <div style={{ position: "relative", marginBottom: 8 }}>
                        {isLoading ? (
                          <Skeleton style={{ width: 96, height: 96, borderRadius: "50%" }} />
                        ) : (
                          <>
                            <Avatar
                              style={{
                                width: 96, height: 96,
                                border: "3px solid var(--cream-dark, #F0D5C2)",
                                boxShadow: "0 4px 12px rgba(44,24,16,0.14)",
                              }}
                            >
                              <AvatarImage
                                src={preview || (user?.profile_path ? user.profile_url : "")}
                                alt="Profile"
                                style={{ objectFit: "cover" }}
                              />
                              <AvatarFallback
                                style={{
                                  background: "var(--cream-dark, #F0D5C2)",
                                  color: "var(--terracotta, #F7620A)",
                                  fontSize: 28, fontWeight: 700,
                                }}
                              >
                                {initials}
                              </AvatarFallback>
                            </Avatar>

                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              style={{
                                position: "absolute", bottom: 0, right: 0,
                                width: 30, height: 30, borderRadius: "50%",
                                background: "var(--terracotta, #F7620A)",
                                border: "2px solid white",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                color: "white", cursor: "pointer",
                              }}
                            >
                              <Camera size={14} />
                            </button>

                            <input
                              ref={fileInputRef}
                              id="photo-upload"
                              type="file"
                              accept="image/*"
                              style={{ display: "none" }}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  if (file.size > MAX_SIZE_UPLOAD) {
                                    setFileError("Ukuran file maksimal 2MB.");
                                    field.onChange(null);
                                  } else {
                                    setFileError(null);
                                    setPreview(URL.createObjectURL(file));
                                    field.onChange(e.target.files);
                                  }
                                }
                              }}
                            />
                          </>
                        )}
                      </div>
                    </FormControl>
                    <p style={{ fontSize: 12, color: "var(--text-muted, #6B4C2A)", margin: 0 }}>
                      Klik foto untuk mengubah
                    </p>
                    {fileError && (
                      <p style={{ fontSize: 12, color: "#E74C3C", margin: "4px 0 0", display: "flex", alignItems: "center", gap: 4 }}>
                        <span>⚠</span> {fileError}
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Fields */}
              {isLoading ? (
                <>
                  <Skeleton style={{ height: 48, borderRadius: 12 }} />
                  <Skeleton style={{ height: 48, borderRadius: 12 }} />
                  <Skeleton style={{ height: 48, borderRadius: 12 }} />
                  <Skeleton style={{ height: 48, borderRadius: 12 }} />
                </>
              ) : (
                <>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel style={labelStyle}>Nama Lengkap</FormLabel>
                        <FormControl>
                          <div style={{ position: "relative" }}>
                            <User2 size={16} style={iconStyle} />
                            <Input {...field} placeholder="Nama lengkap" style={inputStyle} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel style={labelStyle}>Email</FormLabel>
                        <FormControl>
                          <div style={{ position: "relative" }}>
                            <Mail size={16} style={iconStyle} />
                            <Input {...field} type="email" placeholder="email@contoh.com" style={inputStyle} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel style={labelStyle}>Nomor HP</FormLabel>
                        <FormControl>
                          <div style={{ position: "relative" }}>
                            <Phone size={16} style={iconStyle} />
                            <Input {...field} type="tel" placeholder="08xx xxxx xxxx" style={inputStyle} />
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
                      height: 48,
                      borderRadius: 12,
                      background: isPending ? "var(--terracotta-dark, #D45508)" : "var(--terracotta, #F7620A)",
                      color: "white",
                      border: "none",
                      fontWeight: 700,
                      fontSize: 15,
                      cursor: isPending ? "not-allowed" : "pointer",
                      opacity: isPending ? 0.75 : 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      width: "100%",
                      marginTop: 4,
                      transition: "opacity 0.2s",
                    }}
                  >
                    <Save size={16} />
                    {isPending ? "Menyimpan..." : "Simpan Perubahan"}
                  </button>
                </>
              )}
            </form>
          </Form>
        </div>
      </main>
    </div>
  );
}
