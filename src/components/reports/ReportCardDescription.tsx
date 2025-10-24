import { Report } from "@/types";
import { MediaPreview } from "../shared/MediaPreview";
import { useState } from "react";
import Link from "next/link";

export default function ReportCardDescription({ report }: { report: Report }) {
  const [isOpenPreview, setIsOpenPreview] = useState<boolean>(false);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Deskripsi Masalah
      </h2>
      <div className="prose max-w-none">
        <p className="text-gray-700 leading-relaxed">{report.description}</p>
      </div>

      {/* <!-- Attachments --> */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Lampiran</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {report.media.map((med, key) => (
            <div
              key={key}
              className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
            >
              {med.media_type == "image" ? (
                <i className="fas fa-image text-blue-600 text-xl"></i>
              ) : (
                <i className="fas fa-file-pdf text-red-600 text-xl"></i>
              )}
              <div className="flex-1 min-w-0">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpenPreview(true);
                    setFilePreview(med.media_url);
                  }}
                  className="hover:underline hover:cursor-pointer"
                >
                  <div className="text-sm font-medium text-gray-800 truncate">
                    {med.name}
                  </div>
                </button>
                <div className="text-xs text-gray-500">2.3 MB</div>
              </div>
              <Link
                href={med.media_url}
                download={med.name}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary-dark"
              >
                <i className="fas fa-download"></i>
              </Link>
            </div>
          ))}

          {filePreview && (
            <MediaPreview
              media={{
                type: "image",
                url: filePreview,
              }}
              onOpenChange={(val) => setIsOpenPreview(val)}
              open={isOpenPreview}
            />
          )}

          {report.media.length == 0 && <p>Tidak memberikan Lampiran</p>}
        </div>
      </div>
    </div>
  );
}

export function ReportCardDescriptionSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
      {/* Title */}
      <div className="h-6 w-40 bg-gray-200 rounded mb-4"></div>

      {/* Description */}
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>

      {/* Attachments */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="h-5 w-32 bg-gray-200 rounded mb-3"></div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
            >
              {/* Icon */}
              <div className="w-6 h-6 bg-gray-200 rounded"></div>

              {/* File name & size */}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>

              {/* Download button */}
              <div className="w-5 h-5 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
