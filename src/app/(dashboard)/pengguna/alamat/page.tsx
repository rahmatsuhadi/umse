"use client"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


interface Address {
    id: string;
    recipientName: string;
    phone: string;
    fullAddress: string;
    district: string;
    city: string;
    postalCode: string;
    isDefault?: boolean;
    label?: string;
}

const dummyAddresses = [
    {
        id: "1",
        recipientName: "Andi Saputra",
        phone: "081234567890",
        fullAddress: "Jl. Kaliurang KM 7, No. 15, RT 02 / RW 03",
        city: "Kabupaten Sleman",
        district: "Depok",
        postalCode: "55281",
        isDefault: true,
        label: "Rumah",
    },
    {
        id: "2",
        recipientName: "Dewi Kartika",
        phone: "082112345678",
        fullAddress: "Jl. Magelang KM 5, No. 20, RT 01 / RW 04",
        city: "Kota Yogyakarta",
        district: "Jetis",
        postalCode: "55231",
        isDefault: false,
        label: "Kantor",
    },
    {
        id: "3",
        recipientName: "Budi Santoso",
        phone: "085612345678",
        fullAddress: "Jl. Imogiri Barat, No. 10, RT 04 / RW 02",
        city: "Kabupaten Bantul",
        district: "Sewon",
        postalCode: "55712",
        isDefault: false,
        label: "Gudang",
    },
];


export default function AddressPage() {
    const router = useRouter();
    const [addresses, setAddresses] = useState<Address[]>([]);

    useEffect(() => {
        const storedAddresses = localStorage.getItem('userAddresses');
        if (storedAddresses) {
            setAddresses(JSON.parse(storedAddresses));
        }
    }, []);

    const saveAddresses = (newAddresses: Address[]) => {
        localStorage.setItem('userAddresses', JSON.stringify(newAddresses));
        setAddresses(newAddresses);
    };

    const deleteAddress = (id: string) => {
        if (confirm('Apakah Anda yakin ingin menghapus alamat ini?')) {
            const newAddresses = addresses.filter((addr) => addr.id !== id);
            saveAddresses(newAddresses);
        }
    };

    const setDefaultAddress = (id: string) => {
        const newAddresses = addresses.map((addr) => ({
            ...addr,
            isDefault: addr.id === id,
        }));
        saveAddresses(newAddresses);
    };

    const editAddress = (id: string) => {
        router.push(`/pengguna/alamat/form?edit=${id}`);
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                             <Link href={"/pengguna"} className="text-gray-600 hover:text-primary transition-colors hover:cursor-pointer">
                                <i className="fas fa-arrow-left text-xl"></i>
                            </Link>
                            {/* <button
                                onClick={() => router.push('/pengguna')}
                                className="text-gray-600 hover:text-primary transition-colors"
                            >
                                <i className="fas fa-arrow-left text-xl"></i>
                            </button> */}
                            <h1 className="text-xl font-bold text-gray-800">Alamat Saya</h1>
                        </div>

                        <button
                            onClick={() => router.push('/pengguna/alamat/')}
                            className="bg-primary text-white px-4 py-2 hover:cursor-pointer rounded-lg hover:bg-primary-dark transition-colors"
                        >
                            <i className="fas fa-plus mr-2"></i>Tambah
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-6 min-h-[80vh]">
                <div className="bg-white rounded-lg shadow-md">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800">
                            <i className="fas fa-map-marker-alt mr-2 text-primary"></i>Daftar Alamat
                        </h2>
                        <p className="text-gray-600 text-sm mt-1">
                            Kelola alamat pengiriman Anda
                        </p>
                    </div>

                    {/* Address List */}
                    <div id="addressesList" className="divide-y divide-gray-200">
                        {addresses.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                <i className="fas fa-map-marker-alt text-4xl mb-4 text-gray-300"></i>
                                <h3 className="text-lg font-medium mb-2">Belum ada alamat</h3>
                                <p className="text-sm mb-4">Tambah alamat untuk memudahkan pengiriman</p>
                                <Link className="bg-primary hover:cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors" href={"/pengguna/alamat/form"}>
                                    <i className="fas fa-plus mr-2"></i>Tambah Alamat Pertama
                                </Link>
                            </div>
                        ) : (
                            addresses.map((address) => (
                                <div key={address.id} className="p-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <span className="text-sm font-medium text-gray-800">
                                                    {address.recipientName}
                                                </span>
                                                {address.isDefault && (
                                                    <span className="bg-primary text-white px-2 py-1 rounded-full text-xs">
                                                        Utama
                                                    </span>
                                                )}
                                                {address.label && (
                                                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                                                        {address.label}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-gray-600 text-sm mb-1">
                                                <i className="fas fa-phone mr-2"></i>
                                                {address.phone}
                                            </p>
                                            <p className="text-gray-700 text-sm leading-relaxed mb-1">
                                                <i className="fas fa-map-marker-alt mr-2"></i>
                                                {address.fullAddress}
                                            </p>
                                            <p className="text-gray-500 text-sm">
                                                <i className="fas fa-envelope mr-2"></i>
                                                {address.district}, {address.city} {address.postalCode}
                                            </p>
                                        </div>
                                        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 ml-4">
                                            <button
                                                onClick={() => editAddress(address.id)}
                                                className="text-primary hover:cursor-pointer hover:text-primary-dark p-2 hover:bg-primary-light hover:bg-opacity-20 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button
                                                onClick={() => deleteAddress(address.id)}
                                                className="text-red-500 hover:cursor-pointer hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Hapus"
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                            {!address.isDefault && (
                                                <button
                                                    onClick={() => setDefaultAddress(address.id)}
                                                    className="text-yellow-500 hover:cursor-pointer hover:text-yellow-700 p-2 hover:bg-yellow-50 rounded-lg transition-colors"
                                                    title="Jadikan Utama"
                                                >
                                                    <i className="fas fa-star"></i>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-8 mt-16 sticky bottom-0">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <h3 className="text-xl font-bold mb-2">Sleman Mart</h3>
                        <p className="text-gray-400">Platform UMKM Digital Kabupaten Sleman</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}