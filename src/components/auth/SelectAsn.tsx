import { useDebounce } from "@/lib/hooks/useDebounce";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface ReponseUPD {
  nama_badan_usaha: string;
  jenis_badan_usaha: string;
}

export default function SelectASNApiSearch() {
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>(""); // State untuk input pencarian
  const [options, setOptions] = useState<ReponseUPD[]>([]); // State untuk menyimpan opsi dari API
  const [loading, setLoading] = useState<boolean>(false); // State untuk menampilkan loading

  // Menggunakan hook useDebounce untuk mendapatkan nilai yang sudah di-debounce
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // Menunggu 500ms sebelum memanggil API

  // Fungsi untuk memanggil API berdasarkan nama usaha yang dicari
  const fetchOptions = async (term: string) => {
    setLoading(true); // Menandakan API sedang dipanggil

    const url = term
      ? `/api/upd?search=${term}` // Pencarian dengan kata kunci
      : `/api/upd`; // Mengambil semua data jika tidak ada kata kunci

    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setOptions(data); // Menyimpan hasil pencarian ke dalam state options
      } else {
        console.error("Error fetching data");
        setOptions([]);
      }
    } catch (error) {
      console.error("Error fetching options:", error);
      setOptions([]);
    } finally {
      setLoading(false); // Menandakan bahwa pemanggilan API telah selesai
    }
  };

  useEffect(() => {
    fetchOptions(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  return (
    <Select value={selectedValue} onValueChange={setSelectedValue}>
      <SelectTrigger className="w-full py-5 rounded-xl">
        <SelectValue placeholder="Pilih Badan Usaha" />
      </SelectTrigger>
      <SelectContent>
        {/* Input pencarian */}
        <div className="px-3 py-2">
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            placeholder="Cari Badan Usaha..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Update pencarian
          />
        </div>

        {/* Tampilkan loading saat data sedang diambil */}
        {loading && <div className="px-3 py-2 text-gray-500">Mencari...</div>}

        {/* Menampilkan hasil pencarian */}
        {options.length > 0 ? (
          options.map((option, index) => (
            <SelectItem key={index} value={option.nama_badan_usaha}>
              {option.nama_badan_usaha}
            </SelectItem>
          ))
        ) : (
          // Menampilkan pesan jika tidak ada hasil
          <div className="px-3 py-2 text-gray-500">Tidak ada hasil</div>
        )}
      </SelectContent>
    </Select>
  );
}
