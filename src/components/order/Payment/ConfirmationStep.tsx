"use client"

import { AnimatePresence, motion } from "framer-motion"
import { CheckoutStep } from "../step/steps"
import { animationVariants } from "../step/animate"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useCreatePayment } from "@/features/order/hooks"
import { useEffect, useState } from "react"


const MAX_FILE_SIZE = 5 * 1024 * 1024; // bytes
const ACCEPTED_FILE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/jpg",
];

const getCurrentDateTimeLocal = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
}

const paymentConfirmationSchema = z.object({
    paymentProof: z
        .custom<File>((file) => {
            return file instanceof File;
        }, {
            message: "File harus diunggah"
        })
        .refine((file) => file.size <= MAX_FILE_SIZE, {
            message: "Ukuran file maksimal 5MB",
        })
        .refine((file) => ACCEPTED_FILE_TYPES.includes(file.type), {
            message: "Format file tidak didukung (hanya JPG, PNG, atau PDF)",
        }),
    senderName: z.string({ error: "Nama pengirim harus diisi" }).min(3, { message: "minimal Nama 3 karakter" }),
    note: z.string().optional(),
    paidAmount: z
        .number({ error: "Nominal harus berupa angka" })
        .min(1, { message: "Nominal yang dibayar harus lebih besar dari 0" }),
    // paymentMethod: z.string({ error: "Metode pembayaran harus dipilih" }).nonempty({ message: "Metode pembayaran harus dipilih" }),
    paymentDateTime: z.string({ error: "Tanggal & waktu pembayaran harus diisi" }).nonempty({ message: "Tanggal & waktu pembayaran harus diisi" }),
    termsAgreement: z.boolean().refine(val => val === true, {
        message: "Anda harus menyetujui syarat dan ketentuan",
    }),
});

const formatRupiah = (number: number) => {
    if (number === null || isNaN(number)) return '';
    return `Rp ${number.toLocaleString('id-ID')}`;
};


type PaymentConfirmationForm = z.infer<typeof paymentConfirmationSchema>;

