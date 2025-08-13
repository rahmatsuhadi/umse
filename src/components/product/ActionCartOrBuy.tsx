"use client"

import { useState } from "react";
import { Button } from "../ui/button";
import Link from "next/link";

interface PropsActionCartOrBuy {
    stock: number;
}

export default function ActionCartOrBuy({ stock }: PropsActionCartOrBuy) {
    const [quantity, setQuantity] = useState(1);

    const handleQuantityChange = (amount: number) => {
        const newQuantity = quantity + amount;
        if (newQuantity >= 1 && newQuantity <= stock) {
            setQuantity(newQuantity);
        }
    };
    return (
        <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center mb-4 gap-3">
                <span className="text-gray-700 font-medium">Jumlah:</span>
                <div className="flex items-center border border-gray-300 rounded-lg w-fit">
                    <Button variant={"outline"} type="button" className="px-3 py-2 text-gray-600 hover:bg-gray-100" onClick={() => handleQuantityChange(-1)}><i className="fas fa-minus"></i></Button>
                    <input type="number" value={quantity} readOnly className="w-16 text-center border-none focus:outline-none bg-transparent" />
                    <Button variant={"outline"} type="button" className="px-3 py-2 text-gray-600 hover:bg-gray-100" onClick={() => handleQuantityChange(1)}><i className="fas fa-plus"></i></Button>
                </div>
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row gap-3">
                    <Link href={"/keranjang"} className="flex-1">
                        <button className="w-full bg-primary-dark text-white py-3 px-4 sm:px-6 rounded-lg font-medium hover:bg-primary-dark/80 transition"><i className="fas fa-bolt mr-2"></i>Beli Sekarang</button>
                    </Link>
                    <Link href={"/keranjang"} className="flex-1">
                    <button className="flex-1 bg-primary text-white py-3 px-4 sm:px-6 rounded-lg font-medium hover:bg-primary-dark transition"><i className="fas fa-shopping-cart mr-2"></i>Tambah ke Keranjang</button>
                    </Link>

                </div>
                {/* <button className="border border-gray-300 text-gray-600 py-3 px-4 rounded-lg hover:bg-gray-50 self-center sm:self-auto sm:w-fit"><i className="fas fa-heart mr-2"></i><span className="sm:hidden">Favorit</span><span className="hidden sm:inline">Tambah ke Wishlist</span></button> */}
            </div>
        </div>
    )
}