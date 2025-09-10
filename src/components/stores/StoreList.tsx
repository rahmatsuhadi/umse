"use client"
import { usePaginationStores } from "@/features/store/hooks";
import Link from "next/link";
import { StoreCard } from "../stores/StoreCard";
import StoreSkeletonCard from "../stores/StoreSkeletonCard";


export default function StoreList() {

  const { isLoading, data } = usePaginationStores(1)

  const umkmstores = data?.data ?? []


  const renderContent = () => {
    if (isLoading) {
      return (
        [...Array(4)].map((_, index) => (
          <StoreSkeletonCard key={index} />
        ))
      )
    }
    else {
      return (
        umkmstores.map((store, i) => (
          <Link key={store.id ?? i} href={"/umkm/" + store.id}>
            <StoreCard store={store} />
          </Link>
        ))
      )
    }
  }

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        {/* Grid Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {renderContent()}
        </div>
      </div>
      <div className="flex justify-center my-8">
        <Link href={"/umkm"} className="bg-primary hover:cursor-pointer  text-white px-10 py-3 rounded-full font-medium hover:bg-primary-dark transition duration-300">
          Lihat UMKM lainnya
        </Link>
      </div>
    </section>
  );
}
