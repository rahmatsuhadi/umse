"use client"
import React, { useState } from "react";
import { Input } from "../ui/input";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";


export default function FilterBar() {


    const [isFilterModalOpen, setFilterModalOpen] = useState(false);
    const [isSortModalOpen, setSortModalOpen] = useState(false);

    const sortOptions = ["Terpopuler", "Terbaru", "Harga Terendah", "Harga Tertinggi", "Rating Tertinggi", "Nama A-Z"];
const filterCategories = ["Semua Kategori", "Makanan & Minuman", "Fashion & Aksesoris", "Kerajinan Tangan", "Kecantikan & Kesehatan", "Pertanian Organik"];


    // Mencegah scroll body saat modal terbuka
    if (isFilterModalOpen || isSortModalOpen) {
        if (typeof window !== 'undefined') {
            document.body.style.overflow = "hidden";
        }
    } else {
        if (typeof window !== 'undefined') {
            document.body.style.overflow = "auto";
        }
    }




    return (
        <>
            <section className="py-3 bg-white border-b sticky top-0 z-40">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-3">
                        <div className="flex-1 relative">
                            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                            <Input type="text" placeholder="Cari produk..." className="w-full pl-10 pr-4 py-2 sm:py-3" />
                        </div>
                        <button onClick={() => setFilterModalOpen(true)} className="p-2 sm:p-3 border border-gray-300 rounded-lg hover:bg-gray-50"><i className="fas fa-filter text-gray-600"></i></button>
                        <button onClick={() => setSortModalOpen(true)} className="p-2 sm:p-3 border border-gray-300 rounded-lg hover:bg-gray-50"><i className="fas fa-sort-amount-down text-gray-600"></i></button>
                    </div>
                </div>
            </section>
            <Dialog open={isFilterModalOpen} onOpenChange={setFilterModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Filter Produk</DialogTitle>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <div>
                            <Label className="block text-sm font-medium mb-2">Kategori</Label>
                            <div className="space-y-2">
                                {filterCategories.map(cat => (
                                    <div key={cat} className="flex items-center">
                                        <Checkbox id={`filter-${cat}`} />
                                        <Label htmlFor={`filter-${cat}`} className="ml-2 text-sm font-normal">{cat}</Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <Label className="block text-sm font-medium mb-2">Rentang Harga</Label>
                            <div className="flex items-center space-x-2">
                                <Input type="number" placeholder="Min" />
                                <span>-</span>
                                <Input type="number" placeholder="Max" />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost">Reset</Button>
                        <Button onClick={() => setFilterModalOpen(false)}>Terapkan</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Sort Modal */}
            <Dialog open={isSortModalOpen} onOpenChange={setSortModalOpen}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Urutkan Produk</DialogTitle>
                    </DialogHeader>
                    <RadioGroup defaultValue="popular" className="py-4 space-y-2">
                        {sortOptions.map(opt => (
                            <div key={opt} className="flex items-center space-x-3">
                                <RadioGroupItem value={opt.toLowerCase().replace(' ', '-')} id={`sort-${opt}`} />
                                <Label htmlFor={`sort-${opt}`} className="font-normal">{opt}</Label>
                            </div>
                        ))}
                    </RadioGroup>
                    <DialogFooter>
                        <Button className="w-full" onClick={() => setSortModalOpen(false)}>Terapkan</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}