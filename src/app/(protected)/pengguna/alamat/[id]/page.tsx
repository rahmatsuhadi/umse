"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Textarea } from "@/components/ui/textarea";
import { useAddress, useUpdateAddress } from "@/features/address/hooks";
import {
  useDistricts,
  useProvinces,
  useRegencies,
  useVillages,
} from "@/features/locations/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
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
  postal_code: z
    .string()
    .min(5, "Kode pos tidak valid.")
    .max(5, "Kode pos tidak valid."),
  is_primary: z.boolean(),
  label: z.string().min(1, "Label alamat wajib diisi."),
  note: z.string().optional(),
});

interface FormAddressPageProps {
  params: Promise<{ id: string }>;
}

export default function FormAddressPage({}: FormAddressPageProps) {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const { data, isLoading: isLoadingAddress } = useAddress(id!);
  const { mutate: handleUpdateAddress, isPending: isUpdatingAddress } =
    useUpdateAddress();
  const existingAddress = data?.data;

  const form = useForm<z.infer<typeof addressSchema>>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      address: "",
      district_id: "",
      is_primary: false,
      label: "",
      note: "",
      postal_code: "",
      province_id: "",
      regency_id: "",
      recipient_name: "",
      recipient_phone_number: "",
      village_id: "",
    },
  });

  // Watch untuk field terkait
  const watchedProvince = form.watch("province_id");
  const watchedRegency = form.watch("regency_id");
  const watchedDistrict = form.watch("district_id");

  // Mengambil data lokasi bertingkat
  const { data: provincesData, isLoading: isLoadingProvinces } = useProvinces();
  const { data: regenciesData, isLoading: isLoadingRegencies } =
    useRegencies(watchedProvince);
  const { data: districtsData, isLoading: isLoadingDistricts } =
    useDistricts(watchedRegency);
  const { data: villagesData, isLoading: isLoadingVillages } =
    useVillages(watchedDistrict);

  const provinces = provincesData?.data || [];
  const regencies = regenciesData?.data || [];
  const districts = districtsData?.data || [];
  const villages = villagesData?.data || [];

  useEffect(() => {
    if (existingAddress) {
      form.reset({
        recipient_name: existingAddress.recipient_name || "",
        recipient_phone_number: existingAddress.recipient_phone_number || "",
        address: existingAddress.address || "",
        postal_code: String(existingAddress.postal_code || ""),
        province_id: existingAddress.province_id
          ? String(existingAddress.province_id)
          : "",
        regency_id: existingAddress.regency_id
          ? String(existingAddress.regency_id)
          : "",
        district_id: existingAddress.district_id
          ? String(existingAddress.district_id)
          : "",
        village_id: existingAddress.village_id
          ? String(existingAddress.village_id)
          : "",
        is_primary: !!existingAddress.is_primary,
        label: existingAddress.label || "",
        note: existingAddress.note || "",
      });
    }
  }, [existingAddress, form]);

  function onSubmit(values: z.infer<typeof addressSchema>) {
    handleUpdateAddress({
      data: {
        ...values,
        district_id: Number(values.district_id),
        province_id: Number(values.province_id),
        regency_id: Number(values.regency_id),
        village_id: Number(values.village_id),
      },
      id: id!,
    });
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                href={"/pengguna/alamat"}
                className="text-gray-600 hover:text-primary transition-colors hover:cursor-pointer"
              >
                <i className="fas fa-arrow-left text-xl"></i>
              </Link>
              <h1 className="text-xl font-bold text-gray-800">
                {"Edit Alamat"}
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
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="label"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Label *</FormLabel>
                      <FormControl>
                        <Input placeholder="Masukkan Label alamat" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="recipient_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Penerima *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Masukkan nama penerima"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="recipient_phone_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nomor Telepon *</FormLabel>
                      <FormControl>
                        <Input placeholder="+62 812-3456-7890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alamat Lengkap *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Nama jalan, nomor rumah, RT/RW"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="province_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Provinsi *</FormLabel>
                      <Select
                        disabled={isLoadingProvinces}
                        value={field.value || ""}
                        onValueChange={(v) => {
                          if (!!v) {
                            form.setValue("province_id", v);
                            form.setValue("regency_id", "");
                            form.setValue("district_id", "");
                            form.setValue("village_id", "");
                          }
                        }}
                      >
                        <FormControl className="w-full">
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                <>
                                  {isLoadingProvinces ? (
                                    <>
                                      <Loader2 className="animate-spin text-gray-400" />
                                      <span className="text-gray-400">
                                        Mohon Tunggu Sebentar
                                      </span>
                                    </>
                                  ) : (
                                    "Pilih Provinsi"
                                  )}
                                </>
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {provinces.map((prov) => (
                            <SelectItem key={prov.id} value={String(prov.id)}>
                              {prov.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* ==================== KABUPATEN / KOTA ==================== */}
                <FormField
                  control={form.control}
                  name="regency_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kabupaten/Kota *</FormLabel>
                      <Select
                        disabled={!watchedProvince || isLoadingRegencies}
                        value={field.value || ""}
                        onValueChange={(v) => {
                          if (!!v) {
                            form.setValue("regency_id", v);
                            form.setValue("district_id", "");
                            form.setValue("village_id", "");
                          }
                        }}
                      >
                        <FormControl className="w-full">
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                <>
                                  {isLoadingRegencies ? (
                                    <>
                                      <Loader2 className="animate-spin text-gray-400" />
                                      <span className="text-gray-400">
                                        Mohon Tunggu Sebentar
                                      </span>
                                    </>
                                  ) : (
                                    "Pilih Kabupaten/Kota"
                                  )}
                                </>
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {regencies.map((city) => (
                            <SelectItem key={city.id} value={String(city.id)}>
                              {city.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* ==================== KECAMATAN ==================== */}
                <FormField
                  control={form.control}
                  name="district_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kapanewon *</FormLabel>
                      <Select
                        disabled={!watchedRegency || isLoadingDistricts}
                        value={field.value || ""}
                        onValueChange={(v) => {
                          if (!!v) {
                            form.setValue("district_id", v);
                            form.setValue("village_id", "");
                          }
                        }}
                      >
                        <FormControl className="w-full">
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                <>
                                  {isLoadingDistricts ? (
                                    <>
                                      <Loader2 className="animate-spin text-gray-400" />
                                      <span className="text-gray-400">
                                        Mohon Tunggu Sebentar
                                      </span>
                                    </>
                                  ) : (
                                    "Pilih Kapanewon"
                                  )}
                                </>
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {districts.map((d) => (
                            <SelectItem key={d.id} value={String(d.id)}>
                              {d.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* ==================== KELURAHAN ==================== */}
                <FormField
                  control={form.control}
                  name="village_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kelurahan *</FormLabel>
                      <Select
                        disabled={!watchedDistrict || isLoadingVillages}
                        value={field.value || ""}
                        onValueChange={(v) => {
                          if (!!v) {
                            form.setValue("village_id", v);
                          }
                        }}
                      >
                        <FormControl className="w-full">
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                <>
                                  {isLoadingVillages ? (
                                    <>
                                      <Loader2 className="animate-spin text-gray-400" />
                                      <span className="text-gray-400">
                                        Mohon Tunggu Sebentar
                                      </span>
                                    </>
                                  ) : (
                                    "Pilih Kelurahan"
                                  )}
                                </>
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {villages.map((v) => (
                            <SelectItem key={v.id} value={String(v.id)}>
                              {v.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="postal_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kode Pos *</FormLabel>
                      <FormControl>
                        <Input placeholder="55xxx" maxLength={5} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Note tambahan</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="contoh: rumah warna hijau hadap barat"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="is_primary"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2 space-y-0 pt-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <Label className="font-normal">
                        <i className="fas fa-star mr-2 text-yellow-500"></i>
                        Jadikan alamat utama
                      </Label>
                    </FormItem>
                  )}
                />
                <div className="flex space-x-3 pt-4">
                  <Button
                    disabled={isUpdatingAddress}
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => router.back()}
                  >
                    <i className="fas fa-times mr-2"></i>Batal
                  </Button>
                  <Button
                    disabled={isUpdatingAddress}
                    type="submit"
                    className="flex-1"
                  >
                    {isUpdatingAddress ? (
                      "Menyimpan..."
                    ) : (
                      <>
                        <i className="fas fa-save mr-2"></i>Simpan
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </Card>
        </main>
      )}
    </div>
  );
}
