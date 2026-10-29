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
import { useCallback, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import z from "zod";
import { normalizePhoneNumber } from "@/components/checkouts/CheckoutForm";
import {
  AddressLocationPicker,
  type DetectedAddressDetails,
} from "@/components/maps/AddressLocationPicker";
import {
  getDistricts,
  getProvinces,
  getRegencies,
  getVillages,
} from "@/features/locations/api";
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

// ── Helpers ──────────────────────────────────────────────────────────────────
// Normalisasi nama wilayah (menghapus prefiks administratif umum untuk pencocokan akurat)
const normalizeGeoName = (str?: string): string => {
  if (!str) return "";
  return str
    .toLowerCase()
    .replace(
      /\b(kapanewon|kemantren|kecamatan|kec\.|kelurahan|kalurahan|kel\.|desa|kabupaten|kab\.|kota|daerah istimewa|d\.i\.|di|provinsi|prov\.)\b/gi,
      ""
    )
    .replace(/[^a-z0-9]/gi, "")
    .trim();
};

const isGeoMatch = (nameA?: string, nameB?: string): boolean => {
  const a = normalizeGeoName(nameA);
  const b = normalizeGeoName(nameB);
  if (!a || !b) return false;
  return a === b || a.includes(b) || b.includes(a);
};

// Membersihkan nama alamat OSM dari embel-embel kode pos dan ", Indonesia" di bagian akhir
function cleanOsmAddress(displayName?: string): string {
  if (!displayName) return "";
  return displayName
    .replace(/,\s*\d{5},?\s*Indonesia$/i, "")
    .replace(/,\s*Indonesia$/i, "")
    .trim();
}

// Memformat alamat dari pecahan detail reverse geocoding
function formatAddressFromDetails(details?: DetectedAddressDetails): string {
  if (!details) return "";
  const parts: string[] = [];
  if (details.road) parts.push(details.road);
  if (details.village && !parts.includes(details.village)) parts.push(details.village);
  const dist = details.cityDistrict || details.district;
  if (dist && !parts.includes(dist)) parts.push(dist);
  const reg = details.county || details.city;
  if (reg && !parts.includes(reg)) parts.push(reg);
  if (details.state && !parts.includes(details.state)) parts.push(details.state);
  return parts.join(", ");
}

// Memeriksa apakah suatu segmen teks adalah nama wilayah administratif murni
function isRegionSegment(segment: string, knownRegionNames: string[]): boolean {
  const trimmed = segment.trim();
  if (!trimmed) return false;

  if (
    /^(jl|jalan|gang|gg|blok|no|nomor|rt|rw|dusun|kp|kampung|perum|perumahan|komplek)\b/i.test(
      trimmed
    ) ||
    /\b(no\.?\s*\d+|rt\.?\s*\d+|rw\.?\s*\d+|km\.?\s*\d+)\b/i.test(trimmed)
  ) {
    return false;
  }

  const normalized = normalizeGeoName(trimmed);
  if (!normalized) return false;

  return knownRegionNames.some((r) => {
    const normR = normalizeGeoName(r);
    return (
      normR &&
      (normR === normalized ||
        normR.includes(normalized) ||
        normalized.includes(normR))
    );
  });
}

// Mengambil bagian spesifik (jalan, nomor, RT/RW) dari alamat sebelum nama-nama wilayah
function extractStreetPrefix(
  address: string,
  knownRegionNames: string[]
): string {
  if (!address || !address.trim()) return "";

  const segments = address.split(",").map((s) => s.trim()).filter(Boolean);
  if (segments.length === 0) return "";

  const streetSegments: string[] = [];
  for (const seg of segments) {
    if (isRegionSegment(seg, knownRegionNames)) {
      break;
    } else {
      streetSegments.push(seg);
    }
  }

  return streetSegments.join(", ");
}

// Menggabungkan street prefix dan nama wilayah baru
function composeAddress(
  streetPrefix: string,
  regions: {
    villageName?: string;
    districtName?: string;
    regencyName?: string;
    provinceName?: string;
  }
): string {
  const parts: string[] = [];
  if (streetPrefix) parts.push(streetPrefix);
  if (regions.villageName && !parts.includes(regions.villageName)) {
    parts.push(regions.villageName);
  }
  if (regions.districtName && !parts.includes(regions.districtName)) {
    parts.push(regions.districtName);
  }
  if (regions.regencyName && !parts.includes(regions.regencyName)) {
    parts.push(regions.regencyName);
  }
  if (regions.provinceName && !parts.includes(regions.provinceName)) {
    parts.push(regions.provinceName);
  }

  return parts.join(", ");
}

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

  const [syncedRegionItems, setSyncedRegionItems] = useState<{
    regency?: { id: number | string; name: string; province_id?: string | number };
    district?: { id: number | string; name: string; regency_id?: string | number };
    village?: { id: number | string; name: string; district_id?: string | number; postal_code?: string | number | null };
  }>({});

  const regencyItems = useMemo(() => {
    if (regencies.length > 0) return regencies;
    if (
      syncedRegionItems.regency &&
      String(watchedProvince) ===
        String(syncedRegionItems.regency.province_id || watchedProvince)
    ) {
      return [{ id: syncedRegionItems.regency.id, name: syncedRegionItems.regency.name }];
    }
    return [];
  }, [regencies, syncedRegionItems.regency, watchedProvince]);

  const districtItems = useMemo(() => {
    if (districts.length > 0) return districts;
    if (
      syncedRegionItems.district &&
      String(watchedRegency) ===
        String(syncedRegionItems.district.regency_id || watchedRegency)
    ) {
      return [{ id: syncedRegionItems.district.id, name: syncedRegionItems.district.name }];
    }
    return [];
  }, [districts, syncedRegionItems.district, watchedRegency]);

  const villageItems = useMemo(() => {
    if (villages.length > 0) return villages;
    if (
      syncedRegionItems.village &&
      String(watchedDistrict) ===
        String(syncedRegionItems.village.district_id || watchedDistrict)
    ) {
      return [{ id: syncedRegionItems.village.id, name: syncedRegionItems.village.name }];
    }
    return [];
  }, [villages, syncedRegionItems.village, watchedDistrict]);

  const selectedProvinceName = useMemo(() => {
    return provinces.find((p) => String(p.id) === String(watchedProvince))?.name || "";
  }, [provinces, watchedProvince]);

  const selectedRegencyName = useMemo(() => {
    return regencyItems.find((r) => String(r.id) === String(watchedRegency))?.name || "";
  }, [regencyItems, watchedRegency]);

  const selectedDistrictName = useMemo(() => {
    return districtItems.find((d) => String(d.id) === String(watchedDistrict))?.name || "";
  }, [districtItems, watchedDistrict]);

  const selectedVillageName = useMemo(() => {
    return villageItems.find((v) => String(v.id) === String(watchedVillage))?.name || "";
  }, [villageItems, watchedVillage]);

  const allKnownRegionNames = useMemo(() => {
    const names = new Set<string>();
    const add = (s?: string) => {
      if (s && s.trim()) names.add(s.trim());
    };
    add(selectedVillageName);
    add(selectedDistrictName);
    add(selectedRegencyName);
    add(selectedProvinceName);
    villageItems.forEach((v) => add(v.name));
    districtItems.forEach((d) => add(d.name));
    regencyItems.forEach((r) => add(r.name));
    provinces.forEach((p) => add(p.name));
    return Array.from(names);
  }, [
    selectedVillageName,
    selectedDistrictName,
    selectedRegencyName,
    selectedProvinceName,
    villageItems,
    districtItems,
    regencyItems,
    provinces,
  ]);

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

  // Sinkronisasi otomatis dari titik koordinat peta ke Wilayah Pengiriman (dropdown berjenjang)
  const syncRegionFromCoords = useCallback(
    async (lat: number, lng: number, details?: DetectedAddressDetails) => {
      try {
        let addrDetails = details;
        if (!addrDetails) {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
            { headers: { "Accept-Language": "id,en" } }
          );
          if (res.ok) {
            const data = await res.json();
            const addr = data?.address || {};
            addrDetails = {
              displayName: data?.display_name,
              road: addr.road,
              village:
                addr.village ||
                addr.quarter ||
                addr.suburb ||
                addr.hamlet ||
                addr.neighbourhood,
              cityDistrict:
                addr.city_district ||
                addr.district ||
                addr.town ||
                addr.municipality ||
                addr.suburb,
              district:
                addr.district ||
                addr.city_district ||
                addr.town ||
                addr.municipality ||
                addr.suburb,
              county: addr.county || addr.city || addr.regency,
              city: addr.city || addr.county || addr.regency,
              state: addr.state || addr.province,
              postcode: addr.postcode,
            };
          }
        }

        if (!addrDetails) return;

        const targetProvince = addrDetails.state || "";
        const targetRegency = addrDetails.county || addrDetails.city || "";
        const targetDistrict =
          addrDetails.cityDistrict || addrDetails.district || "";
        const targetVillage = addrDetails.village || "";
        const targetPostcode = addrDetails.postcode || "";

        // 1. Cocokkan Provinsi
        let provList = provinces;
        if (!provList || provList.length === 0) {
          const provRes = await getProvinces();
          provList = provRes?.data || [];
        }

        let matchedProv = provList.find((p) =>
          isGeoMatch(p.name, targetProvince)
        );
        if (
          !matchedProv &&
          (isGeoMatch(targetRegency, "sleman") ||
            isGeoMatch(targetProvince, "yogyakarta") ||
            isGeoMatch(targetRegency, "yogyakarta"))
        ) {
          matchedProv = provList.find((p) => isGeoMatch(p.name, "Yogyakarta"));
        }

        if (!matchedProv) return;

        const targetProvinceId = String(matchedProv.id);
        form.setValue("province_id", targetProvinceId, {
          shouldDirty: true,
          shouldValidate: true,
        });

        // 2. Cocokkan Kabupaten / Kota
        const regRes = await getRegencies(targetProvinceId);
        const regList = regRes?.data || [];
        let matchedReg = regList.find((r) => isGeoMatch(r.name, targetRegency));
        if (!matchedReg && regList.length === 1) {
          matchedReg = regList[0];
        }

        if (!matchedReg) return;

        const targetRegencyId = String(matchedReg.id);
        form.setValue("regency_id", targetRegencyId, {
          shouldDirty: true,
          shouldValidate: true,
        });
        setSyncedRegionItems((prev) => ({
          ...prev,
          regency: matchedReg,
        }));

        // 3. Cocokkan Kapanewon / Kecamatan
        const distRes = await getDistricts(targetRegencyId);
        const distList = distRes?.data || [];
        let matchedDist = distList.find((d) => isGeoMatch(d.name, targetDistrict));

        if (!matchedDist && targetVillage) {
          matchedDist = distList.find((d) => isGeoMatch(d.name, targetVillage));
        }

        if (matchedDist) {
          const targetDistrictId = String(matchedDist.id);
          form.setValue("district_id", targetDistrictId, {
            shouldDirty: true,
            shouldValidate: true,
          });
          setSyncedRegionItems((prev) => ({
            ...prev,
            district: matchedDist,
          }));

          // 4. Cocokkan Kelurahan / Desa
          const vilRes = await getVillages(targetDistrictId);
          const vilList = vilRes?.data || [];
          let matchedVil = vilList.find((v) => isGeoMatch(v.name, targetVillage));
          if (!matchedVil && targetDistrict) {
            matchedVil = vilList.find((v) => isGeoMatch(v.name, targetDistrict));
          }

          if (matchedVil) {
            form.setValue("village_id", String(matchedVil.id), {
              shouldDirty: true,
              shouldValidate: true,
            });
            setSyncedRegionItems((prev) => ({
              ...prev,
              village: matchedVil,
            }));

            if (matchedVil.postal_code) {
              form.setValue("postal_code", String(matchedVil.postal_code), {
                shouldDirty: true,
                shouldValidate: true,
              });
            }
          }
        }

        // 5. Kode Pos dari geocode jika belum terisi
        if (targetPostcode && !form.getValues("postal_code")) {
          form.setValue("postal_code", targetPostcode, {
            shouldDirty: true,
            shouldValidate: true,
          });
        }
      } catch (err) {
        console.error("Gagal menyelaraskan wilayah otomatis:", err);
      }
    },
    [form, provinces]
  );

  // Saat ada perubahan Wilayah Pengiriman, tulis ulang kolom alamat lengkap sesuai alamat yang dipilih
  const handleProvinceChange = useCallback(
    (v: string) => {
      form.setValue("province_id", v, { shouldDirty: true, shouldValidate: true });
      form.setValue("regency_id", "", { shouldDirty: true });
      form.setValue("district_id", "", { shouldDirty: true });
      form.setValue("village_id", "", { shouldDirty: true });

      const newProvinceName =
        provinces.find((p) => String(p.id) === String(v))?.name || "";

      const currentAddr = form.getValues("address") || "";
      const streetPrefix = extractStreetPrefix(currentAddr, allKnownRegionNames);
      const rewritten = composeAddress(streetPrefix, {
        provinceName: newProvinceName,
      });

      if (rewritten) {
        form.setValue("address", rewritten, {
          shouldDirty: true,
          shouldValidate: true,
        });
      }
    },
    [form, provinces, allKnownRegionNames]
  );

  const handleRegencyChange = useCallback(
    (v: string) => {
      form.setValue("regency_id", v, { shouldDirty: true, shouldValidate: true });
      form.setValue("district_id", "", { shouldDirty: true });
      form.setValue("village_id", "", { shouldDirty: true });

      const newRegencyName =
        regencyItems.find((r) => String(r.id) === String(v))?.name || "";

      const currentAddr = form.getValues("address") || "";
      const streetPrefix = extractStreetPrefix(currentAddr, allKnownRegionNames);
      const rewritten = composeAddress(streetPrefix, {
        regencyName: newRegencyName,
        provinceName: selectedProvinceName,
      });

      if (rewritten) {
        form.setValue("address", rewritten, {
          shouldDirty: true,
          shouldValidate: true,
        });
      }
    },
    [form, regencyItems, allKnownRegionNames, selectedProvinceName]
  );

  const handleDistrictChange = useCallback(
    (v: string) => {
      form.setValue("district_id", v, { shouldDirty: true, shouldValidate: true });
      form.setValue("village_id", "", { shouldDirty: true });

      const newDistrictName =
        districtItems.find((d) => String(d.id) === String(v))?.name || "";

      const currentAddr = form.getValues("address") || "";
      const streetPrefix = extractStreetPrefix(currentAddr, allKnownRegionNames);
      const rewritten = composeAddress(streetPrefix, {
        districtName: newDistrictName,
        regencyName: selectedRegencyName,
        provinceName: selectedProvinceName,
      });

      if (rewritten) {
        form.setValue("address", rewritten, {
          shouldDirty: true,
          shouldValidate: true,
        });
      }
    },
    [
      form,
      districtItems,
      allKnownRegionNames,
      selectedRegencyName,
      selectedProvinceName,
    ]
  );

  const handleVillageChange = useCallback(
    (v: string) => {
      form.setValue("village_id", v, { shouldDirty: true, shouldValidate: true });

      const selectedVil = villageItems.find((item) => String(item.id) === String(v));
      const newVillageName = selectedVil?.name || "";

      if (selectedVil && "postal_code" in selectedVil && selectedVil.postal_code) {
        form.setValue("postal_code", String(selectedVil.postal_code), {
          shouldDirty: true,
          shouldValidate: true,
        });
      }

      const currentAddr = form.getValues("address") || "";
      const streetPrefix = extractStreetPrefix(currentAddr, allKnownRegionNames);
      const rewritten = composeAddress(streetPrefix, {
        villageName: newVillageName,
        districtName: selectedDistrictName,
        regencyName: selectedRegencyName,
        provinceName: selectedProvinceName,
      });

      if (rewritten) {
        form.setValue("address", rewritten, {
          shouldDirty: true,
          shouldValidate: true,
        });
      }
    },
    [
      form,
      villageItems,
      allKnownRegionNames,
      selectedDistrictName,
      selectedRegencyName,
      selectedProvinceName,
    ]
  );

  const handleLocationSelect = useCallback(
    async (lat: number, lng: number, detectedDetails?: DetectedAddressDetails) => {
      // Simpan koordinat baru
      const { latitude, longitude } = form.getValues();
      const same = (a?: number | null, b?: number) =>
        a != null && b != null && Math.abs(a - b) < 1e-7;

      if (!same(latitude, lat) || !same(longitude, lng)) {
        form.setValue("latitude", lat, { shouldValidate: true, shouldDirty: true });
        form.setValue("longitude", lng, { shouldValidate: true, shouldDirty: true });
      }

      // Tulis ulang kolom alamat lengkap sesuai dengan alamat pada titik koordinat
      let addrDetails = detectedDetails;
      if (!addrDetails) {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
            { headers: { "Accept-Language": "id,en" } }
          );
          if (res.ok) {
            const data = await res.json();
            const addr = data?.address || {};
            addrDetails = {
              displayName: data?.display_name,
              road: addr.road,
              village:
                addr.village ||
                addr.quarter ||
                addr.suburb ||
                addr.hamlet ||
                addr.neighbourhood,
              cityDistrict:
                addr.city_district ||
                addr.district ||
                addr.town ||
                addr.municipality ||
                addr.suburb,
              district:
                addr.district ||
                addr.city_district ||
                addr.town ||
                addr.municipality ||
                addr.suburb,
              county: addr.county || addr.city || addr.regency,
              city: addr.city || addr.county || addr.regency,
              state: addr.state || addr.province,
              postcode: addr.postcode,
            };
          }
        } catch (err) {
          console.warn("Reverse geocode on select error:", err);
        }
      }

      if (addrDetails) {
        const coordAddress =
          cleanOsmAddress(addrDetails.displayName) ||
          formatAddressFromDetails(addrDetails);

        if (coordAddress) {
          form.setValue("address", coordAddress, {
            shouldValidate: true,
            shouldDirty: true,
          });
        }

        await syncRegionFromCoords(lat, lng, addrDetails);
        toast.success("Alamat dan wilayah berhasil diselaraskan dengan titik lokasi!");
      }
    },
    [form, syncRegionFromCoords]
  );

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
                  items={regencyItems} isLoading={isLoadingRegencies}
                  disabled={!watchedProvince}
                  placeholder="Pilih Kabupaten/Kota"
                  onValueChange={handleRegencyChange}
                />

                <LocationSelect
                  form={form} name="district_id" label="Kapanewon"
                  items={districtItems} isLoading={isLoadingDistricts}
                  disabled={!watchedRegency}
                  placeholder="Pilih Kapanewon"
                  onValueChange={handleDistrictChange}
                />

                <LocationSelect
                  form={form} name="village_id" label="Kelurahan / Kalurahan"
                  items={villageItems} isLoading={isLoadingVillages}
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
