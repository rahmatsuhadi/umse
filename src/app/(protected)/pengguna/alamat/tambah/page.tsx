"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAddAddress } from "@/features/address/hooks";
import {
  useDistricts,
  useProvinces,
  useRegencies,
  useVillages,
} from "@/features/locations/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  FileText,
  Home,
  Loader2,
  MapPin,
  Phone,
  Save,
  Star,
  Tag,
  User2,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import z from "zod";
import { normalizePhoneNumber } from "@/components/checkouts/CheckoutForm";
import { AddressLocationPicker } from "@/components/maps/AddressLocationPicker";
import { toast } from "sonner";

const addressSchema = z.object({
  recipient_name: z.string().min(1, "Nama penerima wajib diisi."),
  recipient_phone_number: z
    .string()
    .min(1, "Nomor telepon wajib diisi.")
    .refine(
      (val) => /^08[0-9]{8,12}$/.test(normalizePhoneNumber(val)),
      "Nomor telepon tidak valid. Gunakan format nomor ponsel Indonesia (contoh: 08123456789)."
    ),
  address: z.string().min(1, "Alamat lengkap wajib diisi."),
  province_id: z.string().min(1, "Provinsi wajib dipilih."),
  regency_id: z.string().min(1, "Kabupaten/Kota wajib dipilih."),
  district_id: z.string().min(1, "Kecamatan wajib dipilih."),
  village_id: z.string().min(1, "Kelurahan wajib dipilih."),
  postal_code: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[0-9]{5}$/.test(val),
      "Kode pos harus terdiri dari 5 digit angka."
    ),
  is_primary: z.boolean(),
  label: z.string().min(1, "Label alamat wajib diisi."),
  note: z.string().optional(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
});

const labelStyle: React.CSSProperties = {
  fontWeight: 600,
  fontSize: 13,
  color: "var(--text-secondary, #4A3728)",
};

const inputStyle: React.CSSProperties = {
  height: 44,
  borderRadius: 10,
  border: "1.5px solid var(--cream-dark, #F0D5C2)",
  background: "white",
  paddingLeft: 40,
  fontSize: 14,
};

const iconStyle: React.CSSProperties = {
  position: "absolute",
  left: 12,
  top: "50%",
  transform: "translateY(-50%)",
  color: "var(--brown-light, #9B7B5A)",
  pointerEvents: "none",
};

interface FormAddressPageProps {
  params: Promise<{ id: string }>;
}

