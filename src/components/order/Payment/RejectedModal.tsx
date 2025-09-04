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
          className=" text-white py-5 px-5 font-medium transition duration-300 bg-red-500 hover:bg-red-700 hover:cursor-pointer ">Lihat Alasan Penolakan</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Alasan Penolakan
          </DialogTitle>
        </DialogHeader>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <i className="fas fa-exclamation-triangle text-red-500 mr-3 mt-1"></i>
            <div>
              <h4 className="font-medium text-red-800 mb-2">Alasan Penolakan:</h4>
              <p className="text-red-700 text-sm">{reason || 'Tidak ada alasan yang diberikan'}</p>
            </div>
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <div className=" grid-cols-2 grid w-full gap-4">

            <DialogClose asChild>
              <Button type="button" className="px-5 py-5 bg-gray-500 hover:bg-gray-700  hover:cursor-pointer">
                Tutup
              </Button>
            </DialogClose>
            <Button onClick={onUploadAgain} type="button" className="px-5 py-5 hover:cursor-pointer">
              Upload Ulang
            </Button>
          </div>

        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RejectionModal;
