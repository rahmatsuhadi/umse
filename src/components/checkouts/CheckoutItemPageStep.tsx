"use client";

import { useAddressPrimary } from "@/features/address/hooks";
import { CartItem, Store } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { CheckoutStep } from "@/components/checkouts/lib";
import CheckoutEmpty from "@/components/checkouts/CheckoutEmpyt";
import CheckoutSkeletonPage from "@/components/checkouts/CheckoutSkeletonPage";
import CheckoutForm from "./CheckoutForm";

export const animationVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const useLocalCheckoutItem = () => {
  const [store, setStore] = useState<Store>();
  const [isLoading, setLoading] = useState(true);

  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const itemData = localStorage.getItem("checkout_items");
    if (itemData) {
      try {
        setLoading(true);
        const parsed = JSON.parse(itemData);

        if (parsed) {
          const { store, items = [] } = parsed;
          setStore(store);
          setItems(items);
        }
        setLoading(false);
      } catch (e) {
        console.error("Gagal parsing checkout_items", e);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  return { store, isLoading, items };
};

export default function CheckoutItem({
  currentStep: step,
}: {
  currentStep: CheckoutStep;
}) {
  const { isLoading, items, store } = useLocalCheckoutItem();

  const { data: primaryAddress, isLoading: loadPrimaryAddress } =
    useAddressPrimary();

  const renderContent = () => {
    if (isLoading || loadPrimaryAddress) {
      return <CheckoutSkeletonPage />;
    } else if (!isLoading && !!store && !!items) {
      return (
        <div className="p-6">
          <CheckoutForm
            address={primaryAddress?.data}
            store={store}
            items={items}
          />
        </div>
      );
    } else {
      return <CheckoutEmpty />;
    }
  };

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
            <p className="text-sm text-gray-600">
              Lengkapi informasi pengiriman
            </p>
          </div>

          {renderContent()}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// export default function CheckoutItem({ currentStep: step }: { currentStep: CheckoutStep }) {

//     const [cartItems, setCartItems] = useState<CartItem[]>([]);

//     const [loading, setLoading] = useState<boolean>(true)

//     const { data: addressData, isLoading: loadingAddress } = useAddressPrimary()
//     const addres = addressData?.data

//     const store = cartItems.length > 0 ? cartItems[0].store : null

//     const form = useForm<z.infer<typeof addressSchema>>({
//         resolver: zodResolver(addressSchema),
//         defaultValues: {
//             recipientName: "",
//             recipientPhone: "",
//             fullAddress: "",
//             regency_id: "",
//             district_id: "",
//             village_id: "",
//             postalCode: "",
//         }
//     });

//     const subtotal = cartItems.reduce(
//         (acc, item) => acc + item.quantity * (item.variant ? item.variant.price.value : item.product.price.value),
//         0
//     );

//     const watchedVillage = form.watch('village_id');

//     const { data: shippingRate, isLoading: isLoadingShippingRates, error: errorShippingRates } = useShippingRates({
//         origin_village_id: store?.village_id,
//         items: cartItems.map((item => {

//             if (item.id) {
//                 return {
//                     cart_item_id: item.id || undefined,
//                     quantity: item.quantity,
//                 }
//             }
//             else {
//                 return {
//                     product_id: item.product.id || undefined,
//                     quantity: item.quantity,
//                     variant_id: item.variant?.id || undefined,
//                 }
//             }
//         })),
//         destination_village_id: watchedVillage ? Number(watchedVillage) : undefined,
//     })

//     const shipping = shippingRate?.data ? shippingRate.data.find(item => item.service === service_name) : null

//     const total = subtotal + (Number(shipping?.cost.value ?? 0));

//     // Watch untuk field terkait
//     const watchedRegency = form.watch('regency_id');
//     const watchedDistrict = form.watch('district_id');

//     // Mengambil data lokasi bertingkat
//     const { data: regenciesData, isLoading: isLoadingRegencies } = useRegencies(String(province_id));
//     const { data: districtsData, isLoading: isLoadingDistricts } = useDistricts(String(watchedRegency ?? ''));
//     const { data: villagesData, isLoading: isLoadingVillages } = useVillages(String(watchedDistrict ?? ''));

//     const regencies = regenciesData?.data || [];
//     const districts = districtsData?.data || [];
//     const villages = villagesData?.data || [];

//     const { mutate, isPending } = useCreateOrder()
//     const handleOrderSubmit = (data: z.infer<typeof addressSchema>) => {
//         const orderData = {
//             // ...data,
//             items: cartItems.map((item) => ({
//                 cart_item_id: item.id,
//                 // product_id: item.product.id,
//                 quantity: item.quantity,
//                 // variant_id: item.variant?.id || '',
//             })),
//             shipping_service: service_name,
//             shipping_service_type: service_type,
//             store_id: store?.id || '',
//             // total: total,
//             address: {
//                 address_line: data.fullAddress,
//                 district_id: Number(data.district_id),
//                 province_id: province_id,
//                 regency_id: Number(data.regency_id),
//                 village_id: Number(data.village_id),
//                 recipient_name: data.recipientName,
//                 recipient_phone_number: data.recipientPhone,
//                 postal_code: Number(data.postalCode),
//                 note: data.note
//             },
//         };
//         mutate(orderData)
//     }

//     const isLoading = loading ||

//     const renderContent = () => {
//         if (isLoading) {
//             return (<CheckoutSkeletonPage />)
//         }
//         else if (!isLoading && cartItems.length == 0 || !isLoading && !!!store) {
//             return <CheckoutEmpty />
//         }
//         else {
//             return (
//                 <Form {...form}>
//                     <form onSubmit={form.handleSubmit(handleOrderSubmit)}>

//                         <div className="p-6">
//                             {/* Store Info */}
//                             <div className="bg-primary-light/20 border border-primary-dark rounded-lg p-4 mb-6">
//                                 <div className="flex items-center">
//                                     {/* <i className="fas fa-store text-primary text-xl mr-3"></i> */}
//                                     <Image className="shadow rounded-full mr-2" src={store?.logo_url || ''} width={50} height={50} alt={store?.name || 'brand-img'} />
//                                     <div>
//                                         <h4 className="font-bold text-gray-800">{store?.name || 'Toko Dummy'}</h4>
//                                         <p className="text-sm text-gray-600">{store?.address || 'Lokasi'}</p>
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Items */}
//                             <div className="mb-6">
//                                 <h4 className="font-bold text-gray-800 mb-4">Item Pesanan</h4>
//                                 <div className="space-y-4">
//                                     {cartItems.map((item, index) => (
//                                         <CheckoutItemCard key={index} item={item}/>
//                                     ))}
//                                 </div>

//                                 {/* Summary */}
//                                 <div className="border-t border-gray-200 pt-4 mt-4">
//                                     {/* <ShippingCardEstimation destinationVillageId={store.village_id}/> */}

//                                     {/* <div className="flex justify-between items-center mb-2">
//                                         <span className="text-gray-600">Ongkos Kirim</span>
//                                         {isLoadingShippingRates ? (
//                                             <span>Mengkalkulasi ongkos kirim...</span>
//                                         ) : errorShippingRates ? (
//                                             <p className="text-sm text-red-500 mt-2">
//                                                 {errorShippingRates.message || 'Gagal memuat ongkos kirim.'}
//                                             </p>
//                                         ) : (

//                                             <span className="font-medium">{shipping ? shipping.cost.formatted : "Rp.0 "} {shippingRate?.data ? `( ${shipping?.service_name})` : ''}</span>

//                                         )}

//                                     </div> */}
//                                     <div className="flex justify-between items-center text-lg font-bold border-t border-gray-200 pt-2">
//                                         <span>Total</span>
//                                         <span className="text-primary">Rp {total.toLocaleString()}</span>
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* <div className="grid md:grid-cols-2 gap-4 mb-6"> */}

//                             <div className="grid gird-cols-1 md:grid-cols-2 gap-4 mb-6">
//                                 <FormField
//                                     disabled={isPending}
//                                     control={form.control}
//                                     name="recipientName"
//                                     render={({ field }) => (
//                                         <FormItem>
//                                             <FormLabel>Nama Penerima *</FormLabel>
//                                             <FormControl>
//                                                 <Input placeholder="Nama lengkap penerima"
//                                                     {...field} className="w-full border border-gray-300 rounded-lg px-3 py-5 focus:outline-none focus:border-primary" />
//                                             </FormControl>
//                                             <FormMessage />
//                                         </FormItem>
//                                     )}
//                                 />

//                                 <FormField
//                                     disabled={isPending}
//                                     control={form.control}
//                                     name="recipientPhone"
//                                     render={({ field }) => (
//                                         <FormItem>
//                                             <FormLabel>Nomor Telepon *</FormLabel>
//                                             <FormControl>
//                                                 <Input
//                                                     {...field}
//                                                     placeholder="08xx xxxx xxxx"
//                                                     className="w-full border border-gray-300 rounded-lg px-3 py-5 focus:outline-none focus:border-primary"
//                                                     ref={withMask('999 9999 9999 999999', {
//                                                         placeholder: '',
//                                                         showMaskOnHover: false
//                                                     })}
//                                                 />
//                                             </FormControl>
//                                             <FormMessage />
//                                         </FormItem>
//                                     )}
//                                 />

//                                 <FormField
//                                     disabled={isPending}
//                                     control={form.control}
//                                     name="fullAddress"
//                                     render={({ field }) => (
//                                         <FormItem className="md:col-span-2">
//                                             <FormLabel>Alamat Lengkap *</FormLabel>
//                                             <FormControl className="">
//                                                 <Textarea cols={10}
//                                                     placeholder="Jalan, nomor rumah, RT/RW, kelurahan, kecamatan"
//                                                     {...field} className="w-full  border border-gray-300 rounded-lg px-3 py-5 focus:outline-none focus:border-primary" />
//                                             </FormControl>
//                                             <FormMessage />
//                                         </FormItem>
//                                     )}
//                                 />
//                                 <FormField
//                                     disabled={isPending} control={form.control} name="regency_id" render={({ field }) => (
//                                         <FormItem><FormLabel>Kabupaten/Kota *</FormLabel>
//                                             <Select
//                                                 disabled={isLoadingRegencies || field.disabled}
//                                                 value={String(addres?.regency_id)  || undefined}
//                                                 onValueChange={(v) => {
//                                                     field.onChange(v)
//                                                     form.setValue('district_id', '')
//                                                     form.setValue('village_id', '')
//                                                 }}>
//                                                 <FormControl className="w-full  border border-gray-300 rounded-lg px-3 py-5 focus:outline-none focus:border-primary">
//                                                     <SelectTrigger>
//                                                         <SelectValue placeholder="Pilih Kabupaten/Kota">
//                                                             {regencies.find(reg => Number(reg.id) == Number(field.value))?.name || 'Pilih Kabupaten/Kota'}
//                                                         </SelectValue>
//                                                     </SelectTrigger>
//                                                 </FormControl>
//                                                 <SelectContent>
//                                                     {regencies.map(city => (
//                                                         <SelectItem key={city.id} value={city.id}>{city.name}</SelectItem>
//                                                     ))}
//                                                 </SelectContent>
//                                             </Select>
//                                             <FormMessage />
//                                         </FormItem>
//                                     )} />
//                                 <FormField
//                                     disabled={isPending} control={form.control} name="district_id" render={({ field }) => (
//                                         <FormItem><FormLabel>Kecamatan *</FormLabel>
//                                             <Select
//                                                 disabled={isLoadingDistricts || field.disabled}
//                                                 defaultValue={String(addres?.district_id || "")}
//                                                 onValueChange={(v) => {
//                                                     field.onChange(v)
//                                                     form.setValue('village_id', '')
//                                                 }}>
//                                                 <FormControl className="w-full  border border-gray-300 rounded-lg px-3 py-5 focus:outline-none focus:border-primary">
//                                                     <SelectTrigger>
//                                                         <SelectValue placeholder="Pilih Kecamatan">
//                                                             {districts.find(dist => Number(dist.id) == Number(field.value))?.name || 'Pilih Kecamatan'}
//                                                         </SelectValue>
//                                                     </SelectTrigger>
//                                                 </FormControl>
//                                                 <SelectContent>
//                                                     {districts.map(d => (
//                                                         <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
//                                                     ))}
//                                                 </SelectContent>
//                                             </Select>
//                                             <FormMessage />
//                                         </FormItem>
//                                     )} />
//                                 <FormField
//                                     disabled={isPending} control={form.control} name="village_id" render={({ field }) => (
//                                         <FormItem>
//                                             <FormLabel>Kelurahan *</FormLabel>
//                                             <Select
//                                                 disabled={isLoadingVillages || field.disabled}
//                                                 defaultValue={String(addres?.village_id || "")}
//                                                 onValueChange={field.onChange}
//                                             >
//                                                 <FormControl className="w-full  border border-gray-300 rounded-lg px-3 py-5 focus:outline-none focus:border-primary">
//                                                     <SelectTrigger>
//                                                         <SelectValue placeholder="Pilih Kelurahan">
//                                                             {villages.find(vill => Number(vill.id) == Number(field.value))?.name || 'Pilih Kelurahan'}
//                                                         </SelectValue>
//                                                     </SelectTrigger>
//                                                 </FormControl>
//                                                 <SelectContent>
//                                                     {villages.map(v => (
//                                                         <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>
//                                                     ))}
//                                                 </SelectContent>
//                                             </Select>
//                                             <FormMessage />
//                                         </FormItem>
//                                     )} />
//                                 <FormField
//                                     disabled={isPending}
//                                     control={form.control}
//                                     name="postalCode"
//                                     render={({ field }) => (
//                                         <FormItem>
//                                             <FormLabel>Kode Pos</FormLabel>
//                                             <FormControl>
//                                                 <Input
//                                                     {...field} placeholder="55xxx" className="w-full border border-gray-300 rounded-lg px-3 py-5 focus:outline-none focus:border-primary" maxLength={5} {...field} />

//                                             </FormControl>
//                                             <FormMessage />
//                                         </FormItem>
//                                     )}
//                                 />

//                             </div>
//                             {/* </div> */}

//                             <div className="mb-6">

//                                 <FormField
//                                     disabled={isPending}
//                                     control={form.control}
//                                     name="note"
//                                     render={({ field }) => (
//                                         <FormItem>
//                                             <FormLabel>Catatan untuk Penjual (Opsional)</FormLabel>
//                                             <FormControl>
//                                                 <Textarea {...field} cols={5}
//                                                     placeholder="Contoh: Kirim sore hari, jangan gunakan kantong plastik hitam"
//                                                     className="w-full border border-gray-300 rounded-lg px-3 py-4 focus:outline-none focus:border-primary" />
//                                             </FormControl>
//                                             <FormMessage />
//                                         </FormItem>
//                                     )}
//                                 />
//                             </div>
//                             {/* Tombol Lanjut */}

//                             <Button
//                                 disabled={isPending || !!errorShippingRates || isLoadingShippingRates}
//                                 type="submit"
//                                 className="w-full bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-dark transition duration-300"
//                             >
//                                 {isPending ? 'Membuat Pesanan...' : (<><i className="fas fa-credit-card mr-2"></i>Lanjut ke Pembayaran</>)}

//                             </Button>
//                         </div>
//                     </form>

//                 </Form>
//             )
//         }
//     }

//     return (
//         <AnimatePresence mode="wait">
//             <motion.div
//                 key={step}
//                 variants={animationVariants}
//                 initial="hidden"
//                 animate="visible"
//                 exit="exit"
//                 transition={{ duration: 0.3 }}
//             >
//                 <div id="orderSection" className="bg-white rounded-lg shadow-md mb-6">
//                     <div className="p-6 border-b border-gray-200">
//                         <h3 className="text-lg font-bold text-gray-800">Detail Pesanan</h3>
//                         <p className="text-sm text-gray-600">Lengkapi informasi pengiriman</p>
//                     </div>

//                     {renderContent()}

//                 </div>

//             </motion.div>

//         </AnimatePresence>
//     )
// }
