import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import Link from "next/link";

const products = [
  { name: "Kursi Sofa Minimalis", price: "33.000", seller: "Anthon's, Pedalaman", image: "/placeholder.svg" },
  { name: "Kursi Merah Elegan", price: "33.000", seller: "Anthon's, Pedalaman", image: "/placeholder.svg" },
  { name: "Sofa Pink Nyaman", price: "33.000", seller: "Anthon's, Pedalaman", image: "/placeholder.svg" },
  { name: "Kursi Abu Modern", price: "33.000", seller: "Anthon's, Pedalaman", image: "/placeholder.svg" },
  // Tambah 4 produk lagi untuk total 8
  { name: "Kursi Merah Elegan", price: "33.000", seller: "Anthon's, Pedalaman", image: "/placeholder.svg" },
  { name: "Sofa Pink Nyaman", price: "33.000", seller: "Anthon's, Pedalaman", image: "/placeholder.svg" },
  { name: "Kursi Abu Modern", price: "33.000", seller: "Anthon's, Pedalaman", image: "/placeholder.svg" },
  { name: "Kursi Sofa Minimalis", price: "33.000", seller: "Anthon's, Pedalaman", image: "/placeholder.svg" },
];

export default function ProductsSection() {
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
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-6">
              {products.map((product, index) => (
                <Link key={index}  href={"/barang/121"}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="relative w-full aspect-square ">
                      <img src={"https://d2xjmi1k71iy2m.cloudfront.net/dairyfarm/id/images/198/1319859_PE941002_S4.jpg"}/>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col items-start p-4">
                    <h3 className="font-semibold text-base">{product.name}</h3>
                    <p className="text-green-500 font-bold mt-1">Rp. {product.price}</p>
                    <p className="text-xs text-gray-500 mt-2">{product.seller}</p>
                  </CardFooter>
                </Card>
                </Link>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="popular">
            {/* Konten untuk produk terlaris bisa ditaruh di sini */}
            <p className="mt-6 text-center">Produk terlaris akan segera hadir!</p>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}