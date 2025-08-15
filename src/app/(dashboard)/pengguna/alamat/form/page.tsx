"use client"

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";


interface Address {
    id: string;
    recipientName: string;
    phone: string;
    fullAddress: string;
    city: string;
    district: string;
    postalCode: string;
    isDefault?: boolean;
    label?: string;
}

const districtsData: Record<string, string[]> = {
    'Kabupaten Sleman': ['Depok', 'Gamping', 'Godean', 'Kalasan'],
    'Kota Yogyakarta': ['Gondokusuman', 'Jetis', 'Kotagede'],
    'Kabupaten Bantul': ['Bambanglipuro', 'Banguntapan', 'Sewon'],
    'Kabupaten Kulon Progo': ['Wates', 'Pengasih', 'Lendah'],
    'Kabupaten Gunung Kidul': ['Wonosari', 'Playen', 'Ponjong'],
};

interface FormAddressPageProps {
    searchParams: Promise<{ edit: string }>
}

export default function FormAddressPage(props: FormAddressPageProps) {
    const router = useRouter();

    const searchParams = useSearchParams()

    const edit = searchParams.get("edit")

    const [form, setForm] = useState<Address>({
        id: '',
        recipientName: '',
        phone: '',
        fullAddress: '',
        city: '',
        district: '',
        postalCode: '',
        isDefault: false,
        label: '',
    });

    const [districts, setDistricts] = useState<string[]>([]);

    // Load data if edit mode
    useEffect(() => {
        const addresses: Address[] = JSON.parse(localStorage.getItem('userAddresses') || '[]');
        if (edit) {
            const existing = addresses.find((addr) => addr.id === edit);
            if (existing) setForm(existing);
        }
    }, [edit]);

    // Update districts when city changes
    useEffect(() => {
        if (form.city && districtsData[form.city]) {
            setDistricts(districtsData[form.city]);
        } else {
            setDistricts([]);
        }
    }, [form.city]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type, ariaChecked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? ariaChecked : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        let addresses: Address[] = JSON.parse(localStorage.getItem('userAddresses') || '[]');

        if (form.isDefault) {
            addresses = addresses.map((addr) => ({ ...addr, isDefault: false }));
        }

        if (edit) {
            // Update existing
            addresses = addresses.map((addr) => (addr.id === edit ? { ...form, id: edit as string } : addr));
        } else {
            // Add new
            const newAddress = { ...form, id: Date.now().toString() };
            addresses.push(newAddress);
        }

        localStorage.setItem('userAddresses', JSON.stringify(addresses));
        router.push('/pengguna/alamat');
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => router.push('/pengguna/alamat')}
                                className="text-gray-600 hover:text-primary transition-colors"
                            >
                                <i className="fas fa-arrow-left text-xl"></i>
                            </button>
                            <h1 className="text-xl font-bold text-gray-800">
                                {edit ? 'Edit Alamat' : 'Tambah Alamat'}
                            </h1>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">
                        <i className="fas fa-map-marker-alt mr-2 text-primary"></i>
                        Informasi Alamat
                    </h2>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Recipient Name */}
                        <div>
                            <label htmlFor="recipientName" className="block text-sm font-medium text-gray-700 mb-2">
                                Nama Penerima *
                            </label>
                            <input
                                type="text"
                                id="recipientName"
                                name="recipientName"
                                value={form.recipientName}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary focus:border-primary"
                                placeholder="Masukkan nama penerima"
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                Nomor Telepon Penerima *
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary focus:border-primary"
                                placeholder="+62 812-3456-7890"
                            />
                        </div>

                        {/* Full Address */}
                        <div>
                            <label htmlFor="fullAddress" className="block text-sm font-medium text-gray-700 mb-2">
                                Alamat Lengkap *
                            </label>
                            <textarea
                                id="fullAddress"
                                name="fullAddress"
                                rows={3}
                                value={form.fullAddress}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary focus:border-primary"
                                placeholder="Masukkan alamat lengkap termasuk nama jalan, nomor rumah, RT/RW"
                            ></textarea>
                        </div>

                        {/* City */}
                        <div>
                            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                                Kabupaten/Kota *
                            </label>
                            <select
                                id="city"
                                name="city"
                                value={form.city}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary focus:border-primary"
                            >
                                <option value="">Pilih Kabupaten/Kota</option>
                                {Object.keys(districtsData).map((city) => (
                                    <option key={city} value={city}>
                                        {city}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* District */}
                        <div>
                            <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-2">
                                Kecamatan *
                            </label>
                            <select
                                id="district"
                                name="district"
                                value={form.district}
                                onChange={handleChange}
                                required
                                disabled={!form.city}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary focus:border-primary"
                            >
                                <option value="">Pilih Kecamatan</option>
                                {districts.map((d) => (
                                    <option key={d} value={d}>
                                        {d}
                                    </option>
                                ))}
                            </select>
                            <p className="text-xs text-gray-500 mt-1">Pilih Kabupaten/Kota terlebih dahulu</p>
                        </div>

                        {/* Postal Code */}
                        <div>
                            <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-2">
                                Kode Pos *
                            </label>
                            <input
                                type="text"
                                id="postalCode"
                                name="postalCode"
                                value={form.postalCode}
                                onChange={handleChange}
                                pattern="[0-9]{5}"
                                maxLength={5}
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary focus:border-primary"
                                placeholder="55xxx"
                            />
                            <p className="text-xs text-gray-500 mt-1">Masukkan 5 digit kode pos</p>
                        </div>

                        {/* Is Default */}
                        <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                            <input
                                type="checkbox"
                                id="isDefault"
                                name="isDefault"
                                checked={form.isDefault}
                                onChange={handleChange}
                                className="text-primary focus:ring-primary border-gray-300 rounded"
                            />
                            <label htmlFor="isDefault" className="ml-3 text-sm text-gray-700">
                                <i className="fas fa-star mr-2 text-yellow-500"></i>Jadikan alamat utama
                            </label>
                        </div>

                        {/* Buttons */}
                        <div className="flex space-x-3 pt-4">
                            {/* <Link href={"/pengguna/alamat"}> */}
                            <button
                                onClick={() => router.push("/pengguna/alamat")}
                                type="button"
                                className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                            >
                                <i className="fas fa-times mr-2"></i>Batal
                            </button>
                            {/* </Link> */}
                            <button
                                type="submit"
                                className="flex-1 bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-dark transition-colors"
                            >
                                <i className="fas fa-save mr-2"></i>Simpan
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    )
}