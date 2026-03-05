"use client";

import { useEffect, useState } from "react";
import { Copy } from "lucide-react";
import { toast } from "sonner";

type Props = {
  id: string;
  path?: string;
};

export function ShareButtons({ id, path = "/literasi" }: Props) {
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const origin = window.location.origin;
      setCurrentUrl(`${origin}${path}/` + id);
    }
  }, [path, id]);

  const copyToClipboard = () => {
    if (!currentUrl) return;
    navigator.clipboard.writeText(currentUrl);
    toast.success("Link behasil disalin!");
  };

  return (
    <div className="share-container">
      <h3 className="share-title">Bagikan Artikel</h3>
      <div className="share-btns">
        {/* WhatsApp */}
        <a
          href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
            `Baca artikel menarik ini: ${currentUrl}`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="share-btn share-btn-wa"
        >
          <span>WhatsApp</span>
        </a>

        {/* Copy Link */}
        <button
          onClick={copyToClipboard}
          disabled={!currentUrl}
          className="share-btn share-btn-copy"
        >
          <Copy size={16} />
          <span>Salin Link</span>
        </button>
      </div>
    </div>
  );
}
