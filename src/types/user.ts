export interface User {
  id: string;
  name: string;
  email: string;
  phone_number: string;
  role: "customer" | "seller" | "admin"; // Peran pengguna di sistem
  profile_url?: string; // Tanda tanya (?) berarti properti ini opsional
  profile_path: string | null;
  created_at: string;
  organization_id?: string; // Opsional, hanya untuk seller
  updated_at: string;
}

// Tipe untuk data yang dikirim saat melakukan login
export interface LoginCredentials {
  phone_number: string; // atau email, sesuaikan dengan backend
  password: string;
  captchaToken: string;
}

// Tipe untuk data yang dikirim saat pendaftaran customer baru
export interface RegisterData {
  name: string;
  phone_number: string;
  email: string;
  password_confirmation: string;
  organization_id?: string; // Opsional, hanya untuk seller
  is_asn: boolean; // Apakah pengguna adalah ASN
  asn_proof_document?: File; // URL atau path ke dokumen bukti ASN, opsional
  password: string;
  captchaToken: string;
}
