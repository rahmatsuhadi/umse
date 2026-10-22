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
import { useAddress, useUpdateAddress } from "@/features/address/hooks";
import {
  useDistricts,
  useProvinces,
  useRegencies,
  useVillages,
} from "@/features/locations/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertTriangle,
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
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import z from "zod";
import { normalizePhoneNumber } from "@/components/checkouts/CheckoutForm";
import { AddressLocationPicker } from "@/components/maps/AddressLocationPicker";
import { toast } from "sonner";

// ── Schema ───────────────────────────────────────────────────────────────────
const addressSchema = z.object({
  label: z.string().min(1, "Label alamat wajib diisi."),
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
  note: z.string().optional(),
  is_primary: z.boolean(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
});

type AddressFormValues = z.infer<typeof addressSchema>;

// ── Static styles (outside component — stable across renders) ─────────────────
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

const textareaIconStyle: React.CSSProperties = {
  position: "absolute",
  left: 12,
  top: 14,
  color: "var(--brown-light, #9B7B5A)",
  pointerEvents: "none",
};

const textareaStyle: React.CSSProperties = {
  borderRadius: 10,
  border: "1.5px solid var(--cream-dark, #F0D5C2)",
  paddingLeft: 40,
  paddingTop: 10,
  fontSize: 14,
  resize: "vertical",
};

// ── Helpers ──────────────────────────────────────────────────────────────────
// Menunda nilai yang berubah cepat (mis. ketikan alamat) supaya map picker
// tidak melakukan geocoding / re-render di setiap huruf.
function useDebouncedValue<T>(value: T, delay = 800): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// ── Page component ────────────────────────────────────────────────────────────
export default function EditAddressPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const { data, isLoading: isLoadingAddress } = useAddress(id!);
  const { mutate: handleUpdateAddress, isPending } = useUpdateAddress();
  const existingAddress = data?.data;

  // Form init
  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      label: "",
      recipient_name: "",
      recipient_phone_number: "",
      address: "",
      province_id: "",
      regency_id: "",
      district_id: "",
      village_id: "",
      postal_code: "",
      note: "",
      is_primary: false,
      latitude: null,
      longitude: null,
    },
  });

  // One-time init guard — prevents re-running form.reset() after user edits
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (existingAddress && !hasInitialized.current) {
      hasInitialized.current = true;
      form.reset({
        label: existingAddress.label || "",
        recipient_name: existingAddress.recipient_name || "",
        recipient_phone_number: existingAddress.recipient_phone_number
          ? normalizePhoneNumber(existingAddress.recipient_phone_number)
          : "",
        address: existingAddress.address || "",
        province_id: existingAddress.province_id ? String(existingAddress.province_id) : "",
        regency_id: existingAddress.regency_id ? String(existingAddress.regency_id) : "",
        district_id: existingAddress.district_id ? String(existingAddress.district_id) : "",
        village_id: existingAddress.village_id ? String(existingAddress.village_id) : "",
        postal_code: existingAddress.postal_code ? String(existingAddress.postal_code) : "",
        note: existingAddress.note || "",
        is_primary: !!existingAddress.is_primary,
        latitude: existingAddress.latitude ?? null,
        longitude: existingAddress.longitude ?? null,
      });
    }
  }, [existingAddress, form]);

  // useWatch creates isolated per-field subscriptions — unlike form.watch() which
  // triggers full parent re-renders and causes Radix useComposedRefs setState loop (React 19)
  const watchedProvince  = useWatch({ control: form.control, name: "province_id" });
  const watchedRegency   = useWatch({ control: form.control, name: "regency_id" });
  const watchedDistrict  = useWatch({ control: form.control, name: "district_id" });
  const watchedVillage   = useWatch({ control: form.control, name: "village_id" });
  const watchedAddress   = useWatch({ control: form.control, name: "address" });
  const watchedLatitude  = useWatch({ control: form.control, name: "latitude" });
  const watchedLongitude = useWatch({ control: form.control, name: "longitude" });

  // Location data
  const { data: provincesData, isLoading: isLoadingProvinces } = useProvinces();
  const { data: regenciesData, isLoading: isLoadingRegencies } = useRegencies(watchedProvince);
  const { data: districtsData, isLoading: isLoadingDistricts } = useDistricts(watchedRegency);
  const { data: villagesData,  isLoading: isLoadingVillages  } = useVillages(watchedDistrict);

  // Stable array refs — avoids remounting Radix SelectItem children on each render
  // Data dropdown anak DIKOSONGKAN selama parent belum dipilih. Jika hook API
  // dipanggil dengan id kosong, backend bisa mengembalikan SEMUA data (puluhan
  // ribu desa) dan merender-nya akan membekukan / meng-crash browser.
  const provinces = useMemo(() => provincesData?.data ?? [], [provincesData?.data]);
  const regencies = useMemo(
    () => (watchedProvince ? regenciesData?.data ?? [] : []),
    [watchedProvince, regenciesData?.data]
  );
  const districts = useMemo(
    () => (watchedRegency ? districtsData?.data ?? [] : []),
    [watchedRegency, districtsData?.data]
  );
  const villages = useMemo(
    () => (watchedDistrict ? villagesData?.data ?? [] : []),
    [watchedDistrict, villagesData?.data]
  );

  // Pre-seed items with existing address if remote data is still loading
  const provinceItems = provinces;

  const regencyItems = useMemo(() => {
    if (regencies.length > 0) return regencies;
    if (
      existingAddress?.regency &&
      String(watchedProvince) === String(existingAddress.province_id)
    ) {
      return [{ id: existingAddress.regency.id, name: existingAddress.regency.name }];
    }
    return [];
  }, [regencies, existingAddress, watchedProvince]);

  const districtItems = useMemo(() => {
    if (districts.length > 0) return districts;
    if (
      existingAddress?.district &&
      String(watchedRegency) === String(existingAddress.regency_id)
    ) {
      return [{ id: existingAddress.district.id, name: existingAddress.district.name }];
    }
    return [];
  }, [districts, existingAddress, watchedRegency]);

  const villageItems = useMemo(() => {
    if (villages.length > 0) return villages;
    if (
      existingAddress?.village &&
      String(watchedDistrict) === String(existingAddress.district_id)
    ) {
      return [{ id: existingAddress.village.id, name: existingAddress.village.name }];
    }
    return [];
  }, [villages, existingAddress, watchedDistrict]);

  const selectedProvinceName = useMemo(() => {
    return (
      provinceItems.find((p) => String(p.id) === String(watchedProvince))?.name ||
      (String(watchedProvince) === String(existingAddress?.province_id)
        ? existingAddress?.province?.name || ""
        : "")
    );
  }, [provinceItems, watchedProvince, existingAddress]);

  const selectedRegencyName = useMemo(() => {
    return (
      regencyItems.find((r) => String(r.id) === String(watchedRegency))?.name ||
      (String(watchedRegency) === String(existingAddress?.regency_id)
        ? existingAddress?.regency?.name || ""
        : "")
    );
  }, [regencyItems, watchedRegency, existingAddress]);

  const selectedDistrictName = useMemo(() => {
    return (
      districtItems.find((d) => String(d.id) === String(watchedDistrict))?.name ||
      (String(watchedDistrict) === String(existingAddress?.district_id)
        ? existingAddress?.district?.name || ""
        : "")
    );
  }, [districtItems, watchedDistrict, existingAddress]);

  const selectedVillageName = useMemo(() => {
    return (
      villageItems.find((v) => String(v.id) === String(watchedVillage))?.name ||
      (String(watchedVillage) === String(existingAddress?.village_id)
        ? existingAddress?.village?.name || ""
        : "")
    );
  }, [villageItems, watchedVillage, existingAddress]);

  const formAddressQuery = useMemo(() => {
    const addr = watchedAddress?.trim() ?? "";
    const parts: string[] = [];
    if (addr) parts.push(addr);
    const lower = addr.toLowerCase();
    if (selectedVillageName  && !lower.includes(selectedVillageName.toLowerCase()))  parts.push(selectedVillageName);
    if (selectedDistrictName && !lower.includes(selectedDistrictName.toLowerCase())) parts.push(selectedDistrictName);
    if (selectedRegencyName  && !lower.includes(selectedRegencyName.toLowerCase()))  parts.push(selectedRegencyName);
    if (selectedProvinceName && !lower.includes(selectedProvinceName.toLowerCase())) parts.push(selectedProvinceName);
    return parts.join(", ");
  }, [watchedAddress, selectedVillageName, selectedDistrictName, selectedRegencyName, selectedProvinceName]);

  const formFallbackQuery = useMemo(() => {
    const parts: string[] = [];
    if (selectedVillageName)  parts.push(selectedVillageName);
    if (selectedDistrictName) parts.push(selectedDistrictName);
    if (selectedRegencyName)  parts.push(selectedRegencyName);
    if (selectedProvinceName) parts.push(selectedProvinceName);
    return parts.join(", ");
  }, [selectedVillageName, selectedDistrictName, selectedRegencyName, selectedProvinceName]);

  const debouncedAddressQuery  = useDebouncedValue(formAddressQuery, 800);
  const debouncedFallbackQuery = useDebouncedValue(formFallbackQuery, 800);

  // Stable handlers — inline arrows in JSX create new refs every render
  const handleProvinceChange = useCallback((v: string) => {
    form.setValue("province_id", v,  { shouldDirty: true });
    form.setValue("regency_id",  "",  { shouldDirty: true });
    form.setValue("district_id", "",  { shouldDirty: true });
    form.setValue("village_id",  "",  { shouldDirty: true });
  }, [form]);

  const handleRegencyChange = useCallback((v: string) => {
    form.setValue("regency_id",  v,  { shouldDirty: true });
    form.setValue("district_id", "",  { shouldDirty: true });
    form.setValue("village_id",  "",  { shouldDirty: true });
  }, [form]);

  const handleDistrictChange = useCallback((v: string) => {
    form.setValue("district_id", v,  { shouldDirty: true });
    form.setValue("village_id",  "",  { shouldDirty: true });
  }, [form]);

  const handleVillageChange = useCallback((v: string) => {
    form.setValue("village_id", v, { shouldDirty: true });
  }, [form]);

  const handleLocationSelect = useCallback((lat: number, lng: number) => {
    // Abaikan jika koordinat sama: mencegah loop picker -> setValue -> re-render -> picker
    const { latitude, longitude } = form.getValues();
    const same = (a?: number | null, b?: number) =>
      a != null && b != null && Math.abs(a - b) < 1e-7;
    if (same(latitude, lat) && same(longitude, lng)) return;
    form.setValue("latitude",  lat, { shouldValidate: true, shouldDirty: true });
    form.setValue("longitude", lng, { shouldValidate: true, shouldDirty: true });
  }, [form]);

  const handleLocationClear = useCallback(() => {
    const { latitude, longitude } = form.getValues();
    if (latitude == null && longitude == null) return;
    form.setValue("latitude",  null, { shouldValidate: true, shouldDirty: true });
    form.setValue("longitude", null, { shouldValidate: true, shouldDirty: true });
  }, [form]);

  const handleBack = useCallback(() => router.back(), [router]);

  const onInvalid = useCallback((errors: Record<string, unknown>) => {
    console.error("Form validation errors:", errors);
    const msgs = Object.values(errors) as Array<{ message?: string }>;
    const firstMsg = msgs.find((e) => e?.message)?.message;
    if (firstMsg) toast.error("Form belum lengkap", { description: String(firstMsg) });
  }, []);

  const onSubmit = useCallback((values: AddressFormValues) => {
    const targetId = existingAddress?.id ?? id;
    if (!targetId) { toast.error("ID alamat tidak valid"); return; }
    handleUpdateAddress({
      id: targetId,
      data: {
        ...values,
        recipient_phone_number: normalizePhoneNumber(values.recipient_phone_number),
        province_id:  Number(values.province_id),
        regency_id:   Number(values.regency_id),
        district_id:  Number(values.district_id),
        village_id:   Number(values.village_id),
        postal_code:  values.postal_code  || null,
        note:         values.note         || null,
        latitude:     values.latitude  != null ? Number(values.latitude)  : null,
        longitude:    values.longitude != null ? Number(values.longitude) : null,
      },
    });
  }, [existingAddress?.id, id, handleUpdateAddress]);

  return (
    <div style={{ background: "var(--cream, #FFF9F4)", minHeight: "100vh" }}>
      <SubHeader title="Edit Alamat" backHref="/pengguna/alamat" />

      <main style={{ maxWidth: 600, margin: "0 auto", padding: "24px 16px 64px" }}>

        {isLoadingAddress ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} style={{
                height: 44, borderRadius: 10, background: "white",
                border: "1.5px solid var(--cream-dark, #F0D5C2)",
                animation: "pulse 1.5s ease-in-out infinite",
              }} />
            ))}
          </div>

        ) : !existingAddress ? (
          <div style={{
            background: "white", borderRadius: 20,
            border: "1.5px solid #FDDCDC",
            padding: "48px 24px", textAlign: "center",
            boxShadow: "0 4px 20px rgba(44,24,16,0.06)",
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: "50%", background: "#FFF0F0",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#E74C3C", margin: "0 auto 16px",
            }}>
              <AlertTriangle size={28} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 8px" }}>
              Alamat tidak ditemukan
            </h3>
            <p style={{ fontSize: 14, color: "var(--text-muted)", margin: "0 0 24px" }}>
              Alamat yang ingin Anda edit tidak tersedia.
            </p>
            <button onClick={handleBack} style={{
              padding: "10px 24px", borderRadius: 50,
              background: "var(--terracotta, #F7620A)",
              color: "white", border: "none",
              fontWeight: 600, fontSize: 14, cursor: "pointer",
              display: "inline-flex", alignItems: "center", gap: 8,
            }}>
              <ArrowLeft size={15} /> Kembali
            </button>
          </div>

        ) : (
          <div style={{
            background: "white", borderRadius: 20,
            border: "1.5px solid var(--cream-dark, #F0D5C2)",
            boxShadow: "0 4px 20px rgba(44,24,16,0.08)",
            padding: "28px 24px",
          }}>
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
                <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0 }}>
                  Perbarui data penerima &amp; lokasi
                </p>
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                {/* 1. Label Alamat */}
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

                {/* 2+3. Nama Penerima + Nomor Telepon */}
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

                {/* 4. Alamat Lengkap */}
                <FormField control={form.control} name="address" render={({ field }) => (
                  <FormItem>
                    <FormLabel style={labelStyle}>Alamat Lengkap</FormLabel>
                    <FormControl>
                      <div style={{ position: "relative" }}>
                        <Home size={15} style={textareaIconStyle} />
                        <Textarea
                          placeholder="Nama jalan, nomor rumah, RT/RW"
                          style={{ ...textareaStyle, minHeight: 80 }}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <SectionDivider label="Wilayah" />

                {/* 5–9. Wilayah + Kode Pos */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <LocationSelect
                    form={form} name="province_id" label="Provinsi"
                    items={provinceItems} isLoading={isLoadingProvinces}
                    placeholder="Pilih Provinsi" onValueChange={handleProvinceChange}
                  />
                  <LocationSelect
                    form={form} name="regency_id" label="Kabupaten/Kota"
                    items={regencyItems} isLoading={isLoadingRegencies}
                    disabled={!watchedProvince}
                    placeholder="Pilih Kabupaten/Kota" onValueChange={handleRegencyChange}
                  />
                  <LocationSelect
                    form={form} name="district_id" label="Kapanewon"
                    items={districtItems} isLoading={isLoadingDistricts}
                    disabled={!watchedRegency}
                    placeholder="Pilih Kapanewon" onValueChange={handleDistrictChange}
                  />
                  <LocationSelect
                    form={form} name="village_id" label="Kelurahan / Kalurahan"
                    items={villageItems} isLoading={isLoadingVillages}
                    disabled={!watchedDistrict}
                    placeholder="Pilih Kelurahan" onValueChange={handleVillageChange}
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

                {/* 10. Latitude + Longitude via map picker */}
                <AddressLocationPicker
                  latitude={watchedLatitude}
                  longitude={watchedLongitude}
                  onLocationSelect={handleLocationSelect}
                  onLocationClear={handleLocationClear}
                  formAddressQuery={debouncedAddressQuery}
                  formFallbackQuery={debouncedFallbackQuery}
                />

                {/* 11. Catatan Tambahan */}
                <FormField control={form.control} name="note" render={({ field }) => (
                  <FormItem>
                    <FormLabel style={labelStyle}>
                      Catatan Tambahan{" "}
                      <span style={{ fontWeight: 400, color: "var(--text-muted)" }}>(opsional)</span>
                    </FormLabel>
                    <FormControl>
                      <div style={{ position: "relative" }}>
                        <FileText size={15} style={textareaIconStyle} />
                        <Textarea
                          placeholder="Contoh: rumah warna hijau, hadap barat"
                          style={{ ...textareaStyle, minHeight: 64 }}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                {/* 12. Jadikan Alamat Utama */}
                <FormField control={form.control} name="is_primary" render={({ field }) => (
                  <FormItem>
                    <div
                      style={{
                        display: "flex", alignItems: "center", gap: 12,
                        padding: "12px 16px", borderRadius: 10,
                        border: `1.5px solid ${field.value ? "var(--terracotta, #F7620A)" : "var(--cream-dark, #F0D5C2)"}`,
                        background: field.value ? "rgba(247,98,10,0.04)" : "white",
                        cursor: "pointer", transition: "all 0.2s",
                      }}
                      onClick={() => field.onChange(!field.value)}
                    >
                      <FormControl>
                        <div style={{ pointerEvents: "none" }}>
                          <Checkbox checked={field.value} />
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

                {/* Action buttons */}
                <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={isPending}
                    style={{
                      flex: 1, height: 46, borderRadius: 10,
                      border: "1.5px solid var(--cream-dark, #F0D5C2)",
                      background: "white",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      fontSize: 14, fontWeight: 600,
                      color: "var(--text-secondary, #4A3728)",
                      cursor: isPending ? "not-allowed" : "pointer",
                      opacity: isPending ? 0.6 : 1,
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
                    {isPending
                      ? <><Loader2 size={15} className="animate-spin" /> Menyimpan...</>
                      : <><Save size={15} /> Simpan Perubahan</>
                    }
                  </button>
                </div>
              </form>
            </Form>
          </div>
        )}
      </main>
    </div>
  );
}

// ── Shared sub-components ────────────────────────────────────────────────────

function SubHeader({ title, backHref }: { title: string; backHref: string }) {
  return (
    <div style={{
      background: "white",
      borderBottom: "1px solid var(--cream-dark, #F0D5C2)",
      padding: "0 20px", height: 56,
      display: "flex", alignItems: "center", gap: 12,
      position: "sticky", top: 0, zIndex: 40,
    }}>
      <Link href={backHref} style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        width: 36, height: 36, borderRadius: 10,
        background: "var(--cream, #FFF9F4)",
        color: "var(--text-primary, #1A1008)",
        textDecoration: "none",
        border: "1.5px solid var(--cream-dark, #F0D5C2)",
      }}>
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
      <span style={{
        fontSize: 11, fontWeight: 700, color: "var(--text-muted)",
        textTransform: "uppercase", letterSpacing: "0.5px",
      }}>
        {label}
      </span>
      <div style={{ flex: 1, height: 1, background: "var(--cream-dark, #F0D5C2)" }} />
    </div>
  );
}

interface LocationSelectProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any;
  name: string;
  label: string;
  items: Array<{ id: number | string; name: string }>;
  isLoading: boolean;
  disabled?: boolean;
  placeholder: string;
  onValueChange: (v: string) => void;
}

function LocationSelect({
  form,
  name,
  label,
  items,
  isLoading,
  disabled,
  placeholder,
  onValueChange,
}: LocationSelectProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }: { field: { value: string } }) => (
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
                  height: 44,
                  borderRadius: 10,
                  border: "1.5px solid var(--cream-dark, #F0D5C2)",
                  fontSize: 14,
                }}
              >
                <SelectValue
                  placeholder={
                    isLoading ? (
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          color: "var(--text-muted)",
                        }}
                      >
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
              {items.map((item) => (
                <SelectItem key={item.id} value={String(item.id)}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

