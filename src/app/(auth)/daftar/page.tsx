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
  passwordAgain: z.string().min(1, {
    message: "Konfirmasi Password tidak boleh kosong.",
  }),
});

export default function DaftarPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordAgain, setShowPasswordAgain] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: "",
      password: "",
      passwordAgain: ""
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
    <div className="flex items-center justify-center min-h-[80vh] px-4   font-jakarta">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-[#36454F]">Daftar</CardTitle>
          <CardDescription className='text-[#36454F]'>Daftar Untuk Melajutkan</CardDescription>
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
                        <Input placeholder="0812 xxxxxx" className="pl-10 py-5 rounded-xl" {...field} />
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
                          className="pl-10 py-5 rounded-xl"
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
               <FormField
                control={form.control}
                name="passwordAgain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Konfirmasi Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <IoLockClosed  className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          type={showPasswordAgain ? 'text' : 'password'}
                          placeholder="********"
                          className="pl-10 py-5 rounded-xl"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswordAgain(!showPasswordAgain)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 hover:text-primary"
                        >
                          {showPasswordAgain ? <EyeOff /> : <Eye />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full py-6" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Memproses...' : 'Daftar'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center gap-2 items-center">
          <p className="text-sm text-gray-600">
            Sudah punya akun?
          </p>
          <Link href={"/masuk"} className='text-primary underline'>Masuk</Link>
        </CardFooter>
      </Card>
    </div>
  );
}