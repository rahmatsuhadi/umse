'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';

// Skema validasi menggunakan Zod
const registerSchema = z.object({
    fullName: z.string().min(1, "Nama lengkap tidak boleh kosong."),
    email: z.string().email("Format email tidak valid."),
    phoneNumber: z.string().min(10, "Nomor HP minimal 10 karakter."),
    password: z.string().min(8, "Password minimal 8 karakter."),
    confirmPassword: z.string(),
    isAsn: z.boolean().default(false).optional(),
    asnIdentity: z.any().optional(), // Dibuat opsional, validasi file lebih kompleks
    terms: z.boolean().refine((val) => val === true, {
        message: "Anda harus menyetujui Syarat & Ketentuan.",
    }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok.",
    path: ["confirmPassword"],
});


export default function RegisterPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [fileName, setFileName] = useState("");

    const form = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            fullName: "", email: "", phoneNumber: "", password: "",
            confirmPassword: "", isAsn: false, terms: false,
        },
    });

    // Memantau nilai checkbox ASN
    const isAsnChecked = form.watch('isAsn');

    async function onSubmit(values: z.infer<typeof registerSchema>) {
        try {
            toast.info("Memproses pendaftaran...");
            console.log(values);
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success("Registrasi berhasil!", { description: "Akun Anda telah dibuat." });
            router.push('/masuk');
        } catch (error) {
            toast.error("Registrasi Gagal", { description:  "Terjadi kesalahan." });
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
            <Card className="max-w-md w-full p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-primary mb-2 flex items-center justify-center">
                        <i className="fas fa-store mr-2"></i>Sleman Mart
                    </h1>
                    <h2 className="text-2xl font-semibold text-gray-800">Buat Akun Baru</h2>
                    <p className="text-gray-600 mt-2">Bergabunglah dengan komunitas UMKM Sleman</p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {/* Input fields */}
                        <FormField control={form.control} name="fullName" render={({ field }) => (
                            <FormItem><FormLabel className="flex items-center"><i className="fas fa-user mr-2"></i>Nama Lengkap</FormLabel><FormControl><Input placeholder="Masukkan nama lengkap" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem><FormLabel className="flex items-center"><i className="fas fa-envelope mr-2"></i>Email</FormLabel><FormControl><Input type="email" placeholder="contoh@email.com" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="phoneNumber" render={({ field }) => (
                            <FormItem><FormLabel className="flex items-center"><i className="fas fa-phone mr-2"></i>Nomor HP</FormLabel><FormControl><Input type="tel" placeholder="08xxxxxxxxxx" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="password" render={({ field }) => (
                            <FormItem><FormLabel className="flex items-center"><i className="fas fa-lock mr-2"></i>Password</FormLabel><FormControl><div className="relative"><Input type={showPassword ? 'text' : 'password'} placeholder="Minimal 8 karakter" className="pr-10" {...field} /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center"><i className={`fas ${showPassword ? 'fa-eye' : 'fa-eye-slash'} text-gray-400`}></i></button></div></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                            <FormItem><FormLabel className="flex items-center"><i className="fas fa-lock mr-2"></i>Konfirmasi Password</FormLabel><FormControl><div className="relative"><Input type={showConfirmPassword ? 'text' : 'password'} placeholder="Ulangi password" className="pr-10" {...field} /><button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center"><i className={`fas ${showConfirmPassword ? 'fa-eye' : 'fa-eye-slash'} text-gray-400`}></i></button></div></FormControl><FormMessage /></FormItem>
                        )} />

                        {/* ASN Status Checkbox */}
                        <FormField control={form.control} name="isAsn" render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal flex items-center"><i className="fas fa-id-badge mr-2"></i>Saya adalah ASN</FormLabel></FormItem>
                        )} />

                        {/* ASN Identity Upload (Conditional) */}
                        {isAsnChecked && (
                            <FormField control={form.control} name="asnIdentity" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center"><i className="fas fa-id-card mr-2"></i>Foto Identitas ASN</FormLabel>
                                    <FormControl>
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition duration-300">
                                            <Input type="file" accept="image/*" className="hidden" id="asn-file-upload" onChange={(e) => {
                                                field.onChange(e.target.files);
                                                setFileName(e.target.files?.[0]?.name || "");
                                            }} />
                                            <label htmlFor="asn-file-upload" className="cursor-pointer">
                                                {fileName ? (
                                                    <>
                                                        <i className="fas fa-check-circle text-4xl text-green-500 mb-2"></i>
                                                        <p className="text-green-600 text-sm">File berhasil dipilih: {fileName}</p>
                                                        <p className="text-xs text-gray-500 mt-1">Klik untuk mengganti file</p>
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-2"></i>
                                                        <p className="text-gray-600">Klik untuk upload foto</p>
                                                        <p className="text-xs text-gray-500 mt-1">Format: JPG, PNG (Max: 5MB)</p>
                                                    </>
                                                )}
                                            </label>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        )}

                        {/* Terms and Conditions */}
                        <FormField control={form.control} name="terms" render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <div className="font-normal gap-2 text-[9pt] flex">Saya menyetujui
                                        <Link href="/syarat" className="text-primary hover:underline">Syarat & Ketentuan</Link>
                                        dan <Link href="/kebijakan-privasi" className="text-primary hover:underline">Kebijakan Privasi</Link>
                                    </div></div><FormMessage /></FormItem>
                        )} />

                        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? 'Mendaftar...' : (<><i className="fas fa-user-plus mr-2"></i>Daftar Sekarang</>)}
                        </Button>
                    </form>
                </Form>

                <div className="mt-6">
                    <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300"></div></div><div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">Atau daftar dengan</span></div></div>
                    <div className="mt-6 grid grid-cols-2 gap-3">
                        <Button variant="outline"><i className="fab fa-google text-red-500 mr-2"></i>Google</Button>
                        <Button variant="outline"><i className="fab fa-facebook text-blue-500 mr-2"></i>Facebook</Button>
                    </div>
                </div>

                <div className="mt-6 text-center text-sm text-gray-600">
                    Sudah punya akun? <Link href="/v2/masuk" className="font-medium text-primary hover:underline">Masuk di sini</Link>
                </div>
            </Card>
        </div>
    );
}