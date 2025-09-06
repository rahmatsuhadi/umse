"use client"

import { useEffect, useState } from "react";
import {Copy } from "lucide-react";
import { FaFacebook, FaTwitter } from "react-icons/fa";

type Props = {
  title: string;
};

export function ShareButtons({ title }: Props) {
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    // URL hanya tersedia di sisi klien
    setCurrentUrl(window.location.href);
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentUrl);
    // toast.success("Link berhasil disalin!");
  };

  if (!currentUrl) return null;

  return (
    <div className="border-t border-slate-200 pt-6 mt-8">
      <h3 className="text-lg font-bold text-slate-800 mb-4">
        Bagikan Artikel Ini
      </h3>
      <div className="flex flex-wrap gap-3">
        {/* Tombol akan dinonaktifkan hingga URL siap */}
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex hover:cursor-pointer items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaFacebook size={16} className="mr-2" /> Facebook
        </a>
        <a
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(title)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex hover:cursor-pointer items-center bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600 transition-colors"
        >
          <FaTwitter size={16} className="mr-2" /> Twitter
        </a>
        <button
          onClick={copyToClipboard}
          className="flex items-center hover:cursor-pointer bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors"
        >
          <Copy size={16} className="mr-2" /> Salin Link
        </button>
      </div>
    </div>
  );
}
