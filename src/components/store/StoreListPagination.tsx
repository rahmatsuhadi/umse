"use client"
import { usePaginationStores } from "@/features/store/hooks";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";
import { useRouter, useSearchParams } from "next/navigation";


export default function ListStoresPaginationSection() {

  const searchParams = useSearchParams()

  const page = Number(searchParams.get('page') || 1)


  const { isLoading, data } = usePaginationStores(page)

  const umkmstores = data?.data ?? []

  const router = useRouter()


  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        {/* Grid Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {isLoading
            ? [...Array(4)].map((_, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 text-center">
                <Skeleton className="mx-auto mb-4 w-[80px] h-[80px] rounded-full" />
                <Skeleton className="mx-auto h-4 w-[120px] mb-2" />
                <Skeleton className="mx-auto h-5 w-[150px] mb-2" />
                <Skeleton className="mx-auto h-3 w-[100px]" />
              </div>
            ))
            : umkmstores.map((store, i) => (
              <Link key={store.id ?? i} href={"/umkm/" + store.id}>
                <div className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-lg transition duration-300">
                  <div className="bg-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Image
                      className="rounded-full"
                      src={store.logo_url}
                      alt="logo-store"
                      width={100}
                      height={100}
                    />
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2">{store.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{store.brand_name}</p>
                  <p className="text-xs text-gray-500">{store.address}</p>
                  <div className="flex items-center justify-center mt-3">
                    <div className="flex items-center text-yellow-400 mr-2">
                      <i className="fas fa-star text-xs"></i>
                      <span className="text-gray-600 text-xs ml-1">
                        {store.average_rating}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {store.products_count} Produk
                    </span>
                  </div>
                </div>
              </Link>
            ))}
        </div>


        {/* Paginasi Manual dengan Skeleton UI */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2">
            {/* Cek apakah data masih loading */}
            {isLoading ? (
              // Skeleton UI untuk pagination
              [...Array(3)].map((_, i) => (
                <Skeleton key={i} className="w-16 h-10 bg-gray-300 rounded-md" />
              ))
            ) : (
              // Tombol Paginasi Sebenarnya
              data?.meta.links.map((link, i) => {
                const isNextButton = link.label === "Next &raquo;";
                const isPrevButton = link.label === "&laquo; Previous";
                const isActive = link.active;
                const isLastPage = data.meta.current_page === data.meta.last_page;

                return (
                  <button
                    key={i}
                    onClick={() => router.push(`?page=${link.page}`, { scroll: false })}
                    disabled={
                      // Disable "Next" when it's on the last page or if it's the current active page
                      (isNextButton && isLastPage) || (isPrevButton && data.meta.current_page === 1)
                    }
                    className={` px-4 py-2 ${isActive ? "bg-primary text-white" : "bg-gray-200  hover:bg-gray-300 text-gray-700"} hover:scale-105 disabled:transition-none disabled:scale-100 transition-all disabled:bg-gray-300 rounded focus:cursor-pointer`}
                  >
                    {/* Mengganti label tombol */}
                    {link.label === "&laquo; Previous" ? "Sebelumnya" : link.label === "Next &raquo;" ? "Berikutnya" : link.label}
                  </button>
                );
              })
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
