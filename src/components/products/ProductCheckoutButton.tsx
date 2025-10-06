'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import type { Price, Product, Variant } from "@/types"; // Impor tipe dari file types Anda
import { useAddToCart } from "@/features/cart/hooks";
import { useUser } from "@/features/auth/hooks";
import { usePathname, useRouter } from "next/navigation";
import { FaSpinner } from "react-icons/fa";


interface CheckoutButtonProps {
    product: Product;
    isAuth?: boolean
}




export default function ProductCheckoutButton({ product }: { product: Product }) {

    const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
    const [quantity, setQuantity] = useState(1);

    const { data: user } = useUser();

    // Set varian default saat komponen pertama kali dimuat (jika ada varian)
    useEffect(() => {
        if (product.variants && product.variants.length > 0) {
            setSelectedVariant(product.variants[0]);
        }
    }, [product.variants]);

    // Tentukan harga, stok, dan gambar yang akan ditampilkan berdasarkan varian yang dipilih
    const currentPrice = selectedVariant ? selectedVariant.price : product.price;
    const currentStock = selectedVariant ? selectedVariant.stock_quantity : product.stock_quantity;

    const handleQuantityChange = (amount: number) => {
        const newQuantity = quantity + amount;
        if (newQuantity >= 1 && newQuantity <= currentStock) {
            setQuantity(newQuantity);
        }
    };

    const { handleAddToCart, handleQuickOrder, loading: isPending } = useCheckout({ isAuth: !!user, product })

    return (
        <div className="space-y-6">
            {/* Pilihan Varian */}
            {product.variants && product.variants.length > 0 && (
                <div>
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">Pilih Varian:</h3>
                    <div className="flex flex-wrap gap-2">
                        {product.variants.map((variant) => (
                            <Button
                                key={variant.id}
                                variant={selectedVariant?.id === variant.id ? 'default' : 'outline'}
                                onClick={() => {
                                    // if(selectedVariant && selectedVariant?.id == variant.id){
                                    //     setSelectedVariant(null)
                                    // }
                                    // else{
                                    setSelectedVariant(variant)
                                    // }
                                }}
                            >
                                {variant.name}
                            </Button>
                        ))}
                    </div>
                </div>
            )}

            <Separator />

            {/* Harga & Stok Dinamis */}
            <div>
                <p className="text-sm text-slate-500">Harga</p>
                <p className="text-3xl font-bold text-primary">
                    {currentPrice.formatted}
                </p>
                <p className="text-sm text-green-600 font-medium mt-1">Stok: {currentStock} tersedia</p>
            </div>

            {/* Aksi Pembelian */}
            <div>
                <div className="flex items-center gap-4 mb-4">
                    <span className="text-gray-700 font-medium">Jumlah:</span>
                    <div className="flex items-center border rounded-lg w-fit">
                        <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
                            <Minus className="h-4 w-4" />
                        </Button>
                        {/* <Input className="w-12 text-center font-bold" value={quantity} onChange={(v) => setQuantity(Number(v.target.value))} /> */}
                        <span className="w-12 text-center font-bold">{quantity}</span>
                        <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(1)} disabled={quantity >= currentStock}>
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-3"></div> */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Button size="lg" className="bg-primary hover:bg-primary/90" onClick={() => handleAddToCart({ quantity, selectedVariant: selectedVariant })} disabled={currentStock === 0 || isPending}>

                        {isPending ? (
                            <>
                                <FaSpinner className="animate-spin" />
                                Menambahakan ....
                            </>
                        ) : (
                            <>
                                <ShoppingCart className="h-5 w-5 mr-2" />
                                Tambah ke Keranjang
                            </>
                        )}

                    </Button>
                    <Button onClick={() => handleQuickOrder({ quantity, selectedVariant, price: currentPrice })} size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/5 hover:text-primary"
                        disabled={currentStock === 0 || isPending}>
                        Beli Langsung
                    </Button>
                </div>
            </div>
        </div>
    );
}


const useCheckout = ({ isAuth = false, product }: CheckoutButtonProps) => {
    const router = useRouter();
    const pathname = usePathname();

    const { mutate: addToCart, isPending } = useAddToCart()

    const [isLoading, setIsLoading] = useState<boolean>(false)


    const handleAddToCart = ({ quantity, selectedVariant }: { selectedVariant: Variant | null, quantity: number }) => {
        if (!isAuth) {
            // Buat URL login dengan parameter redirect
            const loginUrl = `/masuk?redirect=${pathname}`;
            router.push(loginUrl);
            return; // Hentikan eksekusi
        }

        const reqData: {
            product_id: string,
            quantity: number,
            variant_id?: string,
        } = {
            product_id: product.id,
            quantity: quantity,
        }

        if (selectedVariant) {
            reqData.variant_id = selectedVariant.id
        }

        addToCart(reqData)
    };

    const handleQuickOrder = async ({ quantity, selectedVariant, price: currentPrice }: { selectedVariant: Variant | null, quantity: number, price: Price }) => {
        if (!isAuth) {
            // Buat URL login dengan parameter redirect
            const loginUrl = `/masuk?redirect=${pathname}`;
            router.push(loginUrl);
            return; // Hentikan eksekusi
        }

        setIsLoading(true)

        const items = [{
            product: {
                id: product.id,
                name: product.name,
                thumbnail: product.thumbnail,
                price: product.price
            },
            variant: selectedVariant ? {
                id: selectedVariant.id,
                name: selectedVariant.name,
                thumbnail: selectedVariant.thumbnail,
                price: selectedVariant.price
            } : null,
            quantity: quantity,
        }
        ]

        const saveLocal = {
            store: {
                id: product.store.id,
                name: product.store.name,
                slug: product.store.slug,
                logo_url: product.store.logo_url,
                qris_url: product.store.qris_url,
                address: product.store.address,
                village_id: product.store.village_id,
                district_id: product.store.district_id,
                regency_id: product.store.regency_id,
                description: product.store.description
            },
            items
        }


        await localStorage.setItem("checkout_items", JSON.stringify(saveLocal));
        setIsLoading(false)
        router.push("/checkout?store=" + product.store.id);
    }



    return { loading: isLoading || isPending, handleAddToCart, handleQuickOrder }
}