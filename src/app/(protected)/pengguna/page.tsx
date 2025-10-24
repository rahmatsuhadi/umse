"use client";
import Footer from "@/components/layout/Footer";
import { Navbar } from "@/components/shared/Navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLogout, useUser } from "@/features/auth/hooks";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PesananPage() {
  const router = useRouter();

  const { data } = useUser();

  const { mutate: handleLogout } = useLogout();

  const user = data?.data;

  const logout = () => {
    handleLogout();
    // Implementasi logout

    // Redirect ke login
  };

  return (
    <div className="bg-gray-50 ">
      <Navbar />

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
                  <Avatar className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 lg:w-44 lg:h-44 mb-2 border-4 border-gray-200">
                    <AvatarImage
                      src={user?.profile_url}
                      alt="Profile"
                      width={400}
                      height={400}
                      className="object-cover w-full h-full"
                    />
                    <AvatarFallback>
                      <i className="fas fa-user text-3xl md:text-5xl"></i>
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* User Info */}
                <div className="text-center flex-1">
                  <div className="mb-2">
                    <h1
                      id="userName"
                      className="text-2xl font-bold text-gray-800 mb-1"
                    >
                      {user?.name}
                    </h1>
                    <p id="userEmail" className="text-gray-600 mb-3">
                      {user?.email}
                    </p>
                    <button
                      onClick={() => router.replace("/pengguna/edit")}
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
        {/* <div className="grid grid-cols-3 lg:grid-cols-3 gap-4 mb-6">
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
                </div> */}

        {/* Menu Sections */}
        <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-4">
          {/* Account Management */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                <i className="fas fa-user-cog mr-2 text-primary"></i>Manajemen
                Akun
              </h3>
            </div>
            <div className="divide-y divide-gray-200">
              <MenuItem
                icon="fas fa-edit"
                label="Edit Profile"
                link="/pengguna/edit"
              />
              <MenuItem
                icon="fas fa-map-marker-alt"
                label="Alamat Saya"
                link="/pengguna/alamat"
              />
              <MenuItem
                icon="fas fa-shield-alt"
                label="Keamanan"
                link="/pengguna/ganti-password"
              />
            </div>
          </div>

          {/* Orders & Shopping */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                <i className="fas fa-shopping-bag mr-2 text-primary"></i>Belanja
                & Pesanan
              </h3>
            </div>
            <div className="divide-y divide-gray-200">
              <MenuItem
                icon="fas fa-list-alt"
                label="Riwayat Pesanan"
                link="/pesanan"
              />
              <MenuItem
                icon="fas fa-shopping-cart"
                label="Keranjang"
                link="/keranjang"
              />
            </div>
          </div>

          {/* Support & Info */}
          {/* <div className="bg-white rounded-lg shadow-md">
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
                    </div> */}

          {/* Logout */}
          <div className="">
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
        </div>
      </main>

      {/* <!-- Footer --> */}
      <Footer />
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
  );
};
