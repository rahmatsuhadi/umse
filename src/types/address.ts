export interface Address {
  id: string;
  recipient_name: string;
  recipient_phone_number: string;
  province:Location;
  province_id: number;
  regency: Location;
  regency_id: number;
  district: Location;
  district_id: number;
  village: Location;
  village_id: number;
  address: string;
  postal_code?: string;
  is_primary: boolean;
  note:string;
  label: string; // Contoh: "Rumah", "Kantor"
}

export interface Location{
  id:string
  name:string
}