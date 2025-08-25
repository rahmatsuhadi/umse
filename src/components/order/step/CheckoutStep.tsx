"use client"

import { CartItem } from "@/types"
import { useEffect, useState } from "react"



export default function CheckoutItem() {



    const [order, setOrder] = useState<CartItem[]>();

    useEffect(() => {
        const itemData = localStorage.getItem("checkout_items");


        if (itemData) {
            try {
                const parsed = JSON.parse(itemData);
                console.log(parsed)
                setOrder(parsed);
            } catch (e) {
                console.error("Gagal parsing checkout_items", e);
            }
        }
    }, []);


    if (!order) {
        return (
            <div className="text-center py-10 text-gray-600">
                Tidak ada item untuk checkout.
            </div>
        );
    }


    const subtotal = order.reduce(
        (acc, item) => acc + item.quantity * 10000,
        0
    );
    const shipping = 2000;
    const total = subtotal + shipping;


    return (
        <div id="orderSection" className="bg-white rounded-lg shadow-md mb-6">
            <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-800">Detail Pesanan</h3>
                <p className="text-sm text-gray-600">Lengkapi informasi pengiriman</p>
            </div>

            <div className="p-6">
                {/* Store Info */}
                <div className="bg-primary-light/20 border border-primary-dark rounded-lg p-4 mb-6">
                    <div className="flex items-center">
                        <i className="fas fa-store text-primary text-xl mr-3"></i>
                        <div>
                            {/* <h4 className="font-bold text-gray-800">{order[0].name || 'Toko Dummy'}</h4> */}
                            {/* <p className="text-sm text-gray-600">{order[0].address || 'Lokasi'}</p> */}
                        </div>
                    </div>
                </div>

                {/* Items */}
                <div className="mb-6">
                    <h4 className="font-bold text-gray-800 mb-4">Item Pesanan</h4>
                    <div className="space-y-4">
                        {order.map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center bg-gray-50 rounded-lg p-4"
                            >
                                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mr-4">
                                    <i className="fas fa-image text-gray-400"></i>
                                </div>
                                <div className="flex-1">
                                    <h5 className="font-medium text-gray-800">{item.product_id}</h5>
                                    <p className="text-sm text-gray-600">
                                        Varian: {item.variant_id ?? "-"}
                                    </p>
                                    <p className="text-sm text-primary font-bold mt-1">
                                        Rp {item.product ? item.product.price.value : 0} x {item.quantity}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-gray-800">
                                        Rp {(item.product ? item.product.price.value : 0 * item.quantity).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary */}
                    <div className="border-t border-gray-200 pt-4 mt-4">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="font-medium">
                                Rp {subtotal.toLocaleString()}
                            </span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-600">Ongkos Kirim</span>
                            <span className="font-medium">Rp {shipping.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-lg font-bold border-t border-gray-200 pt-2">
                            <span>Total</span>
                            <span className="text-primary">Rp {total.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Form alamat dan catatan tetap sama */}
                {/* Tombol Lanjut */}
                <button
                    onClick={() => console.log("Lanjut ke pembayaran")}
                    className="w-full bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-dark transition duration-300"
                >
                    <i className="fas fa-credit-card mr-2"></i>Lanjut ke Pembayaran
                </button>
            </div>
        </div>
    )
}