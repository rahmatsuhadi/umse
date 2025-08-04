import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";

// Tipe data untuk props agar lebih mudah digunakan
type ReviewCardProps = {
  averageRating: number;
  totalReviews: number;
  detailedRatings: {
    label: string;
    count: number;
    value: number; // nilai progress bar (0-100)
  }[];
};

export default function ReviewCard({
  averageRating,
  totalReviews,
  detailedRatings,
}: ReviewCardProps) {
  return (
    <div className="w-full  p-4">
      <h2 className="text-2xl font-bold mb-6">Ulasan</h2>
       <p className="text-lg mb-2">Rating Keseluruhan</p>
      {/* Ringkasan Ulasan */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center">
        
        {/* Kiri: Rating Keseluruhan */}
        <div className="md:col-span-1">
          <Card className="bg-slate-50 border-slate-200 p-6 text-center dark:bg-slate-900 dark:border-slate-800">
            <CardContent className="p-0">
             
              <p className="text-6xl font-bold my-2 text-slate-900 dark:text-slate-50">{averageRating}</p>
              <div className="flex justify-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-6 w-6 ${
                      i < Math.round(averageRating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-slate-500 mt-2 dark:text-slate-400">
                of {totalReviews} reviews
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Kanan: Detail Rating */}
        <div className="md:col-span-4 space-y-4">
          <p className="font-semibold">Detail Rating</p>
          {detailedRatings.map((item) => (
            <div key={item.label} className="flex items-center gap-4 text-sm">
              <p className="w-28 text-slate-600 dark:text-slate-400">{item.label}</p>
              <Progress value={item.value} className="w-full h-2 bg-yellow-200 [&>div]:bg-yellow-400" />
              <span className="font-medium text-slate-500 w-8 text-right dark:text-slate-400">{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Form Komentar */}
      <div className="mt-10">
         <Textarea placeholder="Beri Komentar..." />
      </div>
    </div>
  );
}