"use client"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useAddresses, useDeleteAddress, useSetDefaultAddress } from "@/features/address/hooks";
import { Address } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {  useState } from "react";




export default function AddressPage() {
    const router = useRouter();
    const { mutate: deleteAddress } = useDeleteAddress();
    const [addressToDelete, setAddressToDelete] = useState<Address | null>(null);

    // Panggil hook untuk mengambil data alamat spesifik
    const { data, isLoading} = useAddresses();

    const addresses = data?.data || []

    const { mutate: handleSetDefaultAddress } = useSetDefaultAddress()

    const confirmDelete = () => {
        if (addressToDelete) {
            deleteAddress(addressToDelete.id, {
                onSuccess: () => setAddressToDelete(null), // Tutup modal setelah sukses
            });
        }
    };

    const setDefaultAddress = (id: string) => {
        handleSetDefaultAddress(id)
        // saveAddresses(newAddresses);
    };

    const editAddress = (id: string) => {
        router.push(`/pengguna/alamat/${id}`);
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

                        <Link href={"/pengguna/alamat/tambah"}
                            className="bg-primary text-white px-4 py-2 hover:cursor-pointer rounded-lg hover:bg-primary-dark transition-colors"
                        >
                            <i className="fas fa-plus mr-2"></i>Tambah

                        </Link>

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
                        {isLoading ? (
                            Array(1).fill(null).map((_, index) => (
                                <CardSkeletonAddress key={index} />
                            ))
                        ) : addresses.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                <i className="fas fa-map-marker-alt text-4xl mb-4 text-gray-300"></i>
                                <h3 className="text-lg font-medium mb-2">Belum ada alamat</h3>
                                <p className="text-sm mb-4">Tambah alamat untuk memudahkan pengiriman</p>
                                <Link className="bg-primary hover:cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors" href={"/pengguna/alamat/tambah"}>
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
                                                    {address.recipient_name}
                                                </span>
                                                {address.is_primary && (
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
                                                {address.recipient_phone_number}
                                            </p>
                                            <p className="text-gray-700 text-sm leading-relaxed mb-1">
                                                <i className="fas fa-map-marker-alt mr-2"></i>
                                                {address.address}
                                            </p>
                                            <p className="text-gray-500 text-sm">
                                                <i className="fas fa-envelope mr-2"></i>
                                                {address.district.name}, {address.regency.name} {address.postal_code}
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
                                                onClick={() => setAddressToDelete(address)}
                                                className="text-red-500 hover:cursor-pointer hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Hapus"
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                            {!address.is_primary && (
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

            <AlertDialog open={!!addressToDelete} onOpenChange={() => setAddressToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda Yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat diurungkan. Alamat untuk
                            <span className="font-bold"> {addressToDelete?.label}</span> akan dihapus secara permanen.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete}>Ya, Hapus Alamat</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

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


const CardSkeletonAddress = () => {
    return (
        <div className="p-4 animate-pulse">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                        <div className="w-32 h-4 bg-gray-300 rounded-full"></div>
                        <div className="w-20 h-4 bg-gray-300 rounded-full"></div>
                    </div>
                    <div className="w-24 h-3 bg-gray-300 rounded-full mb-1"></div>
                    <div className="w-48 h-4 bg-gray-300 rounded-full mb-1"></div>
                    <div className="w-32 h-3 bg-gray-300 rounded-full mb-1"></div>
                </div>
                <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 ml-4">
                    <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                    <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                    {/* <div className="w-10 h-10 bg-gray-300 rounded-full"></div> */}
                </div>
            </div>
        </div>
    )
}