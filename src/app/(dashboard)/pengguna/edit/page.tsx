"use client"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";



export default function EditProfilePage() {
    const router = useRouter();

    // State form fields
    const [fullName, setFullName] = useState("Ahmad Santoso");
    const [email, setEmail] = useState("ahmad.santoso@email.com");
    const [phone, setPhone] = useState("+62 812-3456-7890");
    const [profilePhoto, setProfilePhoto] = useState(
        "https://via.placeholder.com/120x120/E57F39/FFFFFF?text=User"
    );

    // Handle photo upload
    const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                if (typeof reader.result === "string") {
                    setProfilePhoto(reader.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle form submit
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        // Contoh validasi dan submit
        console.log({
            fullName,
            email,
            phone,
            profilePhoto,
        });

        // Bisa panggil API di sini

        alert("Profile berhasil disimpan!");
        router.replace("/profile"); // Redirect ke halaman profile
    };
    return (
        <>
            <header className="bg-white shadow-sm sticky top-0 z-50 md:px-10">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        {/* Back Button & Title */}
                        <div className="flex items-center space-x-4">
                             <Link href={"/pengguna"} className="text-gray-600 hover:text-primary transition-colors hover:cursor-pointer">
                                <i className="fas fa-arrow-left text-xl"></i>
                            </Link>
                            {/* <button
                                onClick={() => router.push("/pengguna")}
                                className="text-gray-600 hover:text-primary transition-colors"
                                aria-label="Back to profile"
                            >
                                <i className="fas fa-arrow-left text-xl"></i>
                            </button> */}
                            <h1 className="text-xl font-bold text-gray-800">Edit Profile</h1>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">
                        <i className="fas fa-user-edit mr-2 text-primary"></i>Informasi Personal
                    </h2>

                    <form id="profileForm" className="space-y-6" onSubmit={handleSubmit}>
                        {/* Profile Photo */}
                        <div className="flex flex-col items-center mb-6">
                            <div className="relative">
                                <img
                                    id="currentProfilePhoto"
                                    src={profilePhoto}
                                    alt="Profile"
                                    className="w-24 h-24 rounded-full border-4 border-gray-200 object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => document.getElementById("photoInput")?.click()}
                                    className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full hover:bg-primary-dark transition-colors"
                                    aria-label="Change profile photo"
                                >
                                    <i className="fas fa-camera text-sm"></i>
                                </button>
                            </div>
                            <input
                                type="file"
                                id="photoInput"
                                accept="image/*"
                                className="hidden"
                                onChange={handlePhotoUpload}
                            />
                            <p className="text-gray-500 text-sm mt-2">Klik untuk mengganti foto profile</p>
                        </div>

                        {/* Full Name */}
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                                Nama Lengkap *
                            </label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary focus:border-primary"
                                required
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email *
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary focus:border-primary"
                                required
                            />
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                Nomor Telepon
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary focus:border-primary"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-dark transition-colors"
                        >
                            <i className="fas fa-save mr-2"></i>Simpan Profile
                        </button>
                    </form>
                </div>
            </main>
        </>
    );
}