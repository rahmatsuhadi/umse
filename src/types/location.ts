export interface Province {
  id: number; // atau number, sesuaikan dengan API Anda
  name: string;
}

export interface Regency {
  id: number;
  province_id: string;
  name: string;
}

export interface District {
  id: number;
  regency_id: string;
  name: string;
}

export interface Village {
  id: number;
  district_id: string;
  name: string;
}
