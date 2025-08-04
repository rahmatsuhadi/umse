'use client';

import PhoneNumberCheckStep from '@/components/auth/umkm-registration/PhoneNumberCheckStep';
import RegistrationFormStep from '@/components/auth/umkm-registration/RegistrationFormStep';
import { useState } from 'react';

export default function DaftarUmkmPage() {
  const [step, setStep] = useState(1);
  const [validatedPhone, setValidatedPhone] = useState("");

  // Fungsi ini dipanggil dari PhoneNumberCheckStep saat sukses
  const handlePhoneCheckSuccess = (phone: string) => {
    setValidatedPhone(phone); // Simpan nomor HP yang valid
    setStep(2); // Pindah ke langkah berikutnya
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] py-12 px-4">
      {/* Tampilkan komponen berdasarkan state 'step' */}
      {step === 1 && <PhoneNumberCheckStep onSuccess={handlePhoneCheckSuccess} />}
      {step === 2 && <RegistrationFormStep phone={validatedPhone} />}
    </div>
  );
}