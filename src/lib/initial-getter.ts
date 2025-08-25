
export function getInitials(fullName: string) {
    // Memecah nama lengkap menjadi array berdasarkan spasi
    const nameParts = fullName.split(' ');

    // Ambil hanya dua kata pertama (jika ada lebih dari 2 suku kata)
    const initials = nameParts.slice(0, 2)
        .map(part => part[0].toUpperCase()) // Ambil huruf pertama dan ubah ke kapital
        .join(''); // Gabungkan hasilnya menjadi string

    return initials;
}