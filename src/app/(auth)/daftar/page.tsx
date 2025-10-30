"use client";

import { Ref, useRef, useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff, Mail, User2 } from "lucide-react";
import { FaPhoneAlt } from "react-icons/fa";
import { IoLockClosed } from "react-icons/io5";
import { useRegister } from "@/features/auth/hooks";
import { withMask } from "use-mask-input";
import { Checkbox } from "@/components/ui/checkbox";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import SelectASNApiSearch from "@/components/auth/SelectAsn";
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/webp",
];

const formSchema = z
  .object({
    phone_number: z
      .string()
      .min(1, { message: "Nomor HP tidak boleh kosong." })
      .transform((val) => val.replace(/\s+/g, ""))
      .refine((val) => /^08[0-9]{8,12}$/.test(val), {
        message: "Nomor harus diawali 08 dan panjangnya 10-14 digit",
      }),
    name: z.string().min(1, { message: "Nama tidak boleh kosong." }),
    password: z
      .string()
      .min(8, { message: "Password minimal 8 karakter." })
      .regex(/[A-Z]/, {
        message: "Password harus mengandung minimal satu huruf besar.",
      })
      .regex(/[a-z]/, {
        message: "Password harus mengandung minimal satu huruf kecil.",
      })
      .regex(/[0-9]/, {
        message: "Password harus mengandung minimal satu angka.",
      })
      .regex(/[^A-Za-z0-9]/, {
        message: "Password harus mengandung minimal satu simbol.",
      }),
    password_confirmation: z
      .string()
      .min(1, { message: "Konfirmasi Password tidak boleh kosong." }),
    email: z
      .string()
      .min(1, { message: "Email tidak boleh kosong." })
      .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
        message: "Format email tidak valid.",
      }),
    is_asn: z.boolean(),
    asn_proof_document: z.file().optional(),
    organization_id: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.is_asn && !data.asn_proof_document) {
        return false;
      }
      return true;
    },
    {
      message: "Dokumen ASN harus diisi jika memilih ASN.",
      path: ["asn_proof_document"],
    }
  )
  .refine(
    (data) => {
      if (data.is_asn && !data.organization_id) {
        return false;
      }
      return true;
    },
    {
      message: "Badan usahan harus diisi jika memilih ASN.",
      path: ["organization_id"],
    }
  )
  .refine((data) => data.password === data.password_confirmation, {
    message: "Konfirmasi password tidak cocok.",
    path: ["password_confirmation"],
  })
  .superRefine((data, ctx) => {
    const file = data.asn_proof_document;
    if (file) {
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        ctx.addIssue({
          code: "custom",
          path: ["asn_proof_document"],
          message: "File harus berupa gambar (jpg, jpeg, png, webp).",
        });
      }

      if (file.size > MAX_FILE_SIZE) {
        ctx.addIssue({
          code: "custom",
          path: ["asn_proof_document"],
          message: "Ukuran file maksimal 2MB.",
        });
      }
    }
  });

export default function DaftarPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordAgain, setShowPasswordAgain] = useState(false);
  const [isAsnChecked, setIsAsnChecked] = useState(false); // State untuk memeriksa apakah checkbox ASN dicentang
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captchaRef = useRef<ReCAPTCHA>(null);

  const { mutate: handleRegister, isPending } = useRegister();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone_number: "",
      email: "",
      password: "",
      password_confirmation: "",
      name: "",
      is_asn: false, // Default false untuk is_asn
      organization_id: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!captchaToken) return;
    handleRegister(
      { ...values, captchaToken: captchaToken },
      {
        onSuccess: () => {
          captchaRef.current?.reset();
          setCaptchaToken(null);
          toast.success("Pendaftaran Berhasil!", {
            description: "Akun Anda telah dibuat. Silakan masuk.",
          });
          router.push("/masuk"); // Arahkan ke halaman login setelah daftar
        },
        onError: (error) => {
          captchaRef.current?.reset();
          setCaptchaToken(null);
          toast.error("Pendaftaran Gagal", {
            description:
              error.message || "Data yang Anda masukkan tidak valid.",
          });
        },
      }
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    form.clearErrors("asn_proof_document"); // Clear previous errors
    if (file) {
      const allowedTypes = [
        // "application/pdf",
        "image/jpeg",
        "image/jpg",
        "image/png",
      ];
      const maxSize = 5 * 1024 * 1024;

      if (!allowedTypes.includes(file.type)) {
        form.setError("asn_proof_document", {
          type: "manual",
          message:
            "Tipe file tidak diperbolehkan. Hanya PDF, JPG, dan PNG yang diperbolehkan.",
        });
      } else if (file.size > maxSize) {
        form.setError("asn_proof_document", {
          type: "manual",
          message: "Ukuran file melebihi batas maksimal 5MB.",
        });
      } else {
        form.setValue("asn_proof_document", file); // Clear the value in the form state
      }
    }
  };

  return (
    <div className="flex relative items-center justify-center min-h-[80vh] px-4">
      <Card className="w-full max-w-md z-20 mt-5">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-[#36454F]">
            Daftar
          </CardTitle>
          <CardDescription className="text-[#36454F]">
            Daftar Untuk Melanjutkan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Field Nama */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          placeholder="Amanda Sekar"
                          className="pl-10 py-5 rounded-xl"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Field Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          type="email"
                          placeholder="amanda@gmail.com"
                          className="pl-10 py-5 rounded-xl"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Field Nomor HP */}
              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nomor HP</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <FaPhoneAlt className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          {...field}
                          autoComplete="tel"
                          placeholder="08xx xxxx xxxx"
                          className="pl-10 py-5 rounded-xl pr-10"
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

              {/* Field Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <IoLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          autoComplete="new-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="********"
                          className="pl-10 py-5 rounded-xl"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 hover:text-primary"
                        >
                          {showPassword ? <EyeOff /> : <Eye />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Field Konfirmasi Password */}
              <FormField
                control={form.control}
                name="password_confirmation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Konfirmasi Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <IoLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          autoComplete="new-password"
                          type={showPasswordAgain ? "text" : "password"}
                          placeholder="********"
                          className="pl-10 py-5 rounded-xl"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowPasswordAgain(!showPasswordAgain)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 hover:text-primary"
                        >
                          {showPasswordAgain ? <EyeOff /> : <Eye />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Checkbox ASN */}
              <FormField
                control={form.control}
                name="is_asn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <Checkbox
                        checked={isAsnChecked}
                        onCheckedChange={() => {
                          setIsAsnChecked(!isAsnChecked);
                          field.onChange(!isAsnChecked); // update form state
                        }}
                      />
                      Apakah Anda ASN?
                    </FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Field ASN Proof Document - Tampil jika is_asn dicentang */}
              {isAsnChecked && (
                <FormField
                  control={form.control}
                  name="asn_proof_document"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Upload Bukti ASN</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept=" .jpeg, .jpg, .png"
                          onChange={handleFileChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Field Pilih Badan Usaha - Tampil jika is_asn dicentang */}
              {isAsnChecked && (
                <FormField
                  control={form.control}
                  name="organization_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Badan Usaha</FormLabel>
                      <FormControl>
                        <SelectASNApiSearch onChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <ReCAPTCHA
                ref={captchaRef}
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                onChange={setCaptchaToken}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full py-6"
                disabled={isPending || !captchaToken}
              >
                {isPending ? "Memproses..." : "Daftar"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center gap-2 items-center">
          <p className="text-sm text-gray-600">Sudah punya akun?</p>
          <Link href={"/masuk"} className="text-primary underline">
            Masuk
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
