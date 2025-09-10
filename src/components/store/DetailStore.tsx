"use client"

import { Store } from "@/types";
import Image from "next/image";
import { StarRating } from "../product/ReviewCard";
import { useCallback } from "react";

export function getWhatsAppLink(phone: string, message?: string): string {
    let cleaned = phone.replace(/[^0-9+]/g, "");

    if (cleaned.startsWith("08")) {
        cleaned = "62" + cleaned.substring(1);
    }

    if (cleaned.startsWith("+62")) {
        cleaned = cleaned.replace("+62", "62");
    }

    if (!cleaned.startsWith("62")) {
        throw new Error("Nomor tidak valid. Harus diawali 08, 62, atau +62");
    }

    const baseUrl = `https://wa.me/${cleaned}`;
    return message ? `${baseUrl}?text=${encodeURIComponent(message)}` : baseUrl;
}

export default function DetailStoreInfoCard({ store }: { store: Store }) {

    const handleWhatsAppClick = useCallback(() => {
        try {
            const message = `Halo, saya ingin bertanya tentang suatu hal di toko ${store.name}`;
            const link = getWhatsAppLink(store.user.phone_number, message);
            window.open(link, "_blank"); // buka WA di tab baru
        } catch (error) {
            console.log((error as Error).message)
        }
    }, [store]);

    return (
        <section className="py-8 bg-white">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* <!-- Store Image --> */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-200 rounded-lg overflow-hidden aspect-square">
                            <Image
                                width={900}
                                height={900}
                                src={store.logo_url}
                                alt={store.name + " Logo"}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* <!-- Store Info --> */}
                    <div className="lg:col-span-2">
                        <div className="flex flex-col h-full">
                            {/* <!-- Store Basic Info --> */}
                            <div className="flex-1">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                                            {store.name}
                                        </h1>
                                        {/* <!-- <div className="flex items-center space-x-4 mb-3">
                                            <div className="flex items-center text-yellow-400">
                                                <i className="fas fa-star"></i>
                                                <i className="fas fa-star"></i>
                                                <i className="fas fa-star"></i>
                                                <i className="fas fa-star"></i>
                                                <i className="fas fa-star-half-alt"></i>
                                                <span className="text-gray-600 ml-2 font-medium">4.5</span>
                                                <span className="text-gray-500 ml-1">(128 ulasan)</span>
                                            </div>
                                        </div> --> */}
                                        <div className="flex items-center space-x-1 mb-3">
                                            <span
                                                className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full font-medium"
                                            >
                                                <i className="fas fa-check-circle mr-1"></i>Toko Resmi
                                            </span>
                                            <span
                                                className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-medium"
                                            >
                                                <i className="fas fa-shield-alt mr-1"></i>Terverifikasi
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* <!-- Store Description --> */}
                                <p className="text-gray-700 leading-relaxed mb-6">
                                    {store.description}
                                </p>

                                {/* <!-- Store Stats --> */}
                                <div className="grid grid-cols-3 gap-6 mb-6">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-primary">{store.products_count || 0}</div>
                                        <div className="text-sm text-gray-600">Produk</div>
                                    </div>
                                    <div className="text-center flex items-center flex-col">
                                        <StarRating rating={store.average_rating} />
                                        <div className="text-2xl font-bold text-primary">{store.average_rating}</div>
                                        <div className="text-sm text-gray-600">Rating Toko</div>
                                    </div>
                                </div>

                                {/* <!-- Contact Info --> */}
                                <div className="space-y-3">
                                    <div className="flex items-center text-gray-700">
                                        <i className="fas fa-map-marker-alt text-primary w-5"></i>
                                        <span className="ml-3"
                                        >{store.address}</span>
                                    </div>

                                    <div className="flex items-center text-gray-700">
                                        <i className="fas fa-user text-primary w-5"></i>
                                        <span className="ml-3">{store.owner.name}</span>
                                    </div>

                                    <div className="flex items-center text-gray-700">
                                        <i className="fas fa-map-marker text-primary w-5"></i>
                                        <span className="ml-3">{store.village.name}, {store.district.name}</span>
                                    </div>
                                    {/* <div className="flex items-center text-gray-700">
                                        <i className="fas fa-phone text-primary w-5"></i>
                                        <span className="ml-3">+62 274 123-4567</span>
                                    </div> */}
                                    {/* <div className="flex items-center text-gray-700">
                                        <i className="fas fa-clock text-primary w-5"></i>
                                        <span className="ml-3">Buka: Senin - Sabtu, 08:00 - 17:00</span>
                                    </div>  */}
                                </div>
                            </div>

                            {/* <!-- Action Buttons --> */}
                            <div className="flex space-x-4 mt-6">
                                <button
                                    onClick={handleWhatsAppClick}
                                    className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition duration-300"
                                >
                                    <i className="fab fa-whatsapp mr-2"></i>Chat WhatsApp
                                </button>
                                {/* <!-- <button
                                    className="flex-1 border border-primary text-primary py-3 px-6 rounded-lg hover:bg-primary hover:text-white transition duration-300"
                                >
                                    <i className="fas fa-directions mr-2"></i>Lihat Lokasi
                                </button> --> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}