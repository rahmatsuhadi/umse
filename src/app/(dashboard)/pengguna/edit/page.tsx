"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateProfile, useUser } from "@/features/auth/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

// Skema validasi dengan Zod
const profileSchema = z.object({
    name: z.string().min(3, "Nama lengkap minimal 3 karakter."),
    email: z.email("Format email tidak valid."),
    phone_number: z.string().min(10, "Nomor HP tidak valid."),
    profilePhoto: z.any().optional(),
});

export default function EditProfilePage() {


    const { data } = useUser();

    const user = data?.data;


    const { mutate: updateUser, isPending } = useUpdateProfile();
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);

    const form = useForm<z.infer<typeof profileSchema>>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: '',
            email: '',
            phone_number: '',
            profilePhoto: null,
        },
    });

    // Pra-isi form dengan data pengguna saat data tersedia
    useEffect(() => {
        if (user) {
            form.setValue('name', user.name);
            form.setValue('email', user.email
                ? user.email
                : '');
            form.setValue('phone_number', user.phone_number
                ? user.phone_number : ''
            )
            setPhotoPreview(user.avatarUrl || null);
        }
    }, [user, form]);

    function onSubmit(values: z.infer<typeof profileSchema>) {
        const dataToSubmit = {
            ...values,
            profilePhoto: values.profilePhoto?.[0], // Ambil file dari FileList
        };
        updateUser(dataToSubmit);
    }



    return (
        <>
            <header className="bg-white shadow-sm sticky top-0 z-50 md:px-10">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <Link href="/pengguna" className="text-gray-600 hover:text-primary"><i className="fas fa-arrow-left text-xl"></i></Link>
                            <h1 className="text-xl font-bold text-gray-800">Edit Profile</h1>
                        </div>
                    </div>
                </div>
            </header>
            <main className="container mx-auto px-4 py-6">
                <Card className="p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">
                        <i className="fas fa-user-edit mr-2 text-primary"></i>
                        Informasi Personal</h2>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="profilePhoto"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col items-center">
                                        <FormControl>
                                            <div className="flex flex-col items-center">
                                                <Avatar className="w-24 h-24 mb-2 border-4 border-gray-200">
                                                    <AvatarImage src={photoPreview || user?.avatarUrl} alt="Profile" />
                                                    <AvatarFallback><i className="fas fa-user text-2xl"></i></AvatarFallback>
                                                </Avatar>
                                                <Label htmlFor="photo-upload" className="bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-primary-dark transition-colors -mt-8 mr-[-60px] z-10">
                                                    <i className="fas fa-camera text-sm"></i>
                                                </Label>
                                                <Input
                                                    id="photo-upload"
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        field.onChange(e.target.files);
                                                        if (e.target.files && e.target.files[0]) {
                                                            setPhotoPreview(URL.createObjectURL(e.target.files[0]));
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem><FormLabel>Nama Lengkap *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="email" render={({ field }) => (
                                <FormItem><FormLabel>Email *</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="phone_number" render={({ field }) => (
                                <FormItem><FormLabel>Nomor Telepon</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />

                            <Button type="submit" className="w-full hover:cursor-pointer" disabled={isPending}>
                                {isPending ? (<><i className="fas fa-spinner fa-spin mr-2"></i>Menyimpan...</>) : (<><i className="fas fa-save mr-2"></i>Simpan Perubahan</>)}
                            </Button>
                        </form>
                    </Form>
                </Card>
            </main>
        </>
    );
}