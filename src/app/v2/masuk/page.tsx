'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
// import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';

// Skema validasi menggunakan Zod
const loginSchema = z.object({
  emailOrPhone: z.string().min(1, { message: "Email atau Nomor HP tidak boleh kosong." }),
  password: z.string().min(1, { message: "Password tidak boleh kosong." }),
  remember: z.boolean().default(false).optional(),
});

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      emailOrPhone: "",
      password: "",
      remember: false,
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    try {
      toast.info("Mencoba untuk masuk...");
      console.log(values); // Data yang akan dikirim ke API
      
      // Simulasi panggilan API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Login berhasil!", { description: "Selamat datang kembali." });
      router.push('/'); // Arahkan ke halaman utama

    } catch (error) {
      toast.error("Login Gagal", {
        description:  "Kredensial tidak valid. Silakan coba lagi.",
      });
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="max-w-md w-full p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2 flex items-center justify-center">
            <i className="fas fa-store mr-2"></i>Sleman Mart
          </h1>
          <h2 className="text-2xl font-semibold text-gray-800">Selamat Datang Kembali</h2>
          <p className="text-gray-600 mt-2">Masuk ke akun Anda untuk melanjutkan belanja</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="emailOrPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><i className="fas fa-user mr-2"></i>Email atau Nomor HP</FormLabel>
                  <FormControl>
                    <Input placeholder="contoh@email.com atau 08xxxxxxxxxx" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><i className="fas fa-lock mr-2"></i>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type={showPassword ? 'text' : 'password'} 
                        placeholder="Masukkan password" 
                        className="pr-10"
                        {...field} 
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        <i className={`fas ${showPassword ? 'fa-eye' : 'fa-eye-slash'} text-gray-400`}></i>
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex items-center justify-between">
              {/* <FormField
                control={form.control}
                name="remember"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Ingat saya</FormLabel>
                    </div>
                  </FormItem>
                )}
              /> */}
              <Link href="/lupa-password" className="text-sm text-primary hover:underline">
                Lupa password?
              </Link>
            </div>

            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Memproses...' : (<><i className="fas fa-sign-in-alt mr-2"></i>Masuk</>)}
            </Button>
          </form>
        </Form>
        
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Atau masuk dengan</span>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button variant="outline"><i className="fab fa-google text-red-500 mr-2"></i>Google</Button>
            <Button variant="outline"><i className="fab fa-facebook text-blue-500 mr-2"></i>Facebook</Button>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          Belum punya akun? <Link href="/v2/daftar" className="font-medium text-primary hover:underline">Daftar sekarang</Link>
        </div>
        <div className="mt-4 text-center">
          <Link href="/v2" className="text-sm text-gray-500 hover:text-primary flex items-center justify-center">
            <i className="fas fa-arrow-left mr-1"></i>Kembali ke Beranda
          </Link>
        </div>
      </Card>
    </div>
  );
}