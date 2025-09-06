
export interface User {
  id: string;
  name: string;
  email: string;
  phone_number: string;
  role: 'customer' | 'seller' | 'admin'; // Peran pengguna di sistem
  profile_url?: string; // Tanda tanya (?) berarti properti ini opsional
  created_at: string;
  updated_at: string;  
}

// Tipe untuk data yang dikirim saat melakukan login
export interface LoginCredentials {
  phone_number: string; // atau email, sesuaikan dengan backend
  password: string;
}

// Tipe untuk data yang dikirim saat pendaftaran customer baru
export interface RegisterData {
  name: string;
  phone_number: string;
  email: string;
  password: string;
}
