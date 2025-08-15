"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import Link from "next/link";


const products = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    name: 'Keripik Tempe Original',
    category: 'Makanan',
    store: 'Toko Cemilan Sleman',
    location: 'Jl. Magelang KM 5, Sleman',
    price: 15000,
    stock: 25,
    rating: 4.5,
}));

function ProductsSectionOld() {
    return (
        <section className="py-12 ">
            <div className="container mx-auto px-4">
                <Tabs defaultValue="new">
                    <TabsList className="grid bg-transparent w-full grid-cols-2 md:w-1/4">
                        {/* Tombol Tab "Produk Baru" */}
                        <TabsTrigger
                            value="new"
                            className="
            text-muted-foreground border-0 data-[state=active]:text-primary 
            text-lg font-semibold  data-[state=active]:bg-transparent bg-transparent rounded-none px-4 py-2
            border-b-4 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none
            shadow-none focus-visible:ring-0
          "
                        >
                            Produk Baru
                        </TabsTrigger>

                        {/* Tombol Tab "Terlaris" */}
                        <TabsTrigger
                            value="popular"
                            className="
             text-muted-foreground border-0 data-[state=active]:text-primary 
            text-lg font-semibold  data-[state=active]:bg-transparent bg-transparent rounded-none px-4 py-2
            border-b-4 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none
            shadow-none focus-visible:ring-0
          "
                        >
                            Terlaris
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="new">

                    </TabsContent>
                    <TabsContent value="popular">
                        {/* Konten untuk produk terlaris bisa ditaruh di sini */}
                        <p className="mt-6 text-center">Produk terlaris akan segera hadir!</p>
                    </TabsContent>
                </Tabs>
            </div>

            {/* ===== Pagination ===== */}

            <ButtonLoadMore />

        </section>
    );
}


const ProductSection = () => {
    return (
        <section className="py-12 ">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-6">
                    {products.map((product, index) => (
                        <Link key={index} href={"/p/121"}>
                            <CardProduct
                                product={product}
                            />
                        </Link>
                    ))}
                </div>

                {/* <Pagination/> */}
                <ButtonLoadMore />
            </div>
        </section>
    )
}

export default ProductSection



interface CardProductProps {
    product: {
        name: string
        store: string
        location: string
        category: string
        price: number
        stock: number
        rating: number
    }
}

const CardProduct = ({ product }: CardProductProps) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300 group h-full flex flex-col">
            <div className="bg-gray-300 h-40 md:h-48 flex items-center justify-center relative">
                {/* <i className="fas fa-image text-gray-500 text-2xl md:text-3xl"></i> */}
                <Image objectFit="cover" layout="fill"
                    alt={product.name} className="absolute inset-0 object-cover"
                    src="/hero.png" />
            </div>
            <div className="p-4 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-2">
                    <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">{product.category}</span>
                    <div className="flex items-center text-yellow-400"><i className="fas fa-star text-xs"></i><span className="text-gray-600 text-xs ml-1">{product.rating}</span></div>
                </div>
                <h3 className="font-bold text-gray-800 mb-1 text-sm md:text-base group-hover:text-primary">{product.name}</h3>
                <p className="text-xs text-gray-600 mb-1">{product.store}</p>
                <p className="text-xs text-gray-500 mb-3">{product.location}</p>
                <div className="flex items-center justify-between mt-auto">
                    <div><span className="text-primary font-bold text-sm md:text-lg">Rp {product.price.toLocaleString('id-ID')}</span><p className="text-xs text-gray-500">Stok: {product.stock}</p></div>
                    <button onClick={(e) => { console.log(e) }} className="bg-primary text-white p-2 rounded-lg hover:bg-primary-dark transition duration-300"><i className="fas fa-shopping-cart text-sm"></i></button>
                </div>
            </div>
        </div>
    )
}


const Pagination = () => {
    return (
        <div className="flex justify-center my-8">
            <div className="flex items-center space-x-2">
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"><i className="fas fa-chevron-left"></i></button>
                <button className="px-4 py-2 bg-primary text-white rounded-lg">1</button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">2</button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">3</button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"><i className="fas fa-chevron-right"></i></button>
            </div>
        </div>
    )
}


const ButtonLoadMore = () => {
    return (
        <div className="flex justify-center my-8">
            <button type="button" className="bg-primary hover:cursor-pointer  text-white px-10 py-3 rounded-full font-medium hover:bg-primary-dark transition duration-300">
                Lihat Selengkapnya
            </button>
        </div>


    );
}