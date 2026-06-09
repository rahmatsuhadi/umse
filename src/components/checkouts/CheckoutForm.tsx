import { Address, CartItem, Store } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { Ref, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import CheckoutItemCard from "./CheckoutItem";
import ShippingCardEstimation from "./ShippingCardEstimation";
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
import { useUser } from "@/features/auth/hooks";
import { addAddress, setDefaultAddress } from "@/features/address/api";
import { Loader2, User2, Phone, Home, MapPin } from "lucide-react";
import { StepIndicator } from "@/components/orders/step/StepIndicator";

// Skema validasi dengan Zod
const addressSchema = z.object({
  recipientName: z.string().min(1, "Nama penerima wajib diisi."),
  recipientPhone: z.string().min(10, "Nomor telepon tidak valid."),
  fullAddress: z.string().min(1, "Alamat lengkap wajib diisi."),
  province_id: z.string().min(1, "Province wajib dipilih."),
  regency_id: z.string().min(1, "Kabupaten/Kota wajib dipilih."),
  district_id: z.string().min(1, "Kapanewon wajib dipilih."),
  village_id: z.string().min(1, "Kelurahan wajib dipilih."),
  postalCode: z
    .string()
    .min(5, "Kode pos tidak valid.")
    .max(5, "Kode pos tidak valid."),
  note: z.string().optional(),
});
function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 my-6">
      <div className="flex-grow h-[1.5px]" style={{ background: "var(--cream-dark, #F0D5C2)" }} />
      <span className="text-[11px] font-bold tracking-wider uppercase text-center" style={{ color: "var(--text-muted, #6B4C2A)" }}>
        {label}
      </span>
      <div className="flex-grow h-[1.5px]" style={{ background: "var(--cream-dark, #F0D5C2)" }} />
    </div>
  );
}

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
  const { data: userData } = useUser();
  const user = userData?.data;

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

  const [shipping_service, setShippingService] = useState<{
    name: string;
    type: string;
  }>({ name: "", type: "" });

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
    } else if (user) {
      form.reset({
        recipientName: user.name ?? "",
        recipientPhone: user.phone_number ?? "",
        fullAddress: "",
        province_id: "",
        regency_id: "",
        district_id: "",
        village_id: "",
        postalCode: "",
        note: "",
      });
    }
  }, [address, user, form]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutateAsync: createOrderMutate, isPending } = useCreateOrder();
  const isProcessing = isPending || isSubmitting;

  const handleOrderSubmit = async (data: z.infer<typeof addressSchema>) => {
    setIsSubmitting(true);
    try {
      if (!address) {
        // Simpan data alamat baru
        const newAddress = await addAddress({
          recipient_name: data.recipientName,
          recipient_phone_number: data.recipientPhone.replace(/\s+/g, ""),
          address: data.fullAddress,
          province_id: Number(data.province_id),
          regency_id: Number(data.regency_id),
          district_id: Number(data.district_id),
          village_id: Number(data.village_id),
          postal_code: String(data.postalCode),
          is_primary: true,
          note: data.note || "",
          label: "Utama",
        });

        // Otomatis di jadikan alamat utama
        if (newAddress && newAddress.id) {
          await setDefaultAddress(newAddress.id);
        }
      }

      const orderData = {
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
        }),
        shipping_service: shipping_service.name,
        shipping_service_type: shipping_service.type,
        store_id: store.id,
        address: {
          address_line: data.fullAddress,
          district_id: Number(data.district_id),
          province_id: Number(data.province_id),
          regency_id: Number(data.regency_id),
          village_id: Number(data.village_id),
          recipient_name: data.recipientName,
          recipient_phone_number: data.recipientPhone.replace(/\s+/g, ""),
          postal_code: Number(data.postalCode),
          note: data.note,
        },
      };

      await createOrderMutate(orderData);
    } catch (error) {
      console.error("Gagal memproses alamat atau pesanan:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const watchedProvince = form.watch("province_id");
  const watchedRegency = form.watch("regency_id");
  const watchedDistrict = form.watch("district_id");
  const watchedVillage = form.watch("village_id");
  const watchedPostalCode = form.watch("postalCode");

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

  useEffect(() => {
    if (!watchedVillage) {
      setShippingService({
        name: "",
        type: "",
      });
      setIsValidShip(false);
    }
  }, [watchedVillage]);

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleOrderSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Side: Delivery Details Form */}
            <div className="lg:col-span-7 space-y-6">
              <StepIndicator currentStep="checkout" />
              <div className="checkout-card">
                <div className="checkout-header-section">
                  <div className="checkout-header-icon-box">
                    <i className="fas fa-map-marked-alt text-lg"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Informasi Pengiriman</h3>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Lengkapi data tujuan pengiriman pesanan Anda</p>
                  </div>
                </div>

                {/* Section 1: Recipient Name & Phone */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Recipient Name Field */}
                    <FormField
                      control={form.control}
                      disabled={isProcessing}
                      name="recipientName"
                      render={({ field }) => (
                        <FormItem className="checkout-input-group">
                          <FormLabel className="checkout-input-label">Nama Penerima *</FormLabel>
                          <FormControl>
                            <div className="checkout-input-wrapper">
                              <User2 size={16} className="checkout-input-icon" />
                              <Input
                                {...field}
                                placeholder="Nama lengkap penerima"
                                className="checkout-input"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Recipient Phone Field */}
                    <FormField
                      control={form.control}
                      disabled={isProcessing}
                      name="recipientPhone"
                      render={({ field }) => (
                        <FormItem className="checkout-input-group">
                          <FormLabel className="checkout-input-label">Nomor Telepon *</FormLabel>
                          <FormControl>
                            <div className="checkout-input-wrapper">
                              <Phone size={16} className="checkout-input-icon" />
                              <Input
                                {...field}
                                placeholder="08xx xxxx xxxx"
                                className="checkout-input"
                                ref={
                                  withMask("999 9999 9999 999999", {
                                    placeholder: "",
                                    showMaskOnHover: false,
                                  }) as unknown as Ref<HTMLInputElement>
                                }
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Full Address Field */}
                  <FormField
                    control={form.control}
                    disabled={isProcessing}
                    name="fullAddress"
                    render={({ field }) => (
                      <FormItem className="checkout-input-group">
                        <FormLabel className="checkout-input-label">Alamat Lengkap *</FormLabel>
                        <FormControl>
                          <div className="checkout-input-wrapper">
                            <Home size={16} className="checkout-textarea-icon" />
                            <Textarea
                              placeholder="Tuliskan nama jalan, nomor rumah, RT/RW, patokan, dll."
                              {...field}
                              className="checkout-textarea"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Section Divider */}
                <SectionDivider label="Wilayah Pengiriman" />

                {/* Section 2: Regional Dropdowns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Province Select */}
                  <FormField
                    control={form.control}
                    disabled={isProcessing}
                    name="province_id"
                    render={({ field }) => (
                      <FormItem className="checkout-input-group">
                        <FormLabel className="checkout-input-label">Provinsi *</FormLabel>
                        <Select
                          disabled={isLoadingProvinces || isProcessing}
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
                          <FormControl>
                            <SelectTrigger className="checkout-select-trigger flex">
                              <SelectValue
                                placeholder={
                                  isLoadingProvinces ? (
                                    <div className="flex items-center gap-2">
                                      <Loader2 className="animate-spin w-4 h-4" style={{ color: "var(--terracotta)" }} />
                                      <span style={{ color: "var(--text-muted)" }}>Loading...</span>
                                    </div>
                                  ) : (
                                    "Pilih Provinsi"
                                  )
                                }
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-xl shadow-lg border-[1.5px] border-[var(--cream-dark)] bg-white p-1 z-[250]">
                            {provinces.map((prov) => (
                              <SelectItem key={prov.id} value={String(prov.id)} className="hover:bg-[var(--cream)] rounded-lg text-[var(--text-primary)] font-medium">
                                {prov.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Regency Select */}
                  <FormField
                    disabled={isProcessing}
                    control={form.control}
                    name="regency_id"
                    render={({ field }) => (
                      <FormItem className="checkout-input-group">
                        <FormLabel className="checkout-input-label">Kabupaten/Kota *</FormLabel>
                        <Select
                          disabled={
                            !watchedProvince || isLoadingRegencies || isProcessing
                          }
                          value={field.value || ""}
                          onValueChange={(v) => {
                            if (!!v) {
                              form.setValue("regency_id", v);
                              form.setValue("district_id", "");
                              form.setValue("village_id", "");
                            }
                          }}
                        >
                          <FormControl>
                            <SelectTrigger className="checkout-select-trigger flex">
                              <SelectValue
                                placeholder={
                                  isLoadingRegencies ? (
                                    <div className="flex items-center gap-2">
                                      <Loader2 className="animate-spin w-4 h-4" style={{ color: "var(--terracotta)" }} />
                                      <span style={{ color: "var(--text-muted)" }}>Loading...</span>
                                    </div>
                                  ) : (
                                    "Pilih Kabupaten/Kota"
                                  )
                                }
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-xl shadow-lg border-[1.5px] border-[var(--cream-dark)] bg-white p-1 z-[250]">
                            {regencies.map((city) => (
                              <SelectItem key={city.id} value={String(city.id)} className="hover:bg-[var(--cream)] rounded-lg text-[var(--text-primary)] font-medium">
                                {city.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* District Select */}
                  <FormField
                    control={form.control}
                    disabled={isProcessing}
                    name="district_id"
                    render={({ field }) => (
                      <FormItem className="checkout-input-group">
                        <FormLabel className="checkout-input-label">Kapanewon *</FormLabel>
                        <Select
                          disabled={
                            !watchedRegency || isLoadingDistricts || isProcessing
                          }
                          value={field.value || ""}
                          onValueChange={(v) => {
                            if (!!v) {
                              form.setValue("district_id", v);
                              form.setValue("village_id", "");
                            }
                          }}
                        >
                          <FormControl>
                            <SelectTrigger className="checkout-select-trigger flex">
                              <SelectValue
                                placeholder={
                                  isLoadingDistricts ? (
                                    <div className="flex items-center gap-2">
                                      <Loader2 className="animate-spin w-4 h-4" style={{ color: "var(--terracotta)" }} />
                                      <span style={{ color: "var(--text-muted)" }}>Loading...</span>
                                    </div>
                                  ) : (
                                    "Pilih Kapanewon"
                                  )
                                }
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-xl shadow-lg border-[1.5px] border-[var(--cream-dark)] bg-white p-1 z-[250]">
                            {districts.map((d) => (
                              <SelectItem key={d.id} value={String(d.id)} className="hover:bg-[var(--cream)] rounded-lg text-[var(--text-primary)] font-medium">
                                {d.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Village Select */}
                  <FormField
                    control={form.control}
                    disabled={isProcessing}
                    name="village_id"
                    render={({ field }) => (
                      <FormItem className="checkout-input-group">
                        <FormLabel className="checkout-input-label">Kelurahan *</FormLabel>
                        <Select
                          disabled={
                            !watchedDistrict || isLoadingVillages || isProcessing
                          }
                          value={field.value || ""}
                          onValueChange={(v) => {
                            if (!!v) {
                              form.setValue("village_id", v);
                            }
                          }}
                        >
                          <FormControl>
                            <SelectTrigger className="checkout-select-trigger flex">
                              <SelectValue
                                placeholder={
                                  isLoadingVillages ? (
                                    <div className="flex items-center gap-2">
                                      <Loader2 className="animate-spin w-4 h-4" style={{ color: "var(--terracotta)" }} />
                                      <span style={{ color: "var(--text-muted)" }}>Loading...</span>
                                    </div>
                                  ) : (
                                    "Pilih Kelurahan"
                                  )
                                }
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-xl shadow-lg border-[1.5px] border-[var(--cream-dark)] bg-white p-1 z-[250]">
                            {villages.map((v) => (
                              <SelectItem key={v.id} value={String(v.id)} className="hover:bg-[var(--cream)] rounded-lg text-[var(--text-primary)] font-medium">
                                {v.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Postal Code Field */}
                  <FormField
                    control={form.control}
                    disabled={isProcessing}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem className="checkout-input-group">
                        <FormLabel className="checkout-input-label">Kode Pos *</FormLabel>
                        <FormControl>
                          <div className="checkout-input-wrapper">
                            <MapPin size={16} className="checkout-input-icon" />
                            <Input
                              {...field}
                              placeholder="55xxx"
                              className="checkout-input"
                              maxLength={5}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Seller Note */}
                <div className="border-t pt-6 mt-6" style={{ borderColor: "var(--cream-dark)" }}>
                  <FormField
                    control={form.control}
                    disabled={isProcessing}
                    name="note"
                    render={({ field }) => (
                      <FormItem className="checkout-input-group">
                        <div className="flex items-center gap-2 mb-2">
                          <i className="far fa-comment-alt text-sm" style={{ color: "var(--brown-light)" }}></i>
                          <FormLabel className="checkout-input-label mb-0">Catatan untuk Penjual (Opsional)</FormLabel>
                        </div>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Contoh: Kirim sore hari, jangan gunakan kantong plastik hitam"
                            className="checkout-textarea"
                            style={{ minHeight: "70px" }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Right Side: Sticky Checkout Card Summary */}
            <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
              {/* Merged: Store Info + Items & Order Details */}
              <div className="checkout-card" style={{ padding: "24px" }}>
                {/* Store Info Header */}
                <div className="flex items-center gap-4 border-b pb-4 mb-4" style={{ borderColor: "var(--cream-dark)", paddingBottom: "12px" }}>
                  <div className="checkout-store-logo-box">
                    <Image
                      className="rounded-xl object-cover"
                      src={store.logo_url || ""}
                      width={56}
                      height={56}
                      alt={store?.name || "brand-img"}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="badge badge-terracotta text-[9px] px-2 py-0.5">Toko Pilihan</span>
                    </div>
                    <h4 className="checkout-store-name mt-1 truncate">
                      {store.name || "Toko Sleman Mart"}
                    </h4>
                    <p className="checkout-store-location truncate">
                      <i className="fas fa-map-marker-alt flex-shrink-0" style={{ color: "var(--terracotta)" }}></i>
                      <span className="truncate">{store.address || "Lokasi"}</span>
                    </p>
                  </div>
                </div>

                {/* Items Header */}
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                    <i className="fas fa-shopping-bag" style={{ color: "var(--terracotta)", padding: "12px" }}></i>
                    Item Pesanan
                  </h4>
                  <span className="text-[11px] px-2 py-1 rounded-lg border font-semibold" style={{ background: "var(--cream)", color: "var(--text-secondary)", borderColor: "var(--cream-dark)", padding: "6px" }}>
                    {items.length} Barang
                  </span>
                </div>

                <div className="space-y-4 max-h-[280px] overflow-y-auto pr-1 scrollbar-thin">
                  {items.map((item, index) => (
                    <CheckoutItemCard key={index} item={item} />
                  ))}
                </div>

                {/* Shipping cost & Total Estimation */}
                <ShippingCardEstimation
                  items={items}
                  storeVillageId={store.village_id}
                  handleValidShipping={(val) => {
                    setIsValidShip(!!val);
                    setShippingService({
                      name: val.service,
                      type: val.service_type,
                    });
                  }}
                />

                {/* Action payment button */}
                <div className="mt-6">
                  <Button
                    disabled={isProcessing || !isValidShip || !watchedPostalCode || watchedPostalCode.length !== 5}
                    type="submit"
                    className="checkout-btn-full"
                  >
                    {isProcessing ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="animate-spin w-4 h-4" />
                        <span>Membuat Pesanan...</span>
                      </div>
                    ) : (
                      <>
                        <i className="fas fa-shield-alt text-sm"></i>
                        <span>Lanjut ke Pembayaran</span>
                      </>
                    )}
                  </Button>
                  <p className="checkout-security-note">
                    <i className="fas fa-lock"></i> Transaksi aman & terenkripsi
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
