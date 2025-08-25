'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
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
import { Eye, EyeOff } from 'lucide-react';
import { FaPhoneAlt } from 'react-icons/fa';
import { IoLockClosed } from "react-icons/io5";
import { useLogin } from '@/features/auth/hooks';
import { getToken } from '@/lib/token-service';
import { Illustration1, Illustration2 } from '@/components/auth/IllustrasiImages';
import { withMask } from 'use-mask-input';
const formSchema = z.object({
  // email: z.string()
  //   .min(1, { message: "Email tidak boleh kosong." })
  //   .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
  //     message: "Format email tidak valid.",
  //   }),
  phone_number: z.string()
    .min(1, { message: "Nomor HP tidak boleh kosong." }).transform((val) => val.replace(/\s+/g, '')) // hapus semua spasi dulu
    .refine((val) => /^08[0-9]{8,12}$/.test(val), {
      message: 'Nomor harus diawali 08 dan panjangnya 10-14 digit',
    }),
  password: z.string().min(1, {
    message: "Password tidak boleh kosong.",
  }),
});

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect'); // Dapatkan URL redirect

  const { mutate: handleLogin, isPending } = useLogin();

  useEffect(() => {
    const token = getToken(); // Ganti 'authToken' jika nama cookie Anda berbeda
    if (token) {
      router.push('/');
    }
  }, [router]);



  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone_number: "",
      password: "",
    },
  });


  async function onSubmit(values: z.infer<typeof formSchema>) {
   
    handleLogin({ credentials: values, redirectUrl })
  }

  return (
    <div className="flex relative items-center  justify-center min-h-[80vh] px-4 ">

      <div className="hidden lg:block absolute left-0 max-w-xs xl:max-w-sm 2xl:max-w-md">
        <Illustration1 className="w-full h-auto" />
      </div>

      <Card className="w-full max-w-md z-20">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold font-jakarta text-[#36454F]">Login</CardTitle>
          <CardDescription className='text-[#36454F]'>Silahkan masuk untuk melanjutkan</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nomor HP</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <FaPhoneAlt className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          {...field}
                          placeholder="08xx xxxx xxxx"
                          className="pl-10 py-5 rounded-xl pr-10"
                          ref={withMask('999 9999 9999 999999', {
                            placeholder: '',
                            showMaskOnHover: false
                          })}
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
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <IoLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="********"
                          className="pl-10 py-5 rounded-xl pr-10"
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
              <Button type="submit" className="w-full py-6" disabled={isPending}>
                {isPending ? 'Memproses...' : 'Masuk'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col items-center">
          <p className="text-sm text-gray-600 font-semibold mb-4">
            Belum punya akun?
            <Link href={"/daftar"} className='ml-2 underline text-primary'>Daftar</Link>
          </p>

          {/* <div className=" w-full gap-4 grid grid-cols-2">
            <Button asChild variant="outline" className=" border-primary text-primary hover:bg-pink-50 hover:text-primary">
              <Link href="/daftar-umkm">Daftar UMKM</Link>
            </Button>
            <Button asChild variant="outline" className=" border-primary text-primary hover:bg-pink-50 hover:text-primary">
              <Link href="/daftar">Daftar Customer</Link>
            </Button>
          </div> */}
        </CardFooter>
      </Card>

      <div className="hidden lg:block absolute right-0 max-w-xs xl:max-w-sm 2xl:max-w-md">
        <Illustration2 className="w-full h-auto" />
      </div>
    </div>
  );
}