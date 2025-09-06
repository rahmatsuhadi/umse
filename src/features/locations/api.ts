import { apiClient } from "@/lib/api-client";
import type { Province, Regency, District, Village } from "@/types";

/** Mengambil semua provinsi */
export const getProvinces = (): Promise<{data:Province[]}> => {
  return apiClient<{data:Province[]}>('/provinces');
};

/** Mengambil kabupaten/kota berdasarkan ID provinsi */
export const getRegencies = (provinceId: string): Promise<{data:Regency[]}> => {
  return apiClient<{data:Regency[]}>(`/regencies?province_id=${provinceId}`);
};

/** Mengambil kecamatan berdasarkan ID kabupaten/kota */
export const getDistricts = (regencyId: string): Promise<{data:District[]}> => {
  return apiClient<{data:District[]}>(`/districts?regency_id=${regencyId}`);
};

/** Mengambil desa/kelurahan berdasarkan ID kecamatan */
export const getVillages = (districtId: string): Promise<{data:Village[]}> => {
  return apiClient<{data:Village[]}>(`/villages?district_id=${districtId}`);
};