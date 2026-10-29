import { Metadata } from "next";
import { PrivacyPolicyContent } from "@/components/legal/PrivacyPolicyContent";

export const metadata: Metadata = {
  title: "Kebijakan Privasi (Privacy Policy) — Sleman Mart",
  description:
    "Kebijakan Privasi dan Perlindungan Data Pengguna Platform Sleman Mart (Dinas Koperasi dan UKM Kabupaten Sleman). Kepatuhan Kebijakan Data Pengguna Layanan Google API.",
  openGraph: {
    title: "Kebijakan Privasi (Privacy Policy) — Sleman Mart",
    description:
      "Informasi resmi pengumpulan, penggunaan, keamanan data akun Google OAuth 2.0, serta prosedur penghapusan data di Sleman Mart.",
    url: "https://slemanmart.slemankab.go.id/privacy-policy",
    siteName: "Sleman Mart",
  },
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyContent />;
}
