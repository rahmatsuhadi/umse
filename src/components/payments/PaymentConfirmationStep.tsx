"use client";

import { AnimatePresence, motion } from "framer-motion";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { Button } from "@/components/ui/button";
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
  paidTotal,
  backToPayment,
}: {
  backToPayment: () => void;
  paidTotal: number;
  id: string;
  currentStep: CheckoutStep;
}) {
  const form = useForm<PaymentConfirmationForm>({
    resolver: zodResolver(paymentConfirmationSchema),
    defaultValues: {
      paidAmount: 0,
      paymentDateTime: getCurrentDateTimeLocal(),
      senderName: "",
      termsAgreement: false,
    },
  });

  const [displayValue, setDisplayValue] = useState("");
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
          {/* Header Card */}
          <div className="bg-white rounded-[24px] shadow-md border border-[var(--cream-dark)] overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-[var(--terracotta)] to-[var(--terracotta-dark)] p-6 text-white">
              <button
                onClick={backToPayment}
                className="flex items-center gap-1.5 text-white/80 hover:text-white text-sm mb-3 transition-colors group cursor-pointer font-bold"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                Kembali ke Pembayaran
              </button>
              <h3 className="text-base font-bold">Konfirmasi Pembayaran</h3>
              <p className="text-white/80 text-xs mt-0.5">
                Upload bukti pembayaran untuk menyelesaikan pesanan
              </p>
            </div>

            {/* Total Summary Bar */}
            <div className="px-6 py-4.5 bg-[var(--cream)] border-b border-[var(--cream-dark)] flex items-center justify-between">
              <span className="text-sm font-semibold text-[var(--text-secondary)]">Total yang Harus Dibayarkan</span>
              <span className="text-xl font-extrabold text-[var(--terracotta)]">{formatRupiah(paidTotal)}</span>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-[24px] shadow-md border border-[var(--cream-dark)] overflow-hidden">
            <div className="p-6 md:p-8">
              <Form {...form}>
                <form
                  id="confirmationForm"
                  onSubmit={form.handleSubmit(handleUploadConfirmation)}
                  className="space-y-6"
                >
                  {/* Upload Area */}
                  <div>
                    <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">
                      Bukti Pembayaran <span className="text-red-500">*</span>
                    </label>
                    <div
                      className={`border-2 border-dashed rounded-[20px] p-6 text-center transition-all duration-300 cursor-pointer
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
                          onClick={() =>
                            document.getElementById("paymentProof")?.click()
                          }
                        >
                          <div className="w-14 h-14 bg-[var(--cream)] border border-[var(--cream-dark)] rounded-[20px] flex items-center justify-center mx-auto mb-3">
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
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      disabled={isPending}
                      control={form.control}
                      name="senderName"
                      render={({ field }) => (
                        <FormItem className="space-y-1.5">
                          <FormLabel className="flex items-center gap-1.5 text-[var(--text-primary)] font-bold text-sm">
                            <User className="w-3.5 h-3.5 text-[var(--terracotta)]" />
                            Nama Pengirim <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="rounded-xl border-[var(--cream-dark)] bg-white focus:border-[var(--terracotta)] focus:ring-[var(--terracotta)] text-[var(--text-primary)] font-medium h-11"
                              placeholder="Nama sesuai rekening/e-wallet"
                            />
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
                        <FormItem className="space-y-1.5">
                          <FormLabel className="flex items-center gap-1.5 text-[var(--text-primary)] font-bold text-sm">
                            <Banknote className="w-3.5 h-3.5 text-[var(--terracotta)]" />
                            Nominal yang Dibayar <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              value={displayValue}
                              disabled={field.disabled}
                              className="rounded-xl border-[var(--cream-dark)] bg-white focus:border-[var(--terracotta)] focus:ring-[var(--terracotta)] text-[var(--text-primary)] font-medium h-11"
                              onChange={(e) => {
                                const cleanValue = e.target.value.replace(
                                  /[^0-9]/g,
                                  ""
                                );
                                const numValue = Number(cleanValue);
                                field.onChange(numValue);
                              }}
                              type="tel"
                              placeholder={formatRupiah(paidTotal)}
                            />
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
                        <FormItem className="space-y-1.5">
                          <FormLabel className="flex items-center gap-1.5 text-[var(--text-primary)] font-bold text-sm">
                            <CalendarClock className="w-3.5 h-3.5 text-[var(--terracotta)]" />
                            Tanggal &amp; Waktu Pembayaran <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="rounded-xl border-[var(--cream-dark)] bg-white focus:border-[var(--terracotta)] focus:ring-[var(--terracotta)] text-[var(--text-primary)] font-medium h-11"
                              type="datetime-local"
                            />
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
                      <FormItem className="space-y-1.5">
                        <FormLabel className="flex items-center gap-1.5 text-[var(--text-primary)] font-bold text-sm">
                          <FileText className="w-3.5 h-3.5 text-[var(--terracotta)]" />
                          Catatan Tambahan{" "}
                          <span className="text-[var(--text-muted)] font-normal text-xs">(Opsional)</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            className="rounded-xl border-[var(--cream-dark)] bg-white focus:border-[var(--terracotta)] focus:ring-[var(--terracotta)] text-[var(--text-primary)] font-medium resize-none p-3"
                            rows={3}
                            placeholder="Catatan tambahan terkait pembayaran"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Terms */}
                  <div className="bg-[var(--cream)] border border-[var(--cream-dark)] rounded-xl p-4">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        className="mt-0.5 w-4 h-4 text-[var(--terracotta)] bg-white border-[var(--cream-dark)] rounded focus:ring-[var(--terracotta)] cursor-pointer"
                        {...form.register("termsAgreement")}
                      />
                      <div className="flex items-start gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-[var(--brown-light)] mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-[var(--text-secondary)] font-medium leading-relaxed">
                          Saya menyatakan bahwa informasi yang saya berikan benar dan sesuai.{" "}
                          <a href="#" className="text-[var(--terracotta)] font-bold hover:underline">
                            Syarat &amp; Ketentuan
                          </a>
                        </span>
                      </div>
                    </label>
                    {form.formState.errors.termsAgreement && (
                      <p className="text-red-500 text-xs mt-2 ml-7 font-semibold">
                        {form.formState.errors.termsAgreement.message}
                      </p>
                    )}
                  </div>

                  <Button
                    disabled={isPending || !isAgreementChecked}
                    type="submit"
                    className="w-full py-6 rounded-xl font-bold text-base shadow-md transition-all duration-300 flex items-center justify-center gap-2 group bg-[var(--terracotta)] hover:bg-[var(--terracotta-dark)] text-white hover:scale-[1.01] active:scale-[0.99] disabled:bg-[var(--cream-dark)] disabled:text-[var(--text-muted)] cursor-pointer disabled:cursor-not-allowed shadow-[var(--terracotta)]/20 hover:shadow-lg"
                  >
                    {isPending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Mengirim Konfirmasi...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        Kirim Konfirmasi Pembayaran
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
