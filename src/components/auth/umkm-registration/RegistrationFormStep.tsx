'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField , FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Eye, EyeOff } from 'lucide-react';

const umkmRegistrationSchema = z.object({
  namaLengkap: z.string().min(1, "Nama lengkap tidak boleh kosong."),
  nik: z.string().min(16, "NIK harus 16 digit.").max(16, "NIK harus 16 digit."),
  phone: z.string(),
  email: z.string().email("Format email tidak valid.").optional().or(z.literal('')),
  password: z.string().min(8, "Password minimal 8 karakter."),
  confirmPassword: z.string(),
  namaUsaha: z.string().min(1, "Nama usaha tidak boleh kosong."),
  merkUsaha: z.string().optional(),
  alamatUsaha: z.string().min(1, "Alamat usaha tidak boleh kosong."),
  kecamatan: z.string().min(1, "Kecamatan tidak boleh kosong."),
  desa: z.string().min(1, "Desa tidak boleh kosong."),
  kegiatanUsaha: z.string().min(1, "Kegiatan usaha tidak boleh kosong."),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Konfirmasi password tidak cocok.",
  path: ["confirmPassword"],
});

type Props = {
  phone: string;
};

export default function RegistrationFormStep({ phone }: Props) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<z.infer<typeof umkmRegistrationSchema>>({
    resolver: zodResolver(umkmRegistrationSchema),
    defaultValues: {
      phone: phone,
      namaLengkap: "", nik: "", email: "", password: "", confirmPassword: "",
      namaUsaha: "", merkUsaha: "", alamatUsaha: "", kecamatan: "", desa: "", kegiatanUsaha: "",
    },
  });

  async function onSubmit(values: z.infer<typeof umkmRegistrationSchema>) {
    try {
      toast.info("Memproses pendaftaran...");
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Pendaftaran UMKM Berhasil!", { description: "Akun Anda telah dibuat." });
      router.push('/masuk');
    } catch (error) {
      toast.error("Pendaftaran Gagal", { description:"Terjadi kesalahan." });
    }
  }

  return (
    <Card className="w-full max-w-2xl animate-in fade-in-0 zoom-in-95">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-pink-600">Form Pendaftaran UMKM</CardTitle>
        <CardDescription>Silakan isi form berikut untuk mendaftarkan UMKM Anda.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 border-b pb-2">Informasi Pribadi</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField  control={form.control} name="namaLengkap" render={({ field }) => (
                  <FormItem><FormLabel>Nama Lengkap *</FormLabel><FormControl><Input className='border-primary rounded-lg' placeholder="Masukkan nama lengkap" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField  control={form.control} name="nik" render={({ field }) => (
                  <FormItem><FormLabel>NIK / Nomor KTP *</FormLabel><FormControl><Input className='border-primary rounded-lg' placeholder="Masukkan 16 digit NIK" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField  control={form.control} name="phone" render={({ field }) => (
                  <FormItem><FormLabel>Nomor HP</FormLabel><FormControl><Input {...field}  disabled className="bg-gray-100 cursor-not-allowed border-primary rounded-lg"/></FormControl><FormMessage /></FormItem>
                )} />
                <FormField  control={form.control} name="email" render={({ field }) => (
                  <FormItem><FormLabel>Email (Optional)</FormLabel><FormControl><Input className='border-primary rounded-lg' placeholder="email@contoh.com" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField  control={form.control} name="password" render={({ field }) => (
                  <FormItem><FormLabel>Password *</FormLabel><FormControl><div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" /><Input  type={showPassword ? 'text' : 'password'} className="pl-10 pr-10 border-primary rounded-lg" placeholder="********" {...field}/><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500">{showPassword ? <EyeOff /> : <Eye />}</button></div></FormControl><FormMessage /></FormItem>
                )} />
                <FormField  control={form.control} name="confirmPassword" render={({ field }) => (
                  <FormItem><FormLabel>Konfirmasi Password *</FormLabel><FormControl><div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" /><Input type={showConfirmPassword ? 'text' : 'password'} className="pl-10 pr-10 border-primary rounded-lg" placeholder="********" {...field}/><button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500">{showConfirmPassword ? <EyeOff /> : <Eye />}</button></div></FormControl><FormMessage /></FormItem>
                )} />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 border-b pb-2">Informasi Usaha</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField  control={form.control} name="namaUsaha" render={({ field }) => (
                  <FormItem><FormLabel>Nama Usaha *</FormLabel><FormControl><Input className='border-primary rounded-lg' placeholder="Contoh: Warung Sejahtera" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField  control={form.control} name="merkUsaha" render={({ field }) => (
                  <FormItem><FormLabel>Merk Usaha (Optional)</FormLabel><FormControl><Input className='border-primary rounded-lg' placeholder="Contoh: Sejahtera Snack" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField  control={form.control} name="alamatUsaha" render={({ field }) => (
                  <FormItem className="md:col-span-2"><FormLabel>Alamat Usaha *</FormLabel><FormControl><Textarea className='border-primary rounded-lg' placeholder="Masukkan alamat lengkap usaha Anda" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField  control={form.control} name="kecamatan" render={({ field }) => (
                  <FormItem><FormLabel>Kapanewon / Kecamatan *</FormLabel><FormControl><Input className='border-primary rounded-lg' placeholder="Contoh: Gamping" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField  control={form.control} name="desa" render={({ field }) => (
                  <FormItem><FormLabel>Kalurahan / Desa *</FormLabel><FormControl><Input className='border-primary rounded-lg' placeholder="Contoh: Trihanggo" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField  control={form.control} name="kegiatanUsaha" render={({ field }) => (
                  <FormItem className="md:col-span-2"><FormLabel>Kegiatan Usaha *</FormLabel><FormControl><Textarea className='border-primary rounded-lg' placeholder="Jelaskan kegiatan usaha Anda, misal: Produksi makanan ringan keripik singkong" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Mendaftar...' : 'Daftar'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}