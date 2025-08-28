'use client';

import { useState } from 'react';
import Link from 'next/link';
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
import { Eye, EyeOff, Mail, User2 } from 'lucide-react';
import { FaPhoneAlt } from 'react-icons/fa';
import { IoLockClosed } from "react-icons/io5";
import { useRegister } from '@/features/auth/hooks';
import { Illustration1, Illustration2 } from '@/components/auth/IllustrasiImages';
import { withMask } from 'use-mask-input';
const formSchema = z.object({
  phone_number: z.string().min(1, { message: "Nomor HP tidak boleh kosong." }).transform((val) => val.replace(/\s+/g, '')) // hapus semua spasi dulu
    .refine((val) => /^08[0-9]{8,12}$/.test(val), {
      message: 'Nomor harus diawali 08 dan panjangnya 10-14 digit',
    }),
  // .min(1, { message: "Nomor HP tidak boleh kosong." })
  // .regex(/^\+62[0-9]{9,13}$/, {
  //   message: "Format nomor HP tidak valid (gunakan format +62...).",
  // }),
  name: z.string().min(1, {
    message: "Nama tidak boleh kosong.",
  }),
  password: z.string().min(1, {
    message: "Password tidak boleh kosong.",
  }),
  password_confirmation: z.string().min(1, {
    message: "Konfirmasi Password tidak boleh kosong.",
  }),
  email: z.string()
    .min(1, { message: "Email tidak boleh kosong." })
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
      message: "Format email tidak valid.",
    }),
});

export default function DaftarPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordAgain, setShowPasswordAgain] = useState(false);

  const { mutate: handleRegister, isPending } = useRegister();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone_number: "",
      email: "",
      password: "",
      password_confirmation: "",
      name: ""
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    handleRegister(values)
  }

  return (
    <div className="flex relative items-center  justify-center min-h-[80vh] px-4 ">

      {/* <div className="hidden lg:block absolute left-0 max-w-xs xl:max-w-sm 2xl:max-w-md">
        <Illustration1 className="w-full h-auto" />
      </div> */}
      <Card className="w-full max-w-md  z-20 mt-5">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-[#36454F]">Daftar</CardTitle>
          <CardDescription className='text-[#36454F]'>Daftar Untuk Melajutkan</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                disabled={isPending}
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input placeholder="Amanda Sekar" className="pl-10 py-5 rounded-xl" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                disabled={isPending}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input type='email' placeholder="amanda@gmail.com" className="pl-10 py-5 rounded-xl" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                disabled={isPending}
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
                disabled={isPending}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <IoLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
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
                name="password_confirmation"
                disabled={isPending}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Konfirmasi Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <IoLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
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
              <Button type="submit" className="w-full py-6" disabled={isPending}>
                {isPending ? 'Memproses...' : 'Daftar'}
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

      {/* <div className="hidden lg:block absolute right-0 max-w-xs xl:max-w-sm 2xl:max-w-md">
        <Illustration2 className="w-full h-auto" />
      </div> */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-full max-w-7xl bg-cover opacity-40 bg-center">
        <Illustration2 className="w-full h-[80vh] object-cover" />
      </div>
    </div>
  );
}