import { useDebounce } from "@/lib/hooks/useDebounce";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { apiClient } from "@/lib/api-client";
import { Loader2, Search } from "lucide-react";
import { useOrganizations } from "@/features/organization/hooks";

interface ReponseUPD {
  nama_badan_usaha: string;
  jenis_badan_usaha: string;
}

interface SelectASNApiSearchProps {
  onChange?: (value: string) => void;
  disabled?: boolean;
}

export default function SelectASNApiSearch({
  disabled = false,
  onChange,
}: SelectASNApiSearchProps) {
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data, isLoading: loading } = useOrganizations(debouncedSearchTerm);
  const options = data || [];

  const handleValueChange = (value: string) => {
    setSelectedValue(value);
    if (onChange) onChange(value);
  };

  return (
    <Select value={selectedValue} onValueChange={handleValueChange}>
      <SelectTrigger className="w-full py-5">
        <SelectValue placeholder="Pilih Badan Usaha" />
      </SelectTrigger>

      <SelectContent className="px-3 py-2">
        {/* Input pencarian */}
        <div className="sticky top-0 bg-white pb-3 z-10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              className="w-full pl-9 pr-9 py-2 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              placeholder="Cari Badan Usaha..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {loading && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 animate-spin h-4 w-4" />
            )}
          </div>
        </div>

        {/* Hasil pencarian */}
        <div className="max-h-60 overflow-y-auto">
          {options.length > 0 ? (
            options.map((option) => (
              <SelectItem key={option.id} value={String(option.id)}>
                {option.name}
              </SelectItem>
            ))
          ) : (
            <div className="px-3 py-2 text-sm text-gray-500">
              Tidak ada hasil
            </div>
          )}
        </div>
      </SelectContent>
    </Select>
  );
}
