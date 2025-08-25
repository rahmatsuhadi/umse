"use client"
import { useStores } from "@/features/store/hooks";
import Image from "next/image";
import Link from "next/link";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import { Skeleton } from "../ui/skeleton";

export default function StoresSection() {
  const { data, isLoading } = useStores({ per_page: 4 })

  const umkmstores = data?.data || []

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">

        <Carousel>
          <CarouselContent>
            {isLoading ? [...Array(4)].map((_, index) => (
              <CarouselItem key={index} className=" basis-1/2 md:basis-1/3 lg:basis-1/4">

                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <Skeleton className="mx-auto mb-4 w-[80px] h-[80px] rounded-full" />
                  <Skeleton className="mx-auto h-[10] w-[120px] mb-2" />
                  <Skeleton className="mx-auto  h-[20px] w-[150px] mb-2" />
                  <Skeleton className="mx-auto h-[10px] w-[100px]" />
                </div>
              </CarouselItem>
            )) : umkmstores.length == 0 ? (
              <></>

            ) : umkmstores.map((store, i) => (

              <CarouselItem key={i} className=" basis-1/2 md:basis-1/3 lg:basis-1/4">
                <div key={store.name} className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-lg transition duration-300">
                  <div className="bg-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    {/* <i className="fas fa-store text-white text-xl"></i> */}
                    <Image className="rounded-full" src={store.logo_url} alt="logo-store" width={100} height={100} />
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2">{store.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{store.brand_name}</p>
                  <p className="text-xs text-gray-500">{store.address}</p>
                  <div className="flex items-center justify-center mt-3">
                    <div className="flex items-center text-yellow-400 mr-2">
                      <i className="fas fa-star text-xs"></i>
                      <span className="text-gray-600 text-xs ml-1">{store.average_rating}</span>
                    </div>
                    <span className="text-xs text-gray-500">{store.products_count} Produk</span>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>


        <div className="text-center mt-8">
          <Link href="#" className="bg-primary text-white px-6 py-3 rounded-full font-medium hover:bg-primary-dark transition duration-300">
            <i className="fas fa-building mr-2"></i>Lihat Semua Toko UMKM
          </Link>
        </div>
      </div>
    </section>
  )
}