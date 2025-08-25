"use client"

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Textarea } from "@/components/ui/textarea";
import { useAddress, useUpdateAddress } from "@/features/address/hooks";
import { useDistricts, useProvinces, useRegencies, useVillages } from "@/features/locations/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

// Skema validasi dengan Zod
const addressSchema = z.object({
    recipient_name: z.string().min(1, "Nama penerima wajib diisi."),
    recipient_phone_number: z.string().min(10, "Nomor telepon tidak valid."),
    address: z.string().min(1, "Alamat lengkap wajib diisi."),
    province_id: z.string().min(1, "Province wajib dipilih."),
    regency_id: z.string().min(1, "Kabupaten/Kota wajib dipilih."),
    district_id: z.string().min(1, "Kecamatan wajib dipilih."),
    village_id: z.string().min(1, "Kelurahan wajib dipilih."),
    postal_code: z.string().min(5, "Kode pos tidak valid.").max(5, "Kode pos tidak valid."),
    is_primary: z.boolean(),
    label: z.string().min(1, "Label alamat wajib diisi."),
});

interface FormAddressPageProps {
    params: Promise<{ id: string }>
}

export default function FormAddressPage({ }: FormAddressPageProps) {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const id = params.id;

    const { data, isLoading: isLoadingAddress } = useAddress(id!);
    const { mutate: handleUpdateAddress, isPending: isUpdatingAddress } = useUpdateAddress()
    const existingAddress = data?.data;

    const form = useForm<z.infer<typeof addressSchema>>({
        resolver: zodResolver(addressSchema),
        defaultValues: {
        }
    });



    // Watch untuk field terkait
    const watchedProvince = form.watch('province_id');
    const watchedRegency = form.watch('regency_id');
    const watchedDistrict = form.watch('district_id');

    // Mengambil data lokasi bertingkat
    const { data: provincesData } = useProvinces();
    const { data: regenciesData, isLoading: isLoadingRegencies } = useRegencies(String(watchedProvince ?? ''));
    const { data: districtsData, isLoading: isLoadingDistricts } = useDistricts(String(watchedRegency ?? ''));
    const { data: villagesData, isLoading: isLoadingVillages } = useVillages(String(watchedDistrict ?? ''));

    const provinces = provincesData?.data || [];
    const regencies = regenciesData?.data || [];
    const districts = districtsData?.data || [];
    const villages = villagesData?.data || [];

    useEffect(() => {
        if (existingAddress) {
            form.setValue("recipient_name", existingAddress.recipient_name)
            form.setValue("recipient_phone_number", existingAddress.recipient_phone_number)
            form.setValue("address", existingAddress.address)
            form.setValue("postal_code", String(existingAddress.postal_code))
            form.setValue("province_id", String(existingAddress.province_id))
            form.setValue("regency_id", String(existingAddress.regency_id))
            form.setValue("district_id", String(existingAddress.district_id))
            form.setValue("village_id", String(existingAddress.village_id))
            form.setValue("is_primary", existingAddress.is_primary)
            form.setValue("label", existingAddress.label)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [existingAddress])





    function onSubmit(values: z.infer<typeof addressSchema>) {
        handleUpdateAddress({
            data: {
                ...values,
                district_id: Number(values.district_id),
                province_id: Number(values.province_id),
                regency_id: Number(values.regency_id),
                village_id: Number(values.village_id),
            },
            id: id!
        })
    }



    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <Link href={"/pengguna/alamat"} className="text-gray-600 hover:text-primary transition-colors hover:cursor-pointer">
                                <i className="fas fa-arrow-left text-xl"></i>
                            </Link>
                            <h1 className="text-xl font-bold text-gray-800">
                                {'Edit Alamat'}
                            </h1>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            {isLoadingAddress ? (
                <main className="container mx-auto px-4 py-6">
                    <p className="text-center text-gray-500">Memuat data alamat...</p>
                </main>
            ) : !existingAddress ? (
                <main className="container mx-auto px-4 py-6">
                    <Card className="p-6 text-center">
                        <h2 className="text-xl font-bold text-red-600 mb-4">
                            <i className="fas fa-exclamation-triangle mr-2"></i>
                            Alamat tidak ditemukan
                        </h2>
                        <Button onClick={() => router.back()} variant="outline">
                            <i className="fas fa-arrow-left mr-2"></i> Kembali
                        </Button>
                    </Card>
                </main>
            ) : (
                <main className="container mx-auto px-4 py-6">
                    <Card className="p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-6">
                            <i className="fas fa-map-marker-alt mr-2 text-primary"></i>
                            Informasi Alamat
                        </h2>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField control={form.control} name="label" render={({ field }) => (
                                    <FormItem><FormLabel>Label  *</FormLabel><FormControl><Input placeholder="Masukkan Label alamat" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="recipient_name" render={({ field }) => (
                                    <FormItem><FormLabel>Nama Penerima *</FormLabel><FormControl><Input placeholder="Masukkan nama penerima" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="recipient_phone_number" render={({ field }) => (
                                    <FormItem><FormLabel>Nomor Telepon *</FormLabel><FormControl><Input placeholder="+62 812-3456-7890" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="address" render={({ field }) => (
                                    <FormItem><FormLabel>Alamat Lengkap *</FormLabel><FormControl><Textarea placeholder="Nama jalan, nomor rumah, RT/RW" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="province_id" render={({ field }) => (
                                    <FormItem><FormLabel>Province *</FormLabel>
                                        <Select onValueChange={(v) => {
                                            form.setValue('regency_id', '')
                                            form.setValue('district_id', '')
                                            form.setValue('village_id', '')
                                            field.onChange(v)
                                        }} defaultValue={String(existingAddress?.province_id)}>
                                            <FormControl className="w-full">
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih Provinsi">
                                                        {provinces.find(prov => Number(prov.id) == Number(field.value))?.name || 'Pilih Provinsi'}
                                                    </SelectValue>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {provinces.map(prov => (
                                                    <SelectItem key={prov.id} value={prov.id}>{prov.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="regency_id" render={({ field }) => (
                                    <FormItem><FormLabel>Kabupaten/Kota *</FormLabel>
                                        <Select
                                            defaultValue={String(existingAddress?.regency_id)}
                                            disabled={isLoadingRegencies}
                                            onValueChange={(v) => {
                                                field.onChange(v)
                                                form.setValue('district_id', '')
                                                form.setValue('village_id', '')
                                            }}>
                                            <FormControl className="w-full">
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih Kabupaten/Kota">
                                                        {regencies.find(reg => Number(reg.id) == Number(field.value))?.name || 'Pilih Kabupaten/Kota'}
                                                    </SelectValue>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {regencies.map(city => (
                                                    <SelectItem key={city.id} value={city.id}>{city.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="district_id" render={({ field }) => (
                                    <FormItem><FormLabel>Kecamatan *</FormLabel>
                                        <Select
                                            disabled={isLoadingDistricts}
                                            defaultValue={String(existingAddress?.district_id)}
                                            onValueChange={(v) => {
                                                field.onChange(v)
                                                form.setValue('village_id', '')
                                            }}>
                                            <FormControl className="w-full">
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih Kecamatan">
                                                        {districts.find(dist => Number(dist.id) == Number(field.value))?.name || 'Pilih Kecamatan'}
                                                    </SelectValue>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {districts.map(d => (
                                                    <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="village_id" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Kelurahan *</FormLabel>
                                        <Select
                                            disabled={isLoadingVillages}
                                            defaultValue={String(existingAddress?.village_id)}
                                            onValueChange={field.onChange}
                                        >
                                            <FormControl className="w-full">
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih Kelurahan">
                                                        {villages.find(vill => Number(vill.id) == Number(field.value))?.name || 'Pilih Kelurahan'}
                                                    </SelectValue>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {villages.map(v => (
                                                    <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="postal_code" render={({ field }) => (
                                    <FormItem><FormLabel>Kode Pos *</FormLabel><FormControl><Input placeholder="55xxx" maxLength={5} {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="is_primary" render={({ field }) => (
                                    <FormItem className="flex items-center gap-2 space-y-0 pt-2"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><Label className="font-normal"><i className="fas fa-star mr-2 text-yellow-500"></i>Jadikan alamat utama</Label></FormItem>
                                )} />
                                <div className="flex space-x-3 pt-4">
                                    <Button disabled={isUpdatingAddress} type="button" variant="outline" className="flex-1" onClick={() => router.back()}><i className="fas fa-times mr-2"></i>Batal</Button>
                                    <Button disabled={isUpdatingAddress} type="submit" className="flex-1" >{isUpdatingAddress ? 'Menyimpan...' : (<><i className="fas fa-save mr-2"></i>Simpan</>)}</Button>
                                </div>
                            </form>
                        </Form>
                    </Card>
                </main>
            )}
        </div>
    );
}
