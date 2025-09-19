"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { useAddReport } from "@/features/reports/hook";
import { MediaUploader } from "../orders/modal/ReviewOrder";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";

const reportSchema = z.object({
    issueCategory: z.string().nonempty("Kategori wajib dipilih"),
    issueTitle: z.string().min(1, "Judul wajib diisi").max(100),
    issueDescription: z.string().min(1, "Deskripsi wajib diisi").max(1000),
    attachments: z
        .any()
        .optional(),
});

type ReportFormData = z.infer<typeof reportSchema>;

export default function ReportForm() {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<ReportFormData>({
        resolver: zodResolver(reportSchema),
        defaultValues: {
            issueCategory: "",
            issueTitle: "",
            issueDescription: "",
            attachments: [],
        },
    });

    const router = useRouter()

    const { mutate, isPending } = useAddReport()
    const [files, setFiles] = useState<File[]>([]);

    const onSubmit = (data: ReportFormData) => {
        mutate({
            category: data.issueCategory,
            description: data.issueDescription,
            media: files,
            title: data.issueTitle
        })
    };

    const selectedCategory = watch("issueCategory");



    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6">
                        Form Laporan Masalah
                    </h2>

                    <form onSubmit={handleSubmit(onSubmit)} id="reportForm" className="space-y-6">
                        {/* Kategori Masalah */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Kategori Masalah <span className="text-red-500">*</span>
                            </label>
                            <select
                                {...register("issueCategory")}
                                id="issueCategory"
                                name="issueCategory"
                                disabled={isPending}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            >
                                <option value="">Pilih kategori masalah</option>
                                <option value="payment">Masalah Pembayaran</option>
                                <option value="product">Masalah Produk</option>
                                <option value="shipping">Masalah Pengiriman</option>
                                <option value="account">Masalah Akun</option>
                                <option value="app">Masalah Aplikasi</option>
                                <option value="other">Lainnya</option>
                            </select>
                            {errors.issueCategory && (
                                <p className="text-red-500 text-sm mt-1">{errors.issueCategory.message}</p>
                            )}
                        </div>



                        {/* Judul Masalah */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Judul Masalah <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                {...register("issueTitle")}
                                id="issueTitle"
                                disabled={isPending}
                                name="issueTitle"
                                placeholder="Jelaskan masalah dalam satu kalimat singkat"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                            {errors.issueTitle && (
                                <p className="text-red-500 text-sm mt-1">{errors.issueTitle.message}</p>
                            )}
                        </div>

                        {/* Deskripsi Masalah */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Deskripsi Masalah <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                {...register("issueDescription")}
                                id="issueDescription"
                                disabled={isPending}
                                name="issueDescription"
                                rows={6}
                                placeholder="Jelaskan masalah secara detail..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-vertical"
                            ></textarea>
                            {errors.issueDescription && (
                                <p className="text-red-500 text-sm mt-1">{errors.issueDescription.message}</p>
                            )}
                        </div>

                        {/* Lampiran */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Lampiran (opsional)
                            </label>

                            <MediaUploader
                                files={files}
                                disabled={isPending}
                                maxSizeMB={5}
                                maxFiles={2}
                                onFilesChange={setFiles}
                            />

                            {/* <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition duration-200"> */}
                            {/* <input
                                    type="file"
                                    {...register("attachments")}
                                    id="attachments"
                                    name="attachments"
                                    multiple
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                <label htmlFor="attachments" className="cursor-pointer">
                                    <i className="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-2"></i>
                                    <p className="text-gray-600">Klik untuk upload file atau drag & drop</p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Format yang didukung: JPG, PNG (Maks. 5MB per file)
                                    </p>
                                </label> */}
                            {/* </div> */}



                        </div>

                        {/* Tombol */}
                        <div className="flex space-x-4">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="flex-1 py-3 hover:cursor-pointer border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-300"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                className={`flex-1 bg-primary ${isPending ? "bg-primary/50" : ""} flex justify-center items-center hover:cursor-pointer text-white py-3 px-6 rounded-lg hover:bg-primary-dark transition duration-300 font-semibold`}
                            >
                                {isPending ? (<><LoaderCircle className="animate-spin" /> Mengirim Laporan...</>) : (
                                    <>
                                        <i className="fas fa-paper-plane mr-2"></i>
                                        Kirim Laporan
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}