export default function ConfirmationPage({ currentStep: step, id, paidTotal, backToPayment }: { backToPayment: () => void, paidTotal: number, id: string, currentStep: CheckoutStep }) {
    // const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    // const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);


    const form = useForm<PaymentConfirmationForm>({
        resolver: zodResolver(paymentConfirmationSchema),
        defaultValues: {
            paidAmount: 0,
            paymentDateTime: getCurrentDateTimeLocal(),
            // paymentMethod: "",
            senderName: '',
            termsAgreement: false
        }
    });

    const [displayValue, setDisplayValue] = useState('');

    useEffect(() => {
        // Sync the display value with the form's numerical value
        const subscription = form.watch((value, { name }) => {
            if (name === 'paidAmount' && value.paidAmount !== undefined) {
                setDisplayValue(formatRupiah(value.paidAmount));
            }
        });
        return () => subscription.unsubscribe();
    }, [form]);

    const { mutate, isPending } = useCreatePayment(id)

    const handleUploadConfirmation = async (data: PaymentConfirmationForm) => {

        mutate({
            amount: data.paidAmount,
            payment_proof: data.paymentProof,
            paid_at: data.paymentDateTime,
            payment_note: data.note,
            sender_name: data.senderName
            // method: data.paymentMethod
        })

    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            form.setValue("paymentProof", e.target.files[0]);

            // const file = e.target.files[0];
        }
    };

    const isAgreementChecked = form.watch("termsAgreement")


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
                        <Button className=" mb-2 hover:cursor-pointer" onClick={backToPayment}>Kembali</Button>
                        <h3 className="text-lg font-bold text-gray-800">Konfirmasi Pembayaran</h3>
                        <p className="text-sm text-gray-600">
                            Upload bukti pembayaran untuk menyelesaikan pesanan
                        </p>
                    </div>

                    <div className="p-6">
                        <Form {...form}>

                            <form
                                id="confirmationForm"
                                onSubmit={form.handleSubmit(handleUploadConfirmation)}
                            >
                                {/* Upload Bukti Pembayaran */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Bukti Pembayaran *</label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition duration-300">
                                        <input
                                            id="paymentProof"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleFileChange}
                                        />
                                        <div
                                            id="uploadArea"
                                            className="cursor-pointer"
                                            onClick={() => document.getElementById("paymentProof")?.click()}
                                        >
                                            <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-2"></i>
                                            <p className="text-gray-600 mb-2">Klik untuk upload bukti pembayaran</p>
                                            <p className="text-sm text-gray-500">Format Image: JPG, PNG, JPEG, ... (Max 5MB)</p>
                                        </div>
                                        {form.watch("paymentProof") && (
                                            <p className="text-sm text-green-600 mt-2">
                                                File diunggah: {form.watch("paymentProof").name}
                                            </p>
                                        )}
                                        {form.formState.errors.paymentProof && (
                                            <p className="text-red-500 text-sm">
                                                {form.formState.errors.paymentProof.message?.toString()}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Form Pembayaran */}
                                <div className="grid md:grid-cols-2 gap-4 mb-6">
                                    <FormField
                                        disabled={isPending}
                                        control={form.control}
                                        name="senderName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="block text-sm font-medium text-gray-700 mb-2">Nama Pengirim *</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                                                        placeholder="Nama sesuai rekening/e-wallet" />
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
                                                <FormLabel className="block text-sm font-medium text-gray-700 mb-2">Nominal yang Dibayar *</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        value={displayValue}
                                                        disabled={field.disabled}
                                                        onChange={(e) => {
                                                            const cleanValue = e.target.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
                                                            const numValue = Number(cleanValue);
                                                            field.onChange(numValue); // Update the form's actual numerical value
                                                        }}
                                                        type="tel" // Use 'tel' to bring up a numeric keypad on mobile
                                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                                                        placeholder={formatRupiah(paidTotal)}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* <FormField control={form.control} name="paymentMethod" render={({ field }) => (
                                        <FormItem><FormLabel>Metode Pembayaran *</FormLabel>
                                            <Select onValueChange={field.onChange}>
                                                <FormControl className="  border w-full border-gray-300 rounded-lg px-3 py-5 focus:outline-none focus:border-primary">
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Pilih metode pembayaran" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {[{
                                                        value: 'bni',
                                                        label: "BNI",
                                                    }, {
                                                        value: 'bca',
                                                        label: "BCA",
                                                    }, {
                                                        value: 'mandiri',
                                                        label: "Mandiri",
                                                    }, {
                                                        value: 'bri',
                                                        label: "BRI",
                                                    }, {
                                                        value: 'other',
                                                        label: "Lainnya",
                                                    }, {
                                                        value: 'dana',
                                                        label: "Dana",
                                                    }].map(method => (
                                                        <SelectItem key={method.label} value={method.value}>{method.label}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )} /> */}



                                    <FormField
                                        disabled={isPending}
                                        control={form.control}
                                        name="paymentDateTime"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="block text-sm font-medium text-gray-700 mb-2">Tanggal & Waktu Pembayaran *</FormLabel>
                                                <FormControl className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-primary">
                                                    <Input
                                                        {...field} className="w-full" type="datetime-local"
                                                    />
                                                </FormControl>
                                                {/* <FormMessage /> */}
                                            </FormItem>
                                        )}
                                    />


                                </div>

                                {/* Catatan Tambahan */}
                                <div className="mb-6">
                                    <FormField
                                        disabled={isPending}
                                        control={form.control}
                                        name="note"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="block text-sm font-medium text-gray-700 mb-2">Catatan Tambahan (Opsional)</FormLabel>
                                                <FormControl className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-primary">
                                                    <Textarea
                                                        {...field}
                                                        placeholder="Catatan tambahan terkait pembayaran" />
                                                </FormControl>
                                                <FormMessage />
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
                                            Saya menyatakan bahwa informasi yang saya berikan adalah benar dan akurat.
                                            Saya memahami bahwa pembayaran akan diverifikasi oleh penjual sebelum pesanan diproses.
                                            <a href="#" className="text-primary hover:text-primary-dark">Syarat & Ketentuan</a>
                                        </span>
                                    </label>
                                    {form.formState.errors.termsAgreement && (
                                        <p className="text-red-500 text-sm">{form.formState.errors.termsAgreement.message}</p>
                                    )}
                                </div>

                                {/* Kirim Konfirmasi */}
                                <Button
                                    disabled={isPending || !isAgreementChecked}
                                    type="submit"
                                    className="w-full bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-dark transition duration-300"
                                >
                                    {isPending ? 'Mengirim Konfirmasi...' : (<><i className="fas fa-paper-plane mr-2"></i>Kirim Konfirmasi Pembayaran</>)}

                                </Button>
                            </form>

                        </Form>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}