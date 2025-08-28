import OrderFilter from "@/components/features/order/OrderFIlter";
import OrderList from "@/components/features/order/OrderList";
import Footer from "@/components/layout/Footer";
import { AnimatedWrapper } from "@/components/shared/AnimateWrapper";
import { Navbar } from "@/components/shared/Navbar";
import Link from "next/link";

export default function OrderPage() {
    return (
        <div>
            <Navbar withMenu={false} />
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
                   <OrderFilter/>


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