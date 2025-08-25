// PasswordSettingsPage.tsx

"use client";
import React,{useState} from "react"; 
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { usePasswordChange } from "@/features/auth/hooks";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"; 
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react"; 

// Skema Zod tidak berubah, sudah bagus
const passwordSchema = z.object({
  old_password: z.string().min(1, { message: "Password saat ini diperlukan." }),
  new_password: z
    .string()
    .min(8, { message: "Password baru harus minimal 8 karakter." })
    // .regex(/[A-Za-z]/, { message: "Password harus mengandung huruf." })
    // .regex(/[0-9]/, { message: "Password harus mengandung angka." })
    // .regex(/[\W_]/, { message: "Password harus mengandung simbol." })
    ,
  new_password_confirmation: z.string().min(1, { message: "Konfirmasi password diperlukan." }),
}).refine((data) => data.new_password === data.new_password_confirmation, {
  message: "Password dan konfirmasi password tidak cocok.",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function PasswordSettingsPage() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const form = useForm<PasswordFormValues>({ 
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      old_password: "",
      new_password: "",
      new_password_confirmation: "",
    }
  });

  const { mutate: updatePassword, isPending: isLoading } = usePasswordChange()

  const onSubmit = (data: PasswordFormValues) => {
    // Kirim data yang dibutuhkan oleh API (password lama dan baru)
    updatePassword(data);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header tidak berubah */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href={"/pengguna/"} className="text-gray-600 hover:text-primary transition-colors hover:cursor-pointer">
                <i className="fas fa-arrow-left text-xl"></i>
              </Link>
              <h1 className="text-xl font-bold text-gray-800">Keamanan Akun</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            <i className="fas fa-key mr-2 text-primary"></i>Ubah Password
          </h2>

          {/* ✨ PERBAIKAN: Bungkus dengan komponen Form dari shadcn */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Current Password */}
              <FormField
                control={form.control}
                name="old_password"
                render={({ field }) => (
                  <FormItem>
                    <Label>Password Saat Ini *</Label>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showCurrentPassword ? "text" : "password"}
                          placeholder="Masukkan password saat ini"
                          {...field}
                        />
                        <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500">
                          {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* New Password */}
              <FormField
                control={form.control}
                name="new_password"
                render={({ field }) => (
                  <FormItem>
                    <Label>Password Baru *</Label>
                    <FormControl>
                       <div className="relative">
                        <Input
                          type={showNewPassword ? "text" : "password"}
                          placeholder="Masukkan password baru"
                          {...field}
                        />
                        <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500">
                          {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                    <div className="mt-2 text-xs text-gray-500">
                      Password harus minimal 8 karakter dengan kombinasi huruf, angka, dan simbol.
                    </div>
                  </FormItem>
                )}
              />

              {/* Confirm Password */}
              <FormField
                control={form.control}
                name="new_password_confirmation"
                render={({ field }) => (
                  <FormItem>
                    <Label>Konfirmasi Password Baru *</Label>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Ulangi password baru"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Mengubah..." : "Ubah Password"}
              </Button>
            </form>
          </Form>
        </div>
      </main>
    </div>
  );
}