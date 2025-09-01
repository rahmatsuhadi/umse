"use client"
import { useInfiniteStores } from "@/features/store/hooks";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";

export default function StoresSection() {
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteStores({ per_page: 4 }); // ambil 8 per page biar pas 4 kolom x 2 baris

  const umkmstores = data?.pages.flatMap((page) => page.data) ?? [];

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
                <Link key={store.id ?? i} href={"/toko/" + store.id}>
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

        {/* Tombol Load More */}
        {hasNextPage && (
          <div className="text-center mt-8">
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              type="button"
              className="bg-primary text-white px-6 py-3 rounded-full font-medium hover:bg-primary-dark transition duration-300 disabled:opacity-50"
            >
              {isFetchingNextPage ? "Memuat Toko..." : "Lihat Toko UMKM Lagi"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
