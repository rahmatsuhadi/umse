'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import Image from "next/image";


interface Product{
  id: string;
  name: string;
  seller: string;
  price: number;
  stock: number;
  location: string;
  images: string[];
}

export default function ProductActionCard({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (amount: number) => {
    const newQuantity = quantity + amount;
    // Pastikan kuantitas tidak kurang dari 1 atau melebihi stok
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const subtotal = product.price * quantity;
  const formattedSubtotal = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(subtotal);


  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Atur Jumlah dan Catatan</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 rounded-md overflow-hidden border">
             <img src={product.images[0]} alt={product.name} 
            //  fill
              className="object-cover" />
          </div>
          <div>
            <p className="font-semibold">{product.name}</p>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="flex items-center justify-between">
          {/* Quantity Selector */}
          <div className="flex items-center border rounded-lg">
            <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(-1)}>
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-12 text-center font-bold">{quantity}</span>
            <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(1)}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm">Stok: <span className="font-bold">{product.stock}</span></p>
        </div>

        <div className="flex justify-between items-center mt-6">
          <p className="text-slate-600">Subtotal</p>
          <p className="font-bold text-lg">{formattedSubtotal}</p>
        </div>
        
        <div className="mt-6 flex flex-col gap-3">
          <Button size="lg" className="bg-primary hover:bg-pink-700">
            <ShoppingCart className="h-5 w-5 mr-2" />
            Keranjang
          </Button>
          <Button size="lg" variant="outline" className="border-pribg-primary text-pribg-primary hover:bg-pink-50 hover:text-pribg-primary">
            Beli Langsung
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}