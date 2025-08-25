import { useQuery } from "@tanstack/react-query";
import { getProvinces, getRegencies, getDistricts, getVillages } from "./api";

// Hook untuk mengambil semua provinsi
export const useProvinces = () => {
  return useQuery({
    queryKey: ["provinces"],
    queryFn: getProvinces,
  });
};

// Hook untuk mengambil kabupaten/kota. Hanya aktif jika `provinceId` ada.
export const useRegencies = (provinceId: string) => {
  return useQuery({
    queryKey: ["regencies", provinceId],
    queryFn: () => getRegencies(provinceId),
    enabled: !!provinceId, // Ini kuncinya: query hanya berjalan jika provinceId tidak kosong
  });
};

// Hook untuk mengambil kecamatan. Hanya aktif jika `regencyId` ada.
export const useDistricts = (regencyId: string) => {
  return useQuery({
    queryKey: ["districts", regencyId],
    queryFn: () => getDistricts(regencyId),
    enabled: !!regencyId,
  });
};

// Hook untuk mengambil desa/kelurahan. Hanya aktif jika `districtId` ada.
export const useVillages = (districtId: string) => {
  return useQuery({
    queryKey: ["villages", districtId],
    queryFn: () => getVillages(districtId),
    enabled: !!districtId,
  });
};