import OrderList from "@/components/features/order/OrderList";
import ContactSection from "@/components/landing/Contact";
import Footer from "@/components/layout/Footer";
import { AnimatedWrapper } from "@/components/shared/AnimateWrapper";
import { Navbar } from "@/components/shared/Navbar";
import Link from "next/link";

export default function OrderPage() {
    return (
        <div>
            <Navbar isAuth withMenu={false}/>
            <div className="container mx-auto px-4 py-4 sm:py-8 md:px-10">
                {/* <!-- Breadcrumb --> */}
                <nav className="mb-4 sm:mb-6">
                    <ol
                        className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500 overflow-x-auto whitespace-nowrap"
                    >
                        <li>
                            <Link href="/" className="hover:text-primary flex-shrink-0"
                            >Beranda</Link>
                        </li>
                        <li><i className="fas fa-chevron-right text-xs flex-shrink-0"></i></li>
                        <li>
                            <Link href="/pengguna" className="hover:text-primary flex-shrink-0"
                            >Dashboard</Link>
                        </li>
                        <li><i className="fas fa-chevron-right text-xs flex-shrink-0"></i></li>
                        <li className="text-gray-900 truncate">Pesanan Saya</li>
                    </ol>
                </nav>




                {/* <!-- Page Header --> */}
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                        Pesanan Saya
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600">
                        Kelola dan lacak semua pesanan Anda
                    </p>
                </div>


                <div className="grid lg:grid-cols-4 gap-4 sm:gap-8">
                    {/* <!-- Order Filters --> */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                            <h3 className="text-base sm:text-lg font-semibold mb-4">
                                Filter Pesanan
                            </h3>

                            {/* <!-- Status Filter --> */}
                            <div className="mb-4 sm:mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2"
                                >Status Pesanan</label>
                                <select
                                    id="statusFilter"
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="">Semua Status</option>
                                    <option value="pending">Menunggu Konfirmasi</option>
                                    <option value="processing">Diproses</option>
                                    <option value="packed">Dikemas</option>
                                    <option value="shipped">Dikirim</option>
                                    <option value="completed">Selesai</option>
                                    <option value="cancelled">Dibatalkan</option>
                                </select>
                            </div>

                            {/* <!-- Date Range --> */}
                            <div className="mb-4 sm:mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2"
                                >Periode</label>
                                <div className="space-y-2">
                                    <input
                                        type="date"
                                        id="startDate"
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                    <input
                                        type="date"
                                        id="endDate"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                            </div>

                            {/* <!-- Search --> */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2"
                                >Cari Pesanan</label>
                                <input
                                    type="text"
                                    id="searchOrder"
                                    placeholder="Nomor pesanan atau nama produk"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <button
                                // onclick="applyFilters()"
                                className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition duration-300"
                            >
                                <i className="fas fa-filter mr-2"></i>Terapkan Filter
                            </button>
                        </div>
                    </div>


                    {/* <!-- Orders List --> */}
                    
                            <OrderList />
                    
                </div>
            </div>



            <AnimatedWrapper>
                <Footer />
            </AnimatedWrapper>


        </div>
    )
}