export default function FormAddressPage({}: FormAddressPageProps) {
  const router = useRouter();
  const { mutate: handleAddAddress, isPending } = useAddAddress();

  const form = useForm<z.infer<typeof addressSchema>>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      address: "", is_primary: false, label: "",
      postal_code: "", recipient_name: "", recipient_phone_number: "", note: "",
      latitude: null, longitude: null,
    },
  });

  // useWatch isolates subscriptions per field — prevents whole-form re-renders
  // that trigger Radix useComposedRefs setState loop (React 19)
  const watchedProvince = useWatch({ control: form.control, name: "province_id" });
  const watchedRegency = useWatch({ control: form.control, name: "regency_id" });
  const watchedDistrict = useWatch({ control: form.control, name: "district_id" });
  const watchedVillage = useWatch({ control: form.control, name: "village_id" });
  const watchedAddress = useWatch({ control: form.control, name: "address" });
  const watchedLatitude = useWatch({ control: form.control, name: "latitude" });
  const watchedLongitude = useWatch({ control: form.control, name: "longitude" });

  const { data: provincesData, isLoading: isLoadingProvinces } = useProvinces();
  const { data: regenciesData, isLoading: isLoadingRegencies } = useRegencies(watchedProvince);
  const { data: districtsData, isLoading: isLoadingDistricts } = useDistricts(watchedRegency);
  const { data: villagesData, isLoading: isLoadingVillages } = useVillages(watchedDistrict);

  // Stable references — new [] on every render triggers Radix useComposedRefs loop (React 19)
  const provinces = useMemo(() => provincesData?.data ?? [], [provincesData?.data]);
  const regencies = useMemo(() => regenciesData?.data ?? [], [regenciesData?.data]);
  const districts = useMemo(() => districtsData?.data ?? [], [districtsData?.data]);
  const villages = useMemo(() => villagesData?.data ?? [], [villagesData?.data]);

  const selectedProvinceName = useMemo(() => {
    return provinces.find((p) => String(p.id) === String(watchedProvince))?.name || "";
  }, [provinces, watchedProvince]);

  const selectedRegencyName = useMemo(() => {
    return regencies.find((r) => String(r.id) === String(watchedRegency))?.name || "";
  }, [regencies, watchedRegency]);

  const selectedDistrictName = useMemo(() => {
    return districts.find((d) => String(d.id) === String(watchedDistrict))?.name || "";
  }, [districts, watchedDistrict]);

  const selectedVillageName = useMemo(() => {
    return villages.find((v) => String(v.id) === String(watchedVillage))?.name || "";
  }, [villages, watchedVillage]);

  // Query alamat lengkap untuk pencarian otomatis pada peta saat create
  const formAddressQuery = useMemo(() => {
    const parts: string[] = [];
    if (watchedAddress?.trim()) parts.push(watchedAddress.trim());
    if (selectedVillageName && !watchedAddress?.toLowerCase().includes(selectedVillageName.toLowerCase())) {
      parts.push(selectedVillageName);
    }
    if (selectedDistrictName && !watchedAddress?.toLowerCase().includes(selectedDistrictName.toLowerCase())) {
      parts.push(selectedDistrictName);
    }
    if (selectedRegencyName && !watchedAddress?.toLowerCase().includes(selectedRegencyName.toLowerCase())) {
      parts.push(selectedRegencyName);
    }
    if (selectedProvinceName && !watchedAddress?.toLowerCase().includes(selectedProvinceName.toLowerCase())) {
      parts.push(selectedProvinceName);
    }
    return parts.join(", ");
  }, [watchedAddress, selectedVillageName, selectedDistrictName, selectedRegencyName, selectedProvinceName]);

  // Query fallback jika alamat spesifik tidak terindeks Nominatim OSM
  const formFallbackQuery = useMemo(() => {
    const parts: string[] = [];
    if (selectedVillageName) parts.push(selectedVillageName);
    if (selectedDistrictName) parts.push(selectedDistrictName);
    if (selectedRegencyName) parts.push(selectedRegencyName);
    if (selectedProvinceName) parts.push(selectedProvinceName);
    return parts.join(", ");
  }, [selectedVillageName, selectedDistrictName, selectedRegencyName, selectedProvinceName]);

  // Stable handler references — inline arrows in JSX change every render
  const handleProvinceChange = useCallback((v: string) => {
    form.setValue("province_id", v);
    form.setValue("regency_id", "");
    form.setValue("district_id", "");
    form.setValue("village_id", "");
  }, [form]);

  const handleRegencyChange = useCallback((v: string) => {
    form.setValue("regency_id", v);
    form.setValue("district_id", "");
    form.setValue("village_id", "");
  }, [form]);

  const handleDistrictChange = useCallback((v: string) => {
    form.setValue("district_id", v);
    form.setValue("village_id", "");
  }, [form]);

  const handleVillageChange = useCallback((v: string) => {
    form.setValue("village_id", v);
  }, [form]);

  const handleLocationSelect = useCallback((lat: number, lng: number) => {
    form.setValue("latitude", lat, { shouldValidate: true, shouldDirty: true });
    form.setValue("longitude", lng, { shouldValidate: true, shouldDirty: true });
  }, [form]);

  const handleLocationClear = useCallback(() => {
    form.setValue("latitude", null, { shouldValidate: true, shouldDirty: true });
    form.setValue("longitude", null, { shouldValidate: true, shouldDirty: true });
  }, [form]);

  const onInvalid = useCallback((errors: Record<string, unknown>) => {
    console.error("Form validation errors:", errors);
    const errorList = Object.values(errors) as Array<{ message?: string }>;
    const firstMsg = errorList.find((e) => e?.message)?.message;
    if (firstMsg) {
      toast.error("Form belum lengkap", { description: String(firstMsg) });
    }
  }, []);

  function onSubmit(values: z.infer<typeof addressSchema>) {
    handleAddAddress({
      ...values,
      recipient_phone_number: normalizePhoneNumber(values.recipient_phone_number),
      note: values.note ? values.note : null,
      postal_code: values.postal_code ? values.postal_code : null,
      district_id: Number(values.district_id),
      province_id: Number(values.province_id),
      regency_id: Number(values.regency_id),
      village_id: Number(values.village_id),
      latitude: values.latitude != null ? Number(values.latitude) : null,
      longitude: values.longitude != null ? Number(values.longitude) : null,
    });
  }

  return (
    <div style={{ background: "var(--cream, #FFF9F4)", minHeight: "100vh" }}>
      {/* Sub-header */}
      <SubHeader title="Tambah Alamat" backHref="/pengguna/alamat" />

      <main style={{ maxWidth: 600, margin: "0 auto", padding: "24px 16px 64px" }}>
        <div
          style={{
            background: "white",
            borderRadius: 20,
            border: "1.5px solid var(--cream-dark, #F0D5C2)",
            boxShadow: "0 4px 20px rgba(44,24,16,0.08)",
            padding: "28px 24px",
          }}
        >
          {/* Section title */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: "rgba(247,98,10,0.08)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--terracotta, #F7620A)",
            }}>
              <MapPin size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: 15, fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
                Informasi Alamat
              </h2>
              <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0 }}>Isi data penerima & lokasi pengiriman</p>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Label */}
              <FormField control={form.control} name="label" render={({ field }) => (
                <FormItem>
                  <FormLabel style={labelStyle}>Label Alamat</FormLabel>
                  <FormControl>
                    <div style={{ position: "relative" }}>
                      <Tag size={15} style={iconStyle} />
                      <Input placeholder="Rumah / Kantor / dll" style={inputStyle} {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              {/* 2-col: Nama + Telepon */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <FormField control={form.control} name="recipient_name" render={({ field }) => (
                  <FormItem>
                    <FormLabel style={labelStyle}>Nama Penerima</FormLabel>
                    <FormControl>
                      <div style={{ position: "relative" }}>
                        <User2 size={15} style={iconStyle} />
                        <Input placeholder="Nama penerima" style={inputStyle} {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="recipient_phone_number" render={({ field }) => (
                  <FormItem>
                    <FormLabel style={labelStyle}>Nomor Telepon</FormLabel>
                    <FormControl>
                      <div style={{ position: "relative" }}>
                        <Phone size={15} style={iconStyle} />
                        <Input placeholder="08xx xxxx xxxx" style={inputStyle} {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              {/* Alamat */}
              <FormField control={form.control} name="address" render={({ field }) => (
                <FormItem>
                  <FormLabel style={labelStyle}>Alamat Lengkap</FormLabel>
                  <FormControl>
                    <div style={{ position: "relative" }}>
                      <Home size={15} style={{ ...iconStyle, top: 14, transform: "none" }} />
                      <Textarea
                        placeholder="Nama jalan, nomor rumah, RT/RW"
                        style={{
                          borderRadius: 10,
                          border: "1.5px solid var(--cream-dark, #F0D5C2)",
                          paddingLeft: 40,
                          paddingTop: 10,
                          fontSize: 14,
                          minHeight: 80,
                          resize: "vertical",
                        }}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              {/* Divider */}
              <SectionDivider label="Wilayah" />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {/* Provinsi */}
                <LocationSelect
                  form={form} name="province_id" label="Provinsi"
                  items={provinces} isLoading={isLoadingProvinces}
                  placeholder="Pilih Provinsi"
                  onValueChange={handleProvinceChange}
                />

                <LocationSelect
                  form={form} name="regency_id" label="Kabupaten/Kota"
                  items={regencies} isLoading={isLoadingRegencies}
                  disabled={!watchedProvince}
                  placeholder="Pilih Kabupaten/Kota"
                  onValueChange={handleRegencyChange}
                />

                <LocationSelect
                  form={form} name="district_id" label="Kapanewon"
                  items={districts} isLoading={isLoadingDistricts}
                  disabled={!watchedRegency}
                  placeholder="Pilih Kapanewon"
                  onValueChange={handleDistrictChange}
                />

                <LocationSelect
                  form={form} name="village_id" label="Kelurahan / Kalurahan"
                  items={villages} isLoading={isLoadingVillages}
                  disabled={!watchedDistrict}
                  placeholder="Pilih Kelurahan"
                  onValueChange={handleVillageChange}
                />

                <FormField control={form.control} name="postal_code" render={({ field }) => (
                  <FormItem>
                    <FormLabel style={labelStyle}>Kode Pos</FormLabel>
                    <FormControl>
                      <Input placeholder="55xxx" maxLength={5} style={{ ...inputStyle, paddingLeft: 16 }} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <SectionDivider label="Titik Koordinat Lokasi" />

              <AddressLocationPicker
                latitude={watchedLatitude}
                longitude={watchedLongitude}
                onLocationSelect={handleLocationSelect}
                onLocationClear={handleLocationClear}
                formAddressQuery={formAddressQuery}
                formFallbackQuery={formFallbackQuery}
              />

              {/* Catatan */}
              <FormField control={form.control} name="note" render={({ field }) => (
                <FormItem>
                  <FormLabel style={labelStyle}>Catatan Tambahan <span style={{ fontWeight: 400, color: "var(--text-muted)" }}>(opsional)</span></FormLabel>
                  <FormControl>
                    <div style={{ position: "relative" }}>
                      <FileText size={15} style={{ ...iconStyle, top: 14, transform: "none" }} />
                      <Textarea
                        placeholder="Contoh: rumah warna hijau, hadap barat"
                        style={{
                          borderRadius: 10,
                          border: "1.5px solid var(--cream-dark, #F0D5C2)",
                          paddingLeft: 40,
                          paddingTop: 10,
                          fontSize: 14,
                          minHeight: 64,
                          resize: "vertical",
                        }}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              {/* Alamat Utama toggle */}
              <FormField control={form.control} name="is_primary" render={({ field }) => (
                <FormItem>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "12px 16px",
                      borderRadius: 10,
                      border: `1.5px solid ${field.value ? "var(--terracotta, #F7620A)" : "var(--cream-dark, #F0D5C2)"}`,
                      background: field.value ? "rgba(247,98,10,0.04)" : "white",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onClick={() => field.onChange(!field.value)}
                  >
                    <FormControl>
                      <div style={{ pointerEvents: "none" }}>
                        <Checkbox
                          checked={field.value}
                          style={{ accentColor: "var(--terracotta)" }}
                        />
                      </div>
                    </FormControl>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Star size={15} style={{ color: "#F39C12" }} />
                      <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-secondary)" }}>
                        Jadikan alamat utama
                      </span>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )} />

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => router.back()}
                  disabled={isPending}
                  style={{
                    flex: 1, height: 46, borderRadius: 10,
                    border: "1.5px solid var(--cream-dark, #F0D5C2)",
                    background: "white",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    fontSize: 14, fontWeight: 600,
                    color: "var(--text-secondary, #4A3728)",
                    cursor: "pointer",
                  }}
                >
                  <X size={15} /> Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  style={{
                    flex: 2, height: 46, borderRadius: 10,
                    background: "var(--terracotta, #F7620A)",
                    border: "none", color: "white",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    fontSize: 14, fontWeight: 700,
                    cursor: isPending ? "not-allowed" : "pointer",
                    opacity: isPending ? 0.75 : 1,
                  }}
                >
                  {isPending ? <><Loader2 size={15} className="animate-spin" /> Menyimpan...</> : <><Save size={15} /> Simpan Alamat</>}
                </button>
              </div>
            </form>
          </Form>
        </div>
      </main>
    </div>
  );
}

/* ── Shared components ── */

function SubHeader({ title, backHref }: { title: string; backHref: string }) {
  return (
    <div
      style={{
        background: "white",
        borderBottom: "1px solid var(--cream-dark, #F0D5C2)",
        padding: "0 20px",
        height: 56,
        display: "flex",
        alignItems: "center",
        gap: 12,
        position: "sticky",
        top: 0,
        zIndex: 40,
      }}
    >
      <Link
        href={backHref}
        style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          width: 36, height: 36, borderRadius: 10,
          background: "var(--cream, #FFF9F4)",
          color: "var(--text-primary, #1A1008)",
          textDecoration: "none",
          border: "1.5px solid var(--cream-dark, #F0D5C2)",
        }}
      >
        <ArrowLeft size={18} />
      </Link>
      <h1 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary, #1A1008)", margin: 0 }}>
        {title}
      </h1>
    </div>
  );
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "4px 0" }}>
      <div style={{ flex: 1, height: 1, background: "var(--cream-dark, #F0D5C2)" }} />
      <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
        {label}
      </span>
      <div style={{ flex: 1, height: 1, background: "var(--cream-dark, #F0D5C2)" }} />
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function LocationSelect({ form, name, label, items, isLoading, disabled, placeholder, onValueChange }: any) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }: { field: { value: string } }) => {
        return (
          <FormItem>
            <FormLabel style={labelStyle}>{label}</FormLabel>
            <Select
              disabled={disabled || isLoading}
              value={field.value ? String(field.value) : ""}
              onValueChange={onValueChange}
            >
              <FormControl>
                <SelectTrigger
                  style={{
                    width: "100%",
                    height: 44, borderRadius: 10,
                    border: "1.5px solid var(--cream-dark, #F0D5C2)",
                    fontSize: 14,
                  }}
                >
                  <SelectValue
                    placeholder={
                      isLoading ? (
                        <span style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-muted)" }}>
                          <Loader2 size={13} className="animate-spin" /> Memuat...
                        </span>
                      ) : (
                        placeholder
                      )
                    }
                  />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {items.map((item: { id: number | string; name: string }) => (
                  <SelectItem key={item.id} value={String(item.id)}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
