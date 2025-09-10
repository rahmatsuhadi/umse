"use client"
import { usePaginationStores } from "@/features/store/hooks";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import StoreSkeletonCard from "./StoreSkeletonCard";
import { StoreCard } from "./StoreCard";
import StorePagination from "./StorePagination";


export default function StoresListPagination() {

  const searchParams = useSearchParams()

  const page = Number(searchParams.get('page') || 1)


  const { isLoading, data } = usePaginationStores(page)

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


        {/* Paginasi Manual dengan Skeleton UI */}
        <StorePagination isLoading={isLoading} meta={data?.meta}/>

      </div>
    </section>
  );
}
