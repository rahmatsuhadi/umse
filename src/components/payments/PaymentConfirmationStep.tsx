"use client";

import { AnimatePresence, motion } from "framer-motion";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Image from "next/image";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreatePayment } from "@/features/order/hooks";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CheckoutStep } from "@/components/checkouts/lib";
import { animationVariants } from "@/components/checkouts/CheckoutItemPageStep";
import { Order } from "@/types";
import { StepIndicator } from "@/components/orders/step/StepIndicator";
import CheckoutItemCard from "@/components/checkouts/CheckoutItem";
import {
  Upload,
  X,
  Send,
  ArrowLeft,
  User,
  Banknote,
  CalendarClock,
  FileText,
  ShieldCheck,
  MapPin,
} from "lucide-react";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png", "image/jpg"];

const getCurrentDateTimeLocal = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
};

const paymentConfirmationSchema = z.object({
  paymentProof: z
    .custom<File>((file) => file instanceof File, {
      message: "File harus diunggah",
    })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: "Ukuran file maksimal 5MB",
    })
    .refine((file) => ACCEPTED_FILE_TYPES.includes(file.type), {
      message: "Format file tidak didukung (hanya JPG atau PNG)",
    }),
  senderName: z.string().min(3, { message: "Minimal 3 karakter" }),
  note: z.string().optional(),
  paidAmount: z.number().min(1, { message: "Nominal harus lebih dari 0" }),
  paymentDateTime: z
    .string()
    .nonempty({ message: "Tanggal & waktu pembayaran harus diisi" }),
  termsAgreement: z.boolean().refine((val) => val === true, {
    message: "Anda harus menyetujui syarat dan ketentuan",
  }),
});

type PaymentConfirmationForm = z.infer<typeof paymentConfirmationSchema>;

const formatRupiah = (number: number) => {
  if (number === null || isNaN(number)) return "";
  return `Rp ${number.toLocaleString("id-ID")}`;
};

