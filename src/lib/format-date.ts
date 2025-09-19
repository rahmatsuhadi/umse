export const formatDate = (dateStr: string) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    // timeZone: 'UTC',
    minute: "2-digit",
  });
};





/**
 * Mengubah string tanggal (seperti "2016-03-20") menjadi format yang mudah dibaca.
 * Contoh: "20 Maret 2016"
 * @param dateString String tanggal yang akan diformat.
 * @returns Tanggal yang sudah diformat atau pesan error jika tidak valid.
 */
export const formatDateOnly = (dateString: string | null | undefined): string => {
  if (!dateString) {
    return "Tanggal tidak tersedia";
  }

  try {
    const date = new Date(dateString);

    const formatter = new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',   // -> 20
      month: 'long',    // -> Maret
      year: 'numeric',  // -> 2016
      timeZone: 'UTC', // Tambahkan ini agar tidak ada masalah pergeseran hari karena timezone
    });

    return formatter.format(date);
    
  } catch (error) {
    console.error("Error memformat tanggal:", error);
    return "Format tanggal salah";
  }
};