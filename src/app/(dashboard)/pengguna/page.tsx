"use client"
import { Navbar } from "@/components/shared/Navbar";
import { useLogout, useUser } from "@/features/auth/hooks";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PesananPage() {
    const router = useRouter()

    const {data} = useUser()

    const {mutate: handleLogout} = useLogout()

    const user = data?.data


    const logout = () => {
        handleLogout()
        // Implementasi logout
        
        // Redirect ke login
    };

    return (
        <div className="bg-gray-50 ">
            <Navbar  />

            <main className="container mx-auto px-4 py-6">
                {/* Profile Header */}
                <div className="bg-white rounded-lg shadow-md mb-6">
                    <div className="relative">
                        {/* Cover Background */}
                        <div className="h-32 primary-light rounded-t-lg"></div>

                        {/* Profile Info */}
                        <div className="relative px-6 pb-6">
                            <div className="flex flex-col items-center -mt-16 mb-4">
                                {/* Profile Photo */}
                                <div className="relative mb-4">
                                    <Image
                                        id="profilePhoto"
                                        src={user?.profile_url || '/assets/no-image.jpg'}
                                        alt="Profile"
                                        width={400}
                                        height={400}
                                        className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-lg object-cover"
                                    />
                                </div>

                                {/* User Info */}
                                <div className="text-center flex-1">
                                    <div className="mb-2">
                                        <h1 id="userName" className="text-2xl font-bold text-gray-800 mb-1">
                                            {user?.name}
                                        </h1>
                                        <p id="userEmail" className="text-gray-600 mb-3">
                                           {user?.email}
                                        </p>
                                        <button
                                            onClick={() => router.replace('/pengguna/edit')}
                                            className="bg-white border  hover:cursor-pointer border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                                            title="Edit Profile"
                                        >
                                            <i className="fas fa-edit mr-2"></i>Edit Profile
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Stats */}
                <div className="grid grid-cols-3 lg:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-lg shadow-md p-4 text-center">
                        <div className="text-2xl font-bold text-primary mb-1">15</div>
                        <div className="text-gray-600 text-sm">Total Pesanan</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-4 text-center">
                        <div className="text-2xl font-bold text-green-600 mb-1">12</div>
                        <div className="text-gray-600 text-sm">Selesai</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-4 text-center">
                        <div className="text-2xl font-bold text-yellow-600 mb-1">2</div>
                        <div className="text-gray-600 text-sm">Dalam Proses</div>
                    </div>
                </div>

                {/* Menu Sections */}
                <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-4">
                    {/* Account Management */}
                    <div className="bg-white rounded-lg shadow-md">
                        <div className="p-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800">
                                <i className="fas fa-user-cog mr-2 text-primary"></i>Manajemen Akun
                            </h3>
                        </div>
                        <div className="divide-y divide-gray-200">
                            <MenuItem icon="fas fa-edit" label="Edit Profile" link="/pengguna/edit" />
                            <MenuItem icon="fas fa-map-marker-alt" label="Alamat Saya" link="/pengguna/alamat" />
                            <MenuItem icon="fas fa-shield-alt" label="Keamanan" link="/pengguna/ganti-password" />
                        </div>
                    </div>

                    {/* Orders & Shopping */}
                    <div className="bg-white rounded-lg shadow-md">
                        <div className="p-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800">
                                <i className="fas fa-shopping-bag mr-2 text-primary"></i>Belanja & Pesanan
                            </h3>
                        </div>
                        <div className="divide-y divide-gray-200">
                            <MenuItem icon="fas fa-list-alt" label="Riwayat Pesanan" link="/pesanan" />
                            <MenuItem icon="fas fa-shopping-cart" label="Keranjang" link="/keranjang" />
                        </div>
                    </div>

                    {/* Support & Info */}
                    <div className="bg-white rounded-lg shadow-md">
                        <div className="p-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800">
                                <i className="fas fa-info-circle mr-2 text-primary"></i>Bantuan & Info
                            </h3>
                        </div>
                        <div className="divide-y divide-gray-200">
                            <MenuItem icon="fas fa-headset" label="Pusat Bantuan" link="#" />
                            <MenuItem icon="fas fa-file-alt" label="Syarat & Ketentuan" link="#" />
                            <MenuItem icon="fas fa-user-shield" label="Kebijakan Privasi" link="#" />
                        </div>
                    </div>

                    {/* Logout */}
                    <div className="bg-white rounded-lg shadow-md">
                        <button
                            onClick={logout}
                            className="w-full flex hover:cursor-pointer items-center justify-between p-4 text-red-600 hover:bg-red-50 transition-colors rounded-lg"
                        >
                            <div className="flex items-center">
                                <i className="fas fa-sign-out-alt w-5"></i>
                                <span className="ml-3 font-medium">Keluar</span>
                            </div>
                            <i className="fas fa-chevron-right"></i>
                        </button>
                    </div>
                </div>
            </main>

            {/* <!-- Footer --> */}
            <footer className="bg-gray-800 text-white py-12 mt-16">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-xl font-bold mb-4">Sleman Mart</h3>
                            <p className="text-gray-300">
                                Platform e-commerce untuk UMKM di Sleman yang mendukung produk
                                lokal berkualitas.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Link Cepat</h4>
                            <ul className="space-y-2">
                                <li>
                                    <Link href="/" className="text-gray-300 hover:text-primary"
                                    >Produk</Link                                    >
                                </li>
                                <li>
                                    <a
                                        href="categories.html"
                                        className="text-gray-300 hover:text-primary">Kategori</a>
                                </li>
                                <li>
                                    <Link href="#" className="text-gray-300 hover:text-primary" >Penjual</Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Bantuan</h4>
                            <ul className="space-y-2">
                                <li>
                                    <Link href="#" className="text-gray-300 hover:text-primary"
                                    >Pusat Bantuan</Link                                    >
                                </li>
                                <li>
                                    <Link href="" className="text-gray-300 hover:text-primary"
                                    >Kontak</Link                                    >
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Hubungi Kami</h4>
                            <p className="text-gray-300 mb-2">Email: info@slemanmart.com</p>
                            <p className="text-gray-300 mb-4">Telepon: (0274) 123-4567</p>
                        </div>
                    </div>
                    <div
                        className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300"
                    >
                        <p>&copy; 2025 Sleman Mart. Semua hak cipta dilindungi.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

interface MenuItemProps {
    icon: string;
    label: string;
    link: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, label, link }) => {

    return (
        <Link href={link} className="w-full">
            <button
            type="button"
                className=" text-left w-full  hover:cursor-pointer flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
                <div className="flex items-center">
                    <i className={`${icon} text-gray-500 w-5`}></i>
                    <span className="ml-3 text-gray-800">{label}</span>
                </div>
                <i className="fas fa-chevron-right text-gray-400"></i>
            </button>
        </Link>
    )

   
};