export default function ConfirmationPage({
  currentStep: step,
  id,
  order,
  backToPayment,
}: {
  backToPayment: () => void;
  order: Order;
  id: string;
  currentStep: CheckoutStep;
}) {
  const form = useForm<PaymentConfirmationForm>({
    resolver: zodResolver(paymentConfirmationSchema),
    defaultValues: {
      paidAmount: order.total.value,
      paymentDateTime: getCurrentDateTimeLocal(),
      senderName: order.shipping_recipient_name || "",
      termsAgreement: false,
    },
  });

  const [displayValue, setDisplayValue] = useState(formatRupiah(order.total.value));
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { mutate, isPending } = useCreatePayment(id);

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "paidAmount" && value.paidAmount !== undefined) {
        setDisplayValue(formatRupiah(value.paidAmount));
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const handleUploadConfirmation = (data: PaymentConfirmationForm) => {
    mutate({
      amount: data.paidAmount,
      payment_proof: data.paymentProof,
      paid_at: data.paymentDateTime,
      payment_note: data.note,
      sender_name: data.senderName,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      toast.error("File harus berupa gambar JPG atau PNG");
      form.setError("paymentProof", {
        type: "filetype",
        message: "Format file tidak didukung",
      });
      e.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("Ukuran file maksimal 5MB");
      form.setError("paymentProof", {
        type: "filesize",
        message: "Ukuran file maksimal 5MB",
      });
      e.target.value = "";
      return;
    }

    form.clearErrors("paymentProof");
    form.setValue("paymentProof", file, { shouldValidate: true });

    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
  };

  const handleRemoveFile = () => {
    setPreviewUrl(null);
    form.resetField("paymentProof");
    const input = document.getElementById("paymentProof") as HTMLInputElement;
    if (input) input.value = "";
  };

  const isAgreementChecked = form.watch("termsAgreement");

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
        <div id="confirmationSection" className="mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Wizard + Form */}
            <div className="flex flex-col lg:col-span-7 space-y-6">
              {/* Step Indicator */}
              <StepIndicator currentStep={step} />

              {/* Kembali ke Pembayaran */}
              <button
                onClick={backToPayment}
                className="flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-[var(--terracotta)] text-sm mb-2 transition-colors group cursor-pointer font-bold self-start" style={{ paddingBottom:"15px"}}
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                Kembali ke Pembayaran
              </button>

              {/* Form Card */}
              <div className="checkout-card flex flex-col flex-1">
                <div className="checkout-header-section">
                  <div className="checkout-header-icon-box">
                    <FileText className="w-5 h-5 text-[var(--terracotta)]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Konfirmasi Pembayaran</h3>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Isi data konfirmasi transfer dan unggah bukti pembayaran Anda</p>
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  {/* Total Summary Bar */}
                  <div className="w-full bg-[var(--cream)] border border-[var(--cream-dark)] rounded-2xl px-6 py-4.5 mb-6 flex items-center justify-between shadow-inner" style={{padding: "5px"}}>
                    <span className="text-sm font-semibold text-[var(--text-secondary)]">Total yang Harus Dibayarkan</span>
                    <span className="text-xl font-extrabold text-[var(--terracotta)] tracking-tight">
                      {formatRupiah(order.total.value)}
                    </span>
                  </div>

                  <Form {...form}>
                    <form
                      id="confirmationForm"
                      onSubmit={form.handleSubmit(handleUploadConfirmation)}
                      className="space-y-6"
                    >
                      {/* Upload Area */}
                      <div className="checkout-input-group">
                        <label className="checkout-input-label">
                          Bukti Pembayaran <span className="text-red-500">*</span>
                        </label>
                        <div
                          className={`border-2 border-dashed rounded-[20px] p-6 text-center transition-all duration-300 cursor-pointer flex flex-col items-center justify-center min-h-[220px]
                            ${previewUrl
                              ? "border-[var(--terracotta)]/40 bg-[var(--cream)]"
                              : "border-[var(--cream-dark)] hover:border-[var(--terracotta)] hover:bg-[var(--cream)]/40"
                            }`}
                        >
                          <input
                            id="paymentProof"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                          />
                          {!previewUrl ? (
                            <div
                              id="uploadArea"
                              className="flex flex-col items-center justify-center w-full"
                              onClick={() =>
                                document.getElementById("paymentProof")?.click()
                              }
                            >
                              <div className="w-14 h-14 bg-[var(--cream)] border border-[var(--cream-dark)] rounded-[20px] flex items-center justify-center mb-3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Upload className="w-6 h-6 text-[var(--terracotta)]" />
                              </div>
                              <p className="text-[var(--text-primary)] font-bold mb-1">
                                Klik untuk upload bukti pembayaran
                              </p>
                              <p className="text-xs text-[var(--text-muted)] font-medium">
                                Format: JPG, PNG, JPEG &middot; Maks. 5MB
                              </p>
                            </div>
                          ) : (
                            <div className="relative inline-block w-full">
                              <div className="relative w-full h-64 rounded-xl overflow-hidden bg-white">
                                <Image
                                  src={previewUrl}
                                  alt="Preview"
                                  fill
                                  style={{ objectFit: "contain" }}
                                  className="rounded-xl"
                                />
                              </div>
                              <button
                                type="button"
                                className="absolute top-2 right-2 bg-white text-red-500 border border-red-100 rounded-full p-1.5 shadow-md hover:bg-red-50 transition-colors cursor-pointer"
                                onClick={handleRemoveFile}
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                          {form.formState.errors.paymentProof && (
                            <p className="text-red-500 text-sm mt-2 font-medium">
                              {form.formState.errors.paymentProof.message?.toString()}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Form Fields */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          disabled={isPending}
                          control={form.control}
                          name="senderName"
                          render={({ field }) => (
                            <FormItem className="checkout-input-group">
                              <FormLabel className="checkout-input-label">
                                Nama Pengirim <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <div className="checkout-input-wrapper">
                                  <User className="checkout-input-icon w-4 h-4" />
                                  <Input
                                    {...field}
                                    className="checkout-input"
                                    placeholder="Nama sesuai rekening/e-wallet"
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          disabled={isPending}
                          control={form.control}
                          name="paidAmount"
                          render={({ field }) => (
                            <FormItem className="checkout-input-group">
                              <FormLabel className="checkout-input-label">
                                Nominal yang Dibayar <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <div className="checkout-input-wrapper">
                                  <Banknote className="checkout-input-icon w-4 h-4" />
                                  <Input
                                    value={displayValue}
                                    disabled={field.disabled}
                                    className="checkout-input"
                                    onChange={(e) => {
                                      const cleanValue = e.target.value.replace(
                                        /[^0-9]/g,
                                        ""
                                      );
                                      const numValue = Number(cleanValue);
                                      field.onChange(numValue);
                                    }}
                                    type="tel"
                                    placeholder={formatRupiah(order.total.value)}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          disabled={isPending}
                          control={form.control}
                          name="paymentDateTime"
                          render={({ field }) => (
                            <FormItem className="checkout-input-group">
                              <FormLabel className="checkout-input-label">
                                Tanggal &amp; Waktu Pembayaran <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <div className="checkout-input-wrapper">
                                  <CalendarClock className="checkout-input-icon w-4 h-4" />
                                  <Input
                                    {...field}
                                    className="checkout-input"
                                    type="datetime-local"
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        disabled={isPending}
                        control={form.control}
                        name="note"
                        render={({ field }) => (
                          <FormItem className="checkout-input-group">
                            <FormLabel className="checkout-input-label">
                              Catatan Tambahan{" "}
                              <span className="text-[var(--text-muted)] font-normal text-xs">(Opsional)</span>
                            </FormLabel>
                            <FormControl>
                              <div className="checkout-input-wrapper">
                                <FileText className="checkout-textarea-icon w-4 h-4" />
                                <Textarea
                                  {...field}
                                  className="checkout-textarea"
                                  rows={3}
                                  placeholder="Catatan tambahan terkait pembayaran"
                                />
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      {/* Terms */}
                      <div className="bg-[var(--cream)] border border-[var(--cream-dark)] rounded-xl p-4.5" style={{paddingLeft: "10px", paddingRight: "10px"}}>
                        <label className="flex items-center justify-center gap-3 cursor-pointer group py-1 px-4">
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-[var(--terracotta)] bg-white border-[var(--cream-dark)] rounded focus:ring-[var(--terracotta)] cursor-pointer"
                            {...form.register("termsAgreement")}
                          />
                          <div className="flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-[var(--brown-light)] flex-shrink-0" />
                            <span className="text-sm text-[var(--text-secondary)] font-medium leading-relaxed">
                              Saya menyatakan bahwa informasi yang saya berikan benar dan sesuai.{" "}
                              <a href="#" className="text-[var(--terracotta)] font-bold hover:underline">
                                Syarat &amp; Ketentuan
                              </a>
                            </span>
                          </div>
                        </label>
                        {form.formState.errors.termsAgreement && (
                          <p className="text-red-500 text-xs mt-2 text-center font-semibold">
                            {form.formState.errors.termsAgreement.message}
                          </p>
                        )}
                      </div>

                      <button
                        disabled={isPending || !isAgreementChecked}
                        type="submit"
                        className="checkout-btn-full" style={{marginTop:"15px"}}
                      >
                        {isPending ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Mengirim Konfirmasi...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Kirim Konfirmasi Pembayaran
                          </>
                        )}
                      </button>
                    </form>
                  </Form>
                </div>
              </div>
            </div>

            {/* Right Column: Order Details Sidebar */}
            <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
              <div className="checkout-card" style={{ padding: "24px" }}>
                {/* Header */}
                <div className="checkout-header-section mb-4">
                  <div className="checkout-header-icon-box">
                    <FileText className="w-5 h-5 text-[var(--terracotta)]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Detail Pesanan</h3>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Ringkasan transaksi pesanan Anda</p>
                  </div>
                </div>

                {/* Store Info */}
                <div className="flex items-center gap-4 border-b pb-4 mb-4" style={{ borderColor: "var(--cream-dark)", paddingBottom: "12px" }}>
                  <div className="checkout-store-logo-box">
                    {order.store.logo_url ? (
                      <Image
                        className="rounded-xl object-cover"
                        src={order.store.logo_url}
                        width={56}
                        height={56}
                        alt={order.store.name}
                      />
                    ) : (
                      <div className="w-14 h-14 bg-[var(--cream)] rounded-xl flex items-center justify-center font-bold text-[var(--terracotta)]">
                        {order.store.name.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="badge badge-terracotta text-[9px] px-2 py-0.5">Merchant</span>
                    </div>
                    <h4 className="checkout-store-name mt-1 truncate">
                      {order.store.name}
                    </h4>
                    <p className="checkout-store-location truncate">
                      <MapPin className="w-3.5 h-3.5 inline mr-1 text-[var(--terracotta)]" />
                      <span className="truncate">{order.store.address || "Lokasi Toko"}</span>
                    </p>
                  </div>
                </div>

                {/* Items */}
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold flex items-center gap-2 text-sm text-[var(--text-primary)]" style={{ padding: "12px" }}>
                    Item Pesanan
                  </h4>
                  <span className="text-[11px] px-2 py-1 rounded-lg border font-semibold" style={{ background: "var(--cream)", color: "var(--text-secondary)", borderColor: "var(--cream-dark)", padding: "5px"}}>
                    {order.items.length} Barang
                  </span>
                </div>

                <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin mb-4">
                  {order.items.map((item, index) => (
                    <CheckoutItemCard key={index} item={item} />
                  ))}
                </div>

                {/* Rincian Pembayaran */}
                <div className="checkout-shipping-section border-t pt-4 space-y-4" style={{ borderColor: "var(--cream-dark)" }}>
                  <div className="checkout-shipping-row">
                    <span className="checkout-shipping-label">Subtotal Produk</span>
                    <span className="checkout-shipping-value">{order.subtotal.formatted}</span>
                  </div>
                  <div className="checkout-shipping-row">
                    <span className="checkout-shipping-label">Ongkos Kirim</span>
                    <span className="checkout-shipping-value">{order.shipping_cost.formatted}</span>
                  </div>
                  <div className="checkout-total-container">
                    <div>
                      <span className="checkout-total-title">Total Pembayaran</span>
                      <span className="checkout-total-subtitle">Sudah termasuk PPN</span>
                    </div>
                    <span className="checkout-total-price">{order.total.formatted}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
