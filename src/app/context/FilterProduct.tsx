"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface Filters {
  categorySlugs: string[];  // sekarang array
  minPrice: string;
  maxPrice: string;
  productName: string;
}

interface FilterContextType {
  filters: Filters;
  params: string;
  updateFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  toggleCategorySlug: (slug: string) => void;  // tambahan fungsi untuk toggle kategori
}

const defaultFilters: Filters = {
  categorySlugs: [],
  minPrice: "",
  maxPrice: "",
  productName: "",
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [params, setParams] = useState<string>("");
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return; // jangan update URL saat mount pertama
    }
    const params = new URLSearchParams();


    if (filters.categorySlugs.length > 0)
      params.set("category", filters.categorySlugs.join(","));
    if (filters.minPrice) params.set("minPrice", filters.minPrice);
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
    if (filters.productName) params.set("productName", filters.productName);

    const queryString = params.toString();
    // router.replace(queryString ? `?${queryString}` : "/", { scroll: false });
    setParams(queryString ? `?${queryString}` : "/")

  }, [filters, router]);

  const [initialLoadDone, setInitialLoadDone] = useState(false);

  useEffect(() => {
    if (!initialLoadDone) {
      const categorySlugs = searchParams.get("category")?.split(",") || [];
      const minPrice = searchParams.get("minPrice") || "";
      const maxPrice = searchParams.get("maxPrice") || "";
      const productName = searchParams.get("productName") || "";

      setFilters({ categorySlugs, minPrice, maxPrice, productName });
      setInitialLoadDone(true);
    }
  }, [initialLoadDone, searchParams]);

  function updateFilter<K extends keyof Filters>(key: K, value: Filters[K]) {
    const newFilters = { ...filters, [key]: value };

    setFilters(newFilters);


    const params = new URLSearchParams();

    // Kalau semua filter kosong, jangan set query apapun
    const hasFilters =
      newFilters.categorySlugs.length > 0 ||
      (newFilters.minPrice !== "" && newFilters.minPrice !== null && newFilters.minPrice !== undefined) ||
      (newFilters.maxPrice !== "" && newFilters.maxPrice !== null && newFilters.maxPrice !== undefined) ||
      (newFilters.productName !== "" && newFilters.productName !== null && newFilters.productName !== undefined);

    if (hasFilters) {
      if (newFilters.categorySlugs.length > 0)
        params.set("category", newFilters.categorySlugs.join(","));
      if (newFilters.minPrice) params.set("minPrice", newFilters.minPrice);
      if (newFilters.maxPrice) params.set("maxPrice", newFilters.maxPrice);
      if (newFilters.productName) params.set("productName", newFilters.productName);

      setParams(`?${params.toString()}`)
      // router.replace(`?${params.toString()}`);

    } else {
      setParams("?")
      // Kalau kosong semua, hapus query string (ke homepage tanpa query)
      // router.replace(`/`);
    }
  }


  // Fungsi toggle kategori di array categorySlugs
  function toggleCategorySlug(slug: string) {
    setFilters((prev) => {
      if (prev.categorySlugs.includes(slug)) {
        return {
          ...prev,
          categorySlugs: prev.categorySlugs.filter((s) => s !== slug),
        };
      } else {
        return {
          ...prev,
          categorySlugs: [...prev.categorySlugs, slug],
        };
      }
    });
  }

  return (
    <FilterContext.Provider value={{ filters, params, updateFilter, toggleCategorySlug }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilter(): FilterContextType {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilter must be used within a FilterProvider");
  }
  return context;
}
