import { LoaderCircle } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
        <p className="text-lg text-slate-600">Mohon tunggu sebentar...</p>
      </div>
    </div>
  );
}