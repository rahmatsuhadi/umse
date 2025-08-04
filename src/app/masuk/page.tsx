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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {  Eye, EyeOff } from 'lucide-react';
import { FaPhoneAlt } from 'react-icons/fa';
import { IoLockClosed } from "react-icons/io5";
const formSchema = z.object({
  phone: z.string().min(1, {
    message: "Nomor HP tidak boleh kosong.",
  }),
  password: z.string().min(1, {
    message: "Password tidak boleh kosong.",
  }),
});

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values); // Data yang akan dikirim ke API

    try {
      // Di sini Anda akan memanggil API login Anda
      // const response = await apiClient.post('/auth/login', values);

      // Simulasi panggilan API berhasil
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success("Login Berhasil!", {
        description: "Selamat datang kembali.",
      });

      // Arahkan pengguna ke halaman dashboard setelah berhasil login
      router.push('/dashboard');

    } catch (error) {
      toast.error("Login Gagal", {
        description: "Nomor HP atau password salah. Silakan coba lagi.",
      });
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">Login</CardTitle>
          <CardDescription>Silahkan masuk untuk melanjutkan</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nomor HP</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <FaPhoneAlt  className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input placeholder="0812 xxxxxx" className="pl-10 border-primary rounded-md" {...field} />
                      </div>
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <IoLockClosed  className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="********"
                          className="pl-10 border-primary rounded-md pr-10"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 hover:text-primary"
                        >
                          {showPassword ? <EyeOff /> : <Eye />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full py-6" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Memproses...' : 'Masuk'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col items-center">
          <p className="text-sm text-gray-600 mb-4">
            Belum punya akun?
          </p>
          <div className=" w-full gap-4 grid grid-cols-2">
            <Button asChild variant="outline" className=" border-primary text-primary hover:bg-pink-50 hover:text-primary">
              <Link href="/daftar-umkm">Daftar UMKM</Link>
            </Button>
            <Button asChild variant="outline" className=" border-primary text-primary hover:bg-pink-50 hover:text-primary">
              <Link href="/daftar">Daftar Customer</Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}