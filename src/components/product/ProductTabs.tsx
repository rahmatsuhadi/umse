import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import ReviewCard from "./ReviewCard";

const reviewData = {
  averageRating: 4.8,
  totalReviews: 125,
  detailedRatings: [
    { label: 'Bagus', count: 156, value: 85 },
    { label: 'Menakjubkan', count: 156, value: 95 },
    { label: 'Jelek', count: 156, value: 5 },
  ],
};

interface Product{
  id: string;
  name: string;
  reviews: {
    items: {
      id: number;
      user: string;
      rating: number;
      date: string;
      text: string;
      images: string[];
    }[];
  };
  
}

export default function ProductTabs({ product }: { product: Product }) {
  return (
    <Tabs defaultValue="reviews" className="w-full">
      <TabsList className="grid w-full grid-cols-2 md:w-1/3">
        <TabsTrigger value="detail">Detail</TabsTrigger>
        <TabsTrigger value="reviews">Ulasan</TabsTrigger>
      </TabsList>

      {/* KONTEN TAB DETAIL */}
      <TabsContent value="detail" className="mt-6">
        {/* ... (kode detail produk tidak berubah) ... */}
      </TabsContent>

      {/* KONTEN TAB ULASAN */}
      <TabsContent value="reviews" className="mt-6">
        <ReviewCard
          averageRating={reviewData.averageRating}
          totalReviews={reviewData.totalReviews}
          detailedRatings={reviewData.detailedRatings}
        />
        <Separator className="my-10" />

        {/* ====================================================== */}
        {/* BAGIAN BARU: DAFTAR ULASAN INDIVIDUAL                   */}
        {/* ====================================================== */}
        <div className="space-y-8">
          {product.reviews.items.map((review) => (
            <div key={review.id} className="flex flex-col bg-gray-100 px-3 py-2 rounded-xl">
              {/* Info Pengguna */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={`https://api.dicebear.com/8.x/adventurer/svg?seed=${review.user}`} />
                    <AvatarFallback>{review.user.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="font-bold">{review.user}</span>
                </div>
                <p className="text-xs text-slate-500">{review.date}</p>
              </div>

              {/* Konten Ulasan */}
              <div className="pl-16 mt-2"> {/* Padding kiri agar sejajar dengan nama */}
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                  ))}
                </div>
                <p className="mt-2 text-sm text-slate-600">{review.text}</p>

                {/* Gambar Ulasan (jika ada) */}
                {review.images && review.images.length > 0 && (
                  <div className="flex gap-2 mt-3">
                    {review.images.map((img: string, index: number) => (
                      <div key={index} className="relative w-20 h-20 rounded-md overflow-hidden">
                        <Image src={img} alt={`Review image ${index + 1}`} fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Tombol Lihat Selengkapnya */}
        <div className="text-center mt-10">
          <Button variant="outline" className="border-pink-600 py-6 text-pink-600 hover:bg-pink-50 hover:text-pink-600">
            Lihat Selengkapnya
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  );
}