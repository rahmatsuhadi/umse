import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const search = request.nextUrl.searchParams.get("q");

  if (search) {
    const result = UPD_SLEMAN.filter(
      (item) =>
        item.nama_badan_usaha.toLowerCase().includes(search.toLowerCase()) ||
        item.jenis_badan_usaha.toLowerCase().includes(search.toLowerCase()) ||
        item.status_operasional.toLowerCase().includes(search.toLowerCase())
    );

    return NextResponse.json(result);
  }

  return NextResponse.json(UPD_SLEMAN);
}

const UPD_SLEMAN = [
  {
    id: 1,
    nama_badan_usaha: "PT. ABC Industri",
    jenis_badan_usaha: "Perseroan Terbatas",
    status_operasional: "Aktif",
  },
  {
    id: 2,
    nama_badan_usaha: "CV. XYZ Perdagangan",
    jenis_badan_usaha: "Commanditaire Vennootschap",
    status_operasional: "Aktif",
  },
  {
    id: 3,
    nama_badan_usaha: "PT. Maju Jaya",
    jenis_badan_usaha: "Perseroan Terbatas",
    status_operasional: "Tidak Aktif",
  },
  {
    id: 4,
    nama_badan_usaha: "PT. Sumber Rejeki",
    jenis_badan_usaha: "Perseroan Terbatas",
    status_operasional: "Aktif",
  },
  {
    id: 5,
    nama_badan_usaha: "UD. Sukses Sejahtera",
    jenis_badan_usaha: "Usaha Dagang",
    status_operasional: "Aktif",
  },
  {
    id: 6,
    nama_badan_usaha: "PT. Tangguh Abadi",
    jenis_badan_usaha: "Perseroan Terbatas",
    status_operasional: "Aktif",
  },
  {
    id: 7,
    nama_badan_usaha: "CV. Prima Karya",
    jenis_badan_usaha: "Commanditaire Vennootschap",
    status_operasional: "Aktif",
  },
  {
    id: 8,
    nama_badan_usaha: "PT. Sejahtera Bersama",
    jenis_badan_usaha: "Perseroan Terbatas",
    status_operasional: "Tidak Aktif",
  },
  {
    id: 9,
    nama_badan_usaha: "PT. Global Mitra",
    jenis_badan_usaha: "Perseroan Terbatas",
    status_operasional: "Aktif",
  },
  {
    id: 10,
    nama_badan_usaha: "CV. Mandiri Abadi",
    jenis_badan_usaha: "Commanditaire Vennootschap",
    status_operasional: "Aktif",
  },
  {
    id: 11,
    nama_badan_usaha: "PT. Sinergi Karya",
    jenis_badan_usaha: "Perseroan Terbatas",
    status_operasional: "Aktif",
  },
  {
    id: 12,
    nama_badan_usaha: "UD. Rukun Sejahtera",
    jenis_badan_usaha: "Usaha Dagang",
    status_operasional: "Tidak Aktif",
  },
  {
    id: 13,
    nama_badan_usaha: "PT. Cipta Usaha",
    jenis_badan_usaha: "Perseroan Terbatas",
    status_operasional: "Aktif",
  },
  {
    id: 14,
    nama_badan_usaha: "CV. Jaya Sentosa",
    jenis_badan_usaha: "Commanditaire Vennootschap",
    status_operasional: "Aktif",
  },
  {
    id: 15,
    nama_badan_usaha: "PT. Sumber Lestari",
    jenis_badan_usaha: "Perseroan Terbatas",
    status_operasional: "Aktif",
  },
  {
    id: 16,
    nama_badan_usaha: "CV. Abadi Luhur",
    jenis_badan_usaha: "Commanditaire Vennootschap",
    status_operasional: "Aktif",
  },
  {
    id: 17,
    nama_badan_usaha: "PT. Maju Mandiri",
    jenis_badan_usaha: "Perseroan Terbatas",
    status_operasional: "Aktif",
  },
  {
    id: 18,
    nama_badan_usaha: "PT. Alam Semesta",
    jenis_badan_usaha: "Perseroan Terbatas",
    status_operasional: "Tidak Aktif",
  },
  {
    id: 19,
    nama_badan_usaha: "UD. Harapan Baru",
    jenis_badan_usaha: "Usaha Dagang",
    status_operasional: "Aktif",
  },
  {
    id: 20,
    nama_badan_usaha: "PT. Jaya Abadi",
    jenis_badan_usaha: "Perseroan Terbatas",
    status_operasional: "Aktif",
  },
  {
    id: 21,
    nama_badan_usaha: "CV. Lestari Jaya",
    jenis_badan_usaha: "Commanditaire Vennootschap",
    status_operasional: "Aktif",
  },
  {
    id: 22,
    nama_badan_usaha: "PT. Citra Alam",
    jenis_badan_usaha: "Perseroan Terbatas",
    status_operasional: "Aktif",
  },
  {
    id: 23,
    nama_badan_usaha: "CV. Merdeka Sejahtera",
    jenis_badan_usaha: "Commanditaire Vennootschap",
    status_operasional: "Aktif",
  },
  {
    id: 24,
    nama_badan_usaha: "PT. Karya Sukses",
    jenis_badan_usaha: "Perseroan Terbatas",
    status_operasional: "Aktif",
  },
  {
    id: 25,
    nama_badan_usaha: "PT. Artha Jaya",
    jenis_badan_usaha: "Perseroan Terbatas",
    status_operasional: "Aktif",
  },
  {
    id: 26,
    nama_badan_usaha: "UD. Bahagia Sentosa",
    jenis_badan_usaha: "Usaha Dagang",
    status_operasional: "Tidak Aktif",
  },
  {
    id: 27,
    nama_badan_usaha: "PT. Sentosa Abadi",
    jenis_badan_usaha: "Perseroan Terbatas",
    status_operasional: "Aktif",
  },
  {
    id: 28,
    nama_badan_usaha: "CV. Gema Luhur",
    jenis_badan_usaha: "Commanditaire Vennootschap",
    status_operasional: "Aktif",
  },
  {
    id: 29,
    nama_badan_usaha: "PT. Sahabat Karya",
    jenis_badan_usaha: "Perseroan Terbatas",
    status_operasional: "Aktif",
  },
  {
    id: 30,
    nama_badan_usaha: "PT. Mutiara Abadi",
    jenis_badan_usaha: "Perseroan Terbatas",
    status_operasional: "Aktif",
  },
  {
    id: 31,
    nama_badan_usaha: "CV. Sumber Daya",
    jenis_badan_usaha: "Commanditaire Vennootschap",
    status_operasional: "Aktif",
  },
  {
    id: 32,
    nama_badan_usaha: "PT. Rantai Karya",
    jenis_badan_usaha: "Perseroan Terbatas",
    status_operasional: "Aktif",
  },
  {
    id: 33,
    nama_badan_usaha: "UD. Jaya Utama",
    jenis_badan_usaha: "Usaha Dagang",
    status_operasional: "Tidak Aktif",
  },
  {
    id: 34,
    nama_badan_usaha: "PT. Indah Karya",
    jenis_badan_usaha: "Perseroan Terbatas",
    status_operasional: "Aktif",
  },
  {
    id: 35,
    nama_badan_usaha: "CV. Karya Bersama",
    jenis_badan_usaha: "Commanditaire Vennootschap",
    status_operasional: "Aktif",
  },
  {
    id: 36,
    nama_badan_usaha: "PT. Mitra Karya",
    jenis_badan_usaha: "Perseroan Terbatas",
    status_operasional: "Aktif",
  },
  {
    id: 37,
    nama_badan_usaha: "PT. Sinar Abadi",
    jenis_badan_usaha: "Perseroan Terbatas",
    status_operasional: "Tidak Aktif",
  },
  {
    id: 38,
    nama_badan_usaha: "CV. Bintang Sejahtera",
    jenis_badan_usaha: "Commanditaire Vennootschap",
    status_operasional: "Aktif",
  },
  {
    id: 39,
    nama_badan_usaha: "PT. Maju Abadi",
    jenis_badan_usaha: "Perseroan Terbatas",
    status_operasional: "Aktif",
  },
  {
    id: 40,
    nama_badan_usaha: "CV. Sejahtera Sukses",
    jenis_badan_usaha: "Commanditaire Vennootschap",
    status_operasional: "Aktif",
  },
  {
    id: 41,
    nama_badan_usaha: "PT. Mega Karya",
    jenis_badan_usaha: "Perseroan Terbatas",
    status_operasional: "Aktif",
  },
];
