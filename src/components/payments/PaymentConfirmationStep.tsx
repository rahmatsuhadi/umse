"use client"

import { AnimatePresence, motion } from "framer-motion"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useCreatePayment } from "@/features/order/hooks"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { CheckoutStep } from "@/components/checkouts/lib"
import { animationVariants } from "@/components/checkouts/CheckoutItemPageStep"

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png", "image/jpg"];

const getCurrentDateTimeLocal = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
};

const paymentConfirmationSchema = z.object({
  paymentProof: z
    .custom<File>((file) => file instanceof File, { message: "File harus diunggah" })
    .refine((file) => file.size <= MAX_FILE_SIZE, { message: "Ukuran file maksimal 5MB" })
    .refine((file) => ACCEPTED_FILE_TYPES.includes(file.type), {
      message: "Format file tidak didukung (hanya JPG atau PNG)",
    }),
  senderName: z.string().min(3, { message: "Minimal 3 karakter" }),
  note: z.string().optional(),
  paidAmount: z.number().min(1, { message: "Nominal harus lebih dari 0" }),
  paymentDateTime: z.string().nonempty({ message: "Tanggal & waktu pembayaran harus diisi" }),
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

    // Validasi tipe file
    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      toast.error("File harus berupa gambar JPG atau PNG");
      form.setError("paymentProof", {
        type: "filetype",
        message: "Format file tidak didukung",
      });
      e.target.value = "";
      return;
    }

    // Validasi ukuran file
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

    // buat preview URL
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
  };

  const handleRemoveFile = () => {
    setPreviewUrl(null);
    form.setValue("paymentProof", null as any);
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
        <div id="confirmationSection" className="bg-white rounded-lg shadow-md mb-6">
          <div className="p-6 border-b border-gray-200">
            <Button className="mb-2 hover:cursor-pointer" onClick={backToPayment}>
              Kembali
            </Button>
            <h3 className="text-lg font-bold text-gray-800">Konfirmasi Pembayaran</h3>
            <p className="text-sm text-gray-600">
              Upload bukti pembayaran untuk menyelesaikan pesanan
            </p>
          </div>

          <div className="p-6">
            <Form {...form}>
              <form id="confirmationForm" onSubmit={form.handleSubmit(handleUploadConfirmation)}>
                {/* Upload Bukti Pembayaran */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bukti Pembayaran *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition duration-300">
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
                        className="cursor-pointer"
                        onClick={() =>
                          document.getElementById("paymentProof")?.click()
                        }
                      >
                        <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-2"></i>
                        <p className="text-gray-600 mb-2">
                          Klik untuk upload bukti pembayaran
                        </p>
                        <p className="text-sm text-gray-500">
                          Format Image: JPG, PNG, JPEG (Max 5MB)
                        </p>
                      </div>
                    ) : (
                      <div className="relative inline-block">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="max-h-64 mx-auto rounded-lg border object-contain"
                        />
                        <button
                          type="button"
                          className="absolute top-2 right-2 bg-white text-red-500 rounded-full p-1 shadow"
                          onClick={handleRemoveFile}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    )}
                    {form.formState.errors.paymentProof && (
                      <p className="text-red-500 text-sm mt-2">
                        {form.formState.errors.paymentProof.message?.toString()}
                      </p>
                    )}
                  </div>
                </div>

                {/* Form lainnya */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <FormField
                    disabled={isPending}
                    control={form.control}
                    name="senderName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Pengirim *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
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
                      <FormItem>
                        <FormLabel>Nominal yang Dibayar *</FormLabel>
                        <FormControl>
                          <Input
                            value={displayValue}
                            disabled={field.disabled}
                            onChange={(e) => {
                              const cleanValue = e.target.value.replace(/[^0-9]/g, "");
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
                      <FormItem>
                        <FormLabel>Tanggal & Waktu Pembayaran *</FormLabel>
                        <FormControl>
                          <Input {...field} type="datetime-local" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mb-6">
                  <FormField
                    disabled={isPending}
                    control={form.control}
                    name="note"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Catatan Tambahan (Opsional)</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Catatan tambahan terkait pembayaran"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Syarat & Ketentuan */}
                <div className="mb-6">
                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      className="mt-1 w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary"
                      {...form.register("termsAgreement")}
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Saya menyatakan bahwa informasi yang saya berikan benar.
                      <a href="#" className="text-primary ml-1">
                        Syarat & Ketentuan
                      </a>
                    </span>
                  </label>
                  {form.formState.errors.termsAgreement && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.termsAgreement.message}
                    </p>
                  )}
                </div>

                <Button
                  disabled={isPending || !isAgreementChecked}
                  type="submit"
                  className="w-full bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-dark transition duration-300"
                >
                  {isPending ? (
                    "Mengirim Konfirmasi..."
                  ) : (
                    <>
                      <i className="fas fa-paper-plane mr-2"></i>
                      Kirim Konfirmasi Pembayaran
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
