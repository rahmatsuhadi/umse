
import Footer from "@/components/layout/Footer";
import OrderFilter from "@/components/orders/OrderFilter";
import OrderList from "@/components/orders/OrderList";
import { AnimatedWrapper } from "@/components/shared/AnimateWrapper";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { Navbar } from "@/components/shared/Navbar";

export default function OrderPage() {
    return (
        <div className=" w-full min-h-screen">
            <Navbar withMenu={false} />

            <Breadcrumb breadcrumbs={[{
                name: 'Beranda',
                link: '/'
            }, {
                name: 'Pesanan Saya',
                link: '/pesanan',
                active: true
            }]} />
            <main className="container mx-auto px-4 py-6">





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
                    <OrderFilter />

                    {/* <!-- Orders List --> */}

                    <OrderList />

                </div>


            </main>



            <AnimatedWrapper className="mt-15" >
                <Footer />
            </AnimatedWrapper>


        </div>
    )
}