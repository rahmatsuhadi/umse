"use client"

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useAddresses, useAddressPrimary } from "@/features/address/hooks";
import { useDistricts, useRegencies, useVillages } from "@/features/locations/hooks";
import { useShippingRates } from "@/features/shipping/hooks";
import { CartItem } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form";
import { withMask } from "use-mask-input";
import z from "zod";
import { animationVariants } from "../step/animate";
import { CheckoutStep } from "../step/steps";
import { useCreateOrder } from "@/features/order/hooks";

const province_id = 34
const service_name = "jne"

const service_type = "REG23";

// Skema validasi dengan Zod
const addressSchema = z.object({
    recipientName: z.string().min(1, "Nama penerima wajib diisi."),
    recipientPhone: z.string().min(10, "Nomor telepon tidak valid."),
    fullAddress: z.string().min(1, "Alamat lengkap wajib diisi."),
    regency_id: z.string().min(1, "Kabupaten/Kota wajib dipilih."),
    district_id: z.string().min(1, "Kecamatan wajib dipilih."),
    village_id: z.string().min(1, "Kelurahan wajib dipilih."),
    postalCode: z.string().min(5, "Kode pos tidak valid.").max(5, "Kode pos tidak valid."),
    note: z.string().optional(),
});

export default function CheckoutItem({ currentStep: step }: { currentStep: CheckoutStep }) {



    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    const [loading, setLoading] = useState<boolean>(true)


    const { data: addressData, isLoading: loadingAddress } = useAddressPrimary()
    const address = addressData?.data

    const addres = address

    const store = cartItems.length > 0 ? cartItems[0].store : null

    const form = useForm<z.infer<typeof addressSchema>>({
        resolver: zodResolver(addressSchema),
        defaultValues: {
            recipientName: "",
            recipientPhone: "",
            fullAddress: "",
            regency_id: "",
            district_id: "",
            village_id: "",
            postalCode: "",
        }
    });




    useEffect(() => {
        const itemData = localStorage.getItem("checkout_items");
        if (itemData) {
            try {
                const parsed = JSON.parse(itemData);
                setCartItems(parsed || []);
                setLoading(false);
            } catch (e) {
                console.error("Gagal parsing checkout_items", e);
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    }, []);


    const subtotal = cartItems.reduce(
        (acc, item) => acc + item.quantity * (item.variant ? item.variant.price.value : item.product.price.value),
        0
    );




    const watchedVillage = form.watch('village_id');



    const { data: shippingRate, isLoading: isLoadingShippingRates, error: errorShippingRates } = useShippingRates({
        origin_village_id: store?.village_id,
        items: cartItems.map((item => {
            return {
                cart_item_id: item.id,
                // product_id: item.product.id,
                quantity: item.quantity,
                // variant_id: item.variant?.id || '',
            }
        })),
        destination_village_id: watchedVillage ? Number(watchedVillage) : undefined,
    })


    const shipping = shippingRate?.data ? shippingRate.data.find(item => item.service === service_name) : null


    const total = subtotal + (Number(shipping?.cost.value ?? 0));

    useEffect(() => {
        if (addres) {
            form.setValue("recipientName", addres.recipient_name)
            form.setValue("recipientPhone", addres.recipient_phone_number)
            form.setValue("fullAddress", addres.address)
            form.setValue("regency_id", String(addres.regency_id))
            form.setValue("district_id", String(addres.district_id))
            form.setValue("village_id", String(addres.village_id))
            form.setValue("postalCode", String(addres.postal_code))
            if (addres.note) form.setValue("note", addres.note)
        }

    }, [addres])

    // Watch untuk field terkait
    const watchedRegency = form.watch('regency_id');
    const watchedDistrict = form.watch('district_id');

    // Mengambil data lokasi bertingkat
    const { data: regenciesData, isLoading: isLoadingRegencies } = useRegencies(String(province_id));
    const { data: districtsData, isLoading: isLoadingDistricts } = useDistricts(String(watchedRegency ?? ''));
    const { data: villagesData, isLoading: isLoadingVillages } = useVillages(String(watchedDistrict ?? ''));

    const regencies = regenciesData?.data || [];
    const districts = districtsData?.data || [];
    const villages = villagesData?.data || [];


    const { mutate, isPending } = useCreateOrder()
    const handleOrderSubmit = (data: z.infer<typeof addressSchema>) => {
        const orderData = {
            // ...data,
            items: cartItems.map((item) => ({
                cart_item_id: item.id,
                // product_id: item.product.id,
                quantity: item.quantity,
                // variant_id: item.variant?.id || '',
            })),
            shipping_service: service_name,
            shipping_service_type: service_type,
            store_id: store?.id || '',
            // total: total,
            address: {
                address_line: data.fullAddress,
                district_id: Number(data.district_id),
                province_id: province_id,
                regency_id: Number(data.regency_id),
                village_id: Number(data.village_id),
                recipient_name: data.recipientName,
                recipient_phone_number: data.recipientPhone,
                postal_code: Number(data.postalCode),
                note: data.note
            },
        };
        mutate(orderData)
        // router.replace("/pembayaran/" + 12345667889 )
    }


    const isLoading = loading || loadingAddress



    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={step}
                variants={animationVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
            >
                <div id="orderSection" className="bg-white rounded-lg shadow-md mb-6">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-bold text-gray-800">Detail Pesanan</h3>
                        <p className="text-sm text-gray-600">Lengkapi informasi pengiriman</p>
                    </div>


                    {isLoading ? (
                        <SkeletonPage />

                    ) : cartItems.length == 0 ? (
                        <div className="py-10 px-6 flex items-center justify-center">
                            <div className="max-w-md border p-6 rounded-lg shadow-sm text-center">
                                <h2 className="text-lg font-semibold mb-2">Tidak Ada Item Checkout</h2>
                                <p className="text-sm mb-4">
                                    Kami tidak menemukan data keranjang untuk dilanjutkan ke checkout.
                                    Silakan kembali ke halaman cart dan pilih terlebih dahulu.
                                </p>
                                <Link
                                    href="/keranjang"
                                    className="inline-block bg-primary hover:bg-primary/70 text-white text-sm font-semibold py-2 px-4 rounded transition"
                                >
                                    Kembali ke Keranjang
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleOrderSubmit)}>

                                <div className="p-6">
                                    {/* Store Info */}
                                    <div className="bg-primary-light/20 border border-primary-dark rounded-lg p-4 mb-6">
                                        <div className="flex items-center">
                                            {/* <i className="fas fa-store text-primary text-xl mr-3"></i> */}
                                            <Image className="shadow rounded-full mr-2" src={store?.logo_url || ''} width={50} height={50} alt={store?.name || 'brand-img'} />
                                            <div>
                                                <h4 className="font-bold text-gray-800">{store?.name || 'Toko Dummy'}</h4>
                                                <p className="text-sm text-gray-600">{store?.address || 'Lokasi'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Items */}
                                    <div className="mb-6">
                                        <h4 className="font-bold text-gray-800 mb-4">Item Pesanan</h4>
                                        <div className="space-y-4">
                                            {cartItems.map((item, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center bg-gray-50 rounded-lg p-4"
                                                >
                                                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mr-4">
                                                        <Image
                                                            className="w-full h-full object-cover rounded-lg"
                                                            src={item.variant ? item.variant.thumbnail.media_url : item.product.thumbnail.media_url}
                                                            width={100}  // Atur lebar sesuai keinginan
                                                            height={100} // Atur tinggi sesuai keinginan
                                                            alt={item.product.name}
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h5 className="font-medium text-gray-800">{item.variant?.name ?? item.product.name}</h5>
                                                        <p className="text-sm text-gray-600">
                                                            Varian: {item.variant ? item.variant.name : "-"}
                                                        </p>
                                                        <p className="text-sm text-primary font-bold mt-1">
                                                            {item.variant ? item.variant.price.formatted : item.product.price.formatted} x {item.quantity}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold text-gray-800">
                                                            Rp {((item.variant ? item.variant.price.value : item.product.price.value) * item.quantity).toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Summary */}
                                        <div className="border-t border-gray-200 pt-4 mt-4">

                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-gray-600">Ongkos Kirim</span>
                                                {isLoadingShippingRates ? (
                                                    <span>Mengkalkulasi ongkos kirim...</span>
                                                ) : (
                                                    <span className="font-medium">{shipping ? shipping.cost.formatted : "Rp.0 "} {shippingRate?.data ? `( ${shipping?.service_name})` : ''}</span>

                                                )}
                                            </div>
                                            <div className="flex justify-between items-center text-lg font-bold border-t border-gray-200 pt-2">
                                                <span>Total</span>
                                                <span className="text-primary">Rp {total.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* <div className="grid md:grid-cols-2 gap-4 mb-6"> */}

                                    <div className="grid gird-cols-1 md:grid-cols-2 gap-4 mb-6">
                                        <FormField
                                            disabled={isPending}
                                            control={form.control}
                                            name="recipientName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Nama Penerima *</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Nama lengkap penerima"
                                                            {...field} className="w-full border border-gray-300 rounded-lg px-3 py-5 focus:outline-none focus:border-primary" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            disabled={isPending}
                                            control={form.control}
                                            name="recipientPhone"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Nomor Telepon *</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            placeholder="08xx xxxx xxxx"
                                                            className="w-full border border-gray-300 rounded-lg px-3 py-5 focus:outline-none focus:border-primary"
                                                            ref={withMask('999 9999 9999 999999', {
                                                                placeholder: '',
                                                                showMaskOnHover: false
                                                            })}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            disabled={isPending}
                                            control={form.control}
                                            name="fullAddress"
                                            render={({ field }) => (
                                                <FormItem className="md:col-span-2">
                                                    <FormLabel>Alamat Lengkap *</FormLabel>
                                                    <FormControl className="">
                                                        <Textarea cols={10}
                                                            placeholder="Jalan, nomor rumah, RT/RW, kelurahan, kecamatan"
                                                            {...field} className="w-full  border border-gray-300 rounded-lg px-3 py-5 focus:outline-none focus:border-primary" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            disabled={isPending} control={form.control} name="regency_id" render={({ field }) => (
                                                <FormItem><FormLabel>Kabupaten/Kota *</FormLabel>
                                                    <Select
                                                        disabled={isLoadingRegencies || field.disabled}
                                                        defaultValue={String(addres?.regency_id || "")}
                                                        onValueChange={(v) => {
                                                            field.onChange(v)
                                                            form.setValue('district_id', '')
                                                            form.setValue('village_id', '')
                                                        }}>
                                                        <FormControl className="w-full  border border-gray-300 rounded-lg px-3 py-5 focus:outline-none focus:border-primary">
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Pilih Kabupaten/Kota">
                                                                    {regencies.find(reg => Number(reg.id) == Number(field.value))?.name || 'Pilih Kabupaten/Kota'}
                                                                </SelectValue>
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {regencies.map(city => (
                                                                <SelectItem key={city.id} value={city.id}>{city.name}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                        <FormField
                                            disabled={isPending} control={form.control} name="district_id" render={({ field }) => (
                                                <FormItem><FormLabel>Kecamatan *</FormLabel>
                                                    <Select
                                                        disabled={isLoadingDistricts || field.disabled}
                                                        defaultValue={String(addres?.district_id || "")}
                                                        onValueChange={(v) => {
                                                            field.onChange(v)
                                                            form.setValue('village_id', '')
                                                        }}>
                                                        <FormControl className="w-full  border border-gray-300 rounded-lg px-3 py-5 focus:outline-none focus:border-primary">
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Pilih Kecamatan">
                                                                    {districts.find(dist => Number(dist.id) == Number(field.value))?.name || 'Pilih Kecamatan'}
                                                                </SelectValue>
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {districts.map(d => (
                                                                <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                        <FormField
                                            disabled={isPending} control={form.control} name="village_id" render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Kelurahan *</FormLabel>
                                                    <Select
                                                        disabled={isLoadingVillages || field.disabled}
                                                        defaultValue={String(addres?.village_id || "")}
                                                        onValueChange={field.onChange}
                                                    >
                                                        <FormControl className="w-full  border border-gray-300 rounded-lg px-3 py-5 focus:outline-none focus:border-primary">
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Pilih Kelurahan">
                                                                    {villages.find(vill => Number(vill.id) == Number(field.value))?.name || 'Pilih Kelurahan'}
                                                                </SelectValue>
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {villages.map(v => (
                                                                <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                        <FormField
                                            disabled={isPending}
                                            control={form.control}
                                            name="postalCode"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Kode Pos</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field} placeholder="55xxx" className="w-full border border-gray-300 rounded-lg px-3 py-5 focus:outline-none focus:border-primary" maxLength={5} {...field} />

                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                    </div>
                                    {/* </div> */}

                                    <div className="mb-6">


                                        <FormField
                                            disabled={isPending}
                                            control={form.control}
                                            name="note"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Catatan untuk Penjual (Opsional)</FormLabel>
                                                    <FormControl>
                                                        <Textarea {...field} cols={5}
                                                            placeholder="Contoh: Kirim sore hari, jangan gunakan kantong plastik hitam"
                                                            className="w-full border border-gray-300 rounded-lg px-3 py-4 focus:outline-none focus:border-primary" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    {/* Tombol Lanjut */}

                                    <Button
                                        disabled={isPending || !!errorShippingRates || isLoadingShippingRates}
                                        type="submit"
                                        className="w-full bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-dark transition duration-300"
                                    >
                                        {isPending ? 'Membuat Pesanan...' : (<><i className="fas fa-credit-card mr-2"></i>Lanjut ke Pembayaran</>)}


                                    </Button>
                                </div>
                            </form>

                        </Form>
                    )}


                </div>

            </motion.div>

        </AnimatePresence>
    )
}




const SkeletonPage = () => {
    return (
        <div className="p-6">
            {/* Store Info */}
            <div className="bg-primary-light/20 border border-primary-dark rounded-lg p-4 mb-6">
                <div className="flex items-center">
                    {/* <i className="fas fa-store text-primary text-xl mr-3"></i> */}
                    <Skeleton className="w-13 h-13 rounded-full" />
                    <div>
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-5 w-52 mt-2" />
                    </div>
                </div>
            </div>

            {/* Items */}
            <div className="mb-6">
                <h4 className="font-bold text-gray-800 mb-4">Item Pesanan</h4>
                <div className="space-y-4">

                    {/* card */}
                    {Array(2).fill(null).map((_, index) => (
                        <div key={index} className="flex items-center bg-gray-50 rounded-lg p-4">
                            <Skeleton className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mr-4" />
                            <div className="flex-1">
                                <Skeleton className="w-28 h-5" />
                                <Skeleton className="w-12 h-3 mt-2" />
                                <Skeleton className="w-32 h-3 mt-2" />
                            </div>
                            <Skeleton className="float-right h-4 w-20" />
                        </div>
                    ))}

                    {/* card */}


                </div>

                {/* Summary */}
                <div className="border-t border-gray-200 pt-4 mt-4">

                    <div className="flex justify-between items-center text-lg font-bold border-t border-gray-200 pt-2">
                        <span>Total</span>
                        <Skeleton className="h-5 w-20" />
                    </div>
                </div>
            </div>




            <form className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-9 w-full mt-2" />
                </div>
                <div>
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-9 w-full mt-2" />
                </div>
                <div>
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-9 w-full mt-2" />
                </div>
                <div>
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-9 w-full mt-2" />
                </div>
                <div className="col-span-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-14 w-full mt-2" />
                </div>
                <div>
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-9 w-full mt-2" />
                </div>
                <div>
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-9 w-full mt-2" />
                </div>


            </form>
            {/* </div> */}

            <div className="mb-6">



                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-14 w-full mt-2" />
            </div>
            {/* Tombol Lanjut */}

            <Skeleton className="w-full h-9" />
        </div>
    )
}