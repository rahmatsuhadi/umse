import { Address, CartItem, Store } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { Ref, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import CheckoutItemCard from "./CheckoutItem";
import ShippingCardEstimation, {
  service_name,
  service_type,
} from "./ShippingCardEstimation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { withMask } from "use-mask-input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  useDistricts,
  useProvinces,
  useRegencies,
  useVillages,
} from "@/features/locations/hooks";
import { Button } from "../ui/button";
import { useCreateOrder } from "@/features/order/hooks";
import { Loader2 } from "lucide-react";

// Skema validasi dengan Zod
const addressSchema = z.object({
  recipientName: z.string().min(1, "Nama penerima wajib diisi."),
  recipientPhone: z.string().min(10, "Nomor telepon tidak valid."),
  fullAddress: z.string().min(1, "Alamat lengkap wajib diisi."),
  province_id: z.string().min(1, "Province wajib dipilih."),
  regency_id: z.string().min(1, "Kabupaten/Kota wajib dipilih."),
  district_id: z.string().min(1, "Kecamatan wajib dipilih."),
  village_id: z.string().min(1, "Kelurahan wajib dipilih."),
  postalCode: z
    .string()
    .min(5, "Kode pos tidak valid.")
    .max(5, "Kode pos tidak valid."),
  note: z.string().optional(),
});
interface CheckoutFormProps {
  address?: Address;
  store: Store;
  items: CartItem[];
}

