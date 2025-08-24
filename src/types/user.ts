
export interface User {
  id: string;
  name: string;
  email: string;
  phone_number: string;
  role: 'customer' | 'seller' | 'admin'; // Peran pengguna di sistem
  avatarUrl?: string; // Tanda tanya (?) berarti properti ini opsional
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
