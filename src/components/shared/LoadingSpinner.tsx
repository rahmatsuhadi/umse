"use client";

import { Loader2 } from "lucide-react"; 
import React from "react";

export default function LoadingSpinner({ text = "Memuat..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-gray-600">
      <Loader2 className="h-10 w-10 animate-spin text-primary mb-3" />
      <span className="text-sm">{text}</span>
    </div>
  );
}