export default function CheckoutForm({
  address,
  store,
  items,
}: CheckoutFormProps) {
  const form = useForm<z.infer<typeof addressSchema>>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      recipientName: "",
      recipientPhone: "",
      fullAddress: "",
      province_id: "",
      regency_id: "",
      district_id: "",
      village_id: "",
      postalCode: "",
      note: "",
    },
  });

  useEffect(() => {
    if (address) {
      form.reset({
        recipientName: address.recipient_name ?? "",
        recipientPhone: address.recipient_phone_number ?? "",
        fullAddress: address.address ?? "",
        province_id: String(address.province_id),
        regency_id: String(address.regency_id),
        district_id: String(address.district_id),
        village_id: String(address.village_id),
        postalCode: String(address.postal_code),
        note: address.note ?? "",
      });
    }
  }, [address, form]);

  const handleOrderSubmit = (data: z.infer<typeof addressSchema>) => {
    const orderData = {
      // ...data,
      items: items.map((item) => {
        if (item.id) {
          return {
            cart_item_id: item.id,
            quantity: item.quantity,
          };
        } else {
          return {
            product_id: item.product.id,
            quantity: item.quantity,
            variant_id: item.variant ? item.variant.id : undefined,
          };
        }

        // variant_id: item.variant?.id || '',
      }),
      shipping_service: service_name,
      shipping_service_type: service_type,
      store_id: store.id,
      address: {
        address_line: data.fullAddress,
        district_id: Number(data.district_id),
        province_id: Number(data.province_id),
        regency_id: Number(data.regency_id),
        village_id: Number(data.village_id),
        recipient_name: data.recipientName,
        recipient_phone_number: data.recipientPhone,
        postal_code: Number(data.postalCode),
        note: data.note,
      },
    };
    mutate(orderData);
  };

  const watchedProvince = form.watch("province_id");
  const watchedRegency = form.watch("regency_id");
  const watchedDistrict = form.watch("district_id");

  const { data: provincesData, isLoading: isLoadingProvinces } = useProvinces();
  const { data: regenciesData, isLoading: isLoadingRegencies } =
    useRegencies(watchedProvince);
  const { data: districtsData, isLoading: isLoadingDistricts } =
    useDistricts(watchedRegency);
  const { data: villagesData, isLoading: isLoadingVillages } =
    useVillages(watchedDistrict);

  const provinces = provincesData?.data || [];
  const regencies = regenciesData?.data || [];
  const districts = districtsData?.data || [];
  const villages = villagesData?.data || [];

  const [isValidShip, setIsValidShip] = useState<boolean>(false);

  const { mutate, isPending } = useCreateOrder();

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleOrderSubmit)}>
          {/* Store Info */}
          <div className="bg-primary-light/20 border border-primary-dark rounded-lg p-4 mb-6">
            <div className="flex items-center">
              {/* <i className="fas fa-store text-primary text-xl mr-3"></i> */}
              <Image
                className="shadow rounded-full mr-2"
                src={store.logo_url || ""}
                width={50}
                height={50}
                alt={store?.name || "brand-img"}
              />
              <div>
                <h4 className="font-bold text-gray-800">
                  {store.name || "Toko Dummy"}
                </h4>
                <p className="text-sm text-gray-600">
                  {store.address || "Lokasi"}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="font-bold text-gray-800 mb-4">Item Pesanan</h4>
            <div className="space-y-4">
              {items.map((item, index) => (
                <CheckoutItemCard key={index} item={item} />
              ))}
            </div>

            <ShippingCardEstimation
              items={items}
              storeVillageId={store.village_id}
              handleValidShipping={(val) => setIsValidShip(val)}
            />
          </div>

          <div className="grid gird-cols-1 md:grid-cols-2 gap-4 mb-6">
            <FormField
              control={form.control}
              name="recipientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Penerima *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Nama lengkap penerima"
                      className="w-full border border-gray-300 rounded-lg px-3 py-5 focus:outline-none focus:border-primary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
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
                      ref={
                        withMask("999 9999 9999 999999", {
                          placeholder: "",
                          showMaskOnHover: false,
                        }) as unknown as Ref<HTMLInputElement>
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fullAddress"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Alamat Lengkap *</FormLabel>
                  <FormControl className="">
                    <Textarea
                      cols={10}
                      placeholder="Jalan, nomor rumah, RT/RW, kelurahan, kecamatan"
                      {...field}
                      className="w-full  border border-gray-300 rounded-lg px-3 py-5 focus:outline-none focus:border-primary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="province_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provinsi *</FormLabel>
                  <Select
                    disabled={isLoadingProvinces}
                    value={field.value}
                    onValueChange={(v) => {
                      if (!!v) {
                        form.setValue("province_id", v);
                        form.setValue("regency_id", "");
                        form.setValue("district_id", "");
                        form.setValue("village_id", "");
                      }
                    }}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            <>
                              {isLoadingProvinces ? (
                                <>
                                  <Loader2 className="animate-spin text-gray-400" />
                                  <span className="text-gray-400">
                                    Mohon Tunggu Sebentar
                                  </span>
                                </>
                              ) : (
                                "Pilih Provinsi"
                              )}
                            </>
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {provinces.map((prov) => (
                        <SelectItem key={prov.id} value={String(prov.id)}>
                          {prov.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="regency_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kabupaten/Kota *</FormLabel>
                  <Select
                    disabled={!watchedProvince || isLoadingRegencies}
                    value={field.value || ""}
                    onValueChange={(v) => {
                      if (!!v) {
                        form.setValue("regency_id", v);
                        form.setValue("district_id", "");
                        form.setValue("village_id", "");
                      }
                    }}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            <>
                              {isLoadingRegencies ? (
                                <>
                                  <Loader2 className="animate-spin text-gray-400" />
                                  <span className="text-gray-400">
                                    Mohon Tunggu Sebentar
                                  </span>
                                </>
                              ) : (
                                "Pilih Kabupaten/Kota"
                              )}
                            </>
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {regencies.map((city) => (
                        <SelectItem key={city.id} value={String(city.id)}>
                          {city.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="district_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kapanewon *</FormLabel>
                  <Select
                    disabled={!watchedRegency || isLoadingDistricts}
                    value={field.value || ""}
                    onValueChange={(v) => {
                      if (!!v) {
                        form.setValue("district_id", v);
                        form.setValue("village_id", "");
                      }
                    }}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            <>
                              {isLoadingDistricts ? (
                                <>
                                  <Loader2 className="animate-spin text-gray-400" />
                                  <span className="text-gray-400">
                                    Mohon Tunggu Sebentar
                                  </span>
                                </>
                              ) : (
                                "Pilih Kapanewon"
                              )}
                            </>
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {districts.map((d) => (
                        <SelectItem key={d.id} value={String(d.id)}>
                          {d.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="village_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kelurahan *</FormLabel>
                  <Select
                    disabled={!watchedDistrict || isLoadingVillages}
                    value={field.value || ""}
                    onValueChange={(v) => {
                      if (!!v) {
                        form.setValue("village_id", v);
                      }
                    }}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            <>
                              {isLoadingVillages ? (
                                <>
                                  <Loader2 className="animate-spin text-gray-400" />
                                  <span className="text-gray-400">
                                    Mohon Tunggu Sebentar
                                  </span>
                                </>
                              ) : (
                                "Pilih Kelurahan"
                              )}
                            </>
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {villages.map((v) => (
                        <SelectItem key={v.id} value={String(v.id)}>
                          {v.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kode Pos</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="55xxx"
                      className="w-full border border-gray-300 rounded-lg px-3 py-5 focus:outline-none focus:border-primary"
                      maxLength={5}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="mb-6">
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Catatan untuk Penjual (Opsional)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      cols={5}
                      placeholder="Contoh: Kirim sore hari, jangan gunakan kantong plastik hitam"
                      className="w-full border border-gray-300 rounded-lg px-3 py-4 focus:outline-none focus:border-primary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            disabled={isPending || !isValidShip}
            type="submit"
            className="w-full bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-dark transition duration-300"
          >
            {isPending ? (
              "Membuat Pesanan..."
            ) : (
              <>
                <i className="fas fa-credit-card mr-2"></i>Lanjut ke Pembayaran
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
