import React from "react";
import { Button } from "@/components/ui/button"; // Assuming you have a Button component
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";

type RejectionModalProps = {
  reason: string;
  onUploadAgain: () => void;
};

const RejectionModal: React.FC<RejectionModalProps> = ({
  reason,
  onUploadAgain
}) => {
  return (
    <Dialog >
      <DialogTrigger asChild>
        <Button
          className="bg-red-600 hover:bg-red-700 text-white py-5 px-5 font-bold rounded-xl transition duration-300 hover:cursor-pointer shadow-sm hover:shadow-md"
        >
          Lihat Alasan Penolakan
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-3xl border border-[var(--cream-dark)] bg-white p-6 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-extrabold text-[var(--text-primary)]">
            Alasan Penolakan
          </DialogTitle>
        </DialogHeader>
        <div className="bg-[#FFF5F5] border border-red-200 rounded-[20px] p-5 my-2">
          <div className="flex items-start">
            <i className="fas fa-exclamation-triangle text-red-600 mr-3 mt-1 text-sm"></i>
            <div>
              <h4 className="font-bold text-red-900 mb-1">Catatan Penolakan:</h4>
              <p className="text-red-800 text-sm leading-relaxed">{reason || 'Tidak ada alasan yang diberikan'}</p>
            </div>
          </div>
        </div>
        <DialogFooter className="sm:justify-start mt-4">
          <div className="grid grid-cols-2 w-full gap-4">
            <DialogClose asChild>
              <Button type="button" className="px-5 py-5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl hover:cursor-pointer font-bold transition duration-200">
                Tutup
              </Button>
            </DialogClose>
            <Button onClick={onUploadAgain} type="button" className="px-5 py-5 bg-[var(--terracotta)] hover:bg-[var(--terracotta-dark)] text-white rounded-xl hover:cursor-pointer font-bold transition duration-200 shadow-sm shadow-[var(--terracotta)]/15">
              Upload Ulang
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RejectionModal;
