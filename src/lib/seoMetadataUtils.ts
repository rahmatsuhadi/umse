// lib/seoMetadataUtils.ts

// Fungsi untuk membersihkan tag HTML
export function cleanDescription(description: string): string {
    // Menghapus semua tag HTML
    return description.replace(/<[^>]*>/g, '').trim();
}

// Fungsi untuk memangkas deskripsi jika terlalu panjang
export function trimDescription(description: string, maxLength: number = 160): string {
    const cleanedDescription = cleanDescription(description);

    // Memangkas di batas kata jika panjangnya melebihi limit
    if (cleanedDescription.length > maxLength) {
        const trimmed = cleanedDescription.substring(0, maxLength);
        const lastSpace = trimmed.lastIndexOf(' '); // Memotong di akhir kata
        return trimmed.substring(0, lastSpace) + '...';
    }

    return cleanedDescription;
}

