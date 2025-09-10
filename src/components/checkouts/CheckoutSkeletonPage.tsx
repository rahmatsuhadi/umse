import { Skeleton } from "../ui/skeleton";

export default function CheckoutSkeletonPage(){
    return(
        <div className="p-6">
            {/* Store Info */}
            <div className="bg-primary-light/20 border border-primary-dark rounded-lg p-4 mb-6">
                <div className="flex items-center">
                    {/* <i className="fas fa-store text-primary text-xl mr-3"></i> */}
                    <Skeleton className="w-13 h-13 rounded-full" />
                    <div>
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-5 w-52 mt-2" />
                    </div>
                </div>
            </div>

            {/* Items */}
            <div className="mb-6">
                <h4 className="font-bold text-gray-800 mb-4">Item Pesanan</h4>
                <div className="space-y-4">

                    {/* card */}
                    {Array(2).fill(null).map((_, index) => (
                        <div key={index} className="flex items-center bg-gray-50 rounded-lg p-4">
                            <Skeleton className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mr-4" />
                            <div className="flex-1">
                                <Skeleton className="w-28 h-5" />
                                <Skeleton className="w-12 h-3 mt-2" />
                                <Skeleton className="w-32 h-3 mt-2" />
                            </div>
                            <Skeleton className="float-right h-4 w-20" />
                        </div>
                    ))}

                    {/* card */}


                </div>

                {/* Summary */}
                <div className="border-t border-gray-200 pt-4 mt-4">

                    <div className="flex justify-between items-center text-lg font-bold border-t border-gray-200 pt-2">
                        <span>Total</span>
                        <Skeleton className="h-5 w-20" />
                    </div>
                </div>
            </div>




            <form className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-9 w-full mt-2" />
                </div>
                <div>
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-9 w-full mt-2" />
                </div>
                <div>
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-9 w-full mt-2" />
                </div>
                <div>
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-9 w-full mt-2" />
                </div>
                <div className="col-span-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-14 w-full mt-2" />
                </div>
                <div>
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-9 w-full mt-2" />
                </div>
                <div>
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-9 w-full mt-2" />
                </div>


            </form>
            {/* </div> */}

            <div className="mb-6">



                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-14 w-full mt-2" />
            </div>
            {/* Tombol Lanjut */}

            <Skeleton className="w-full h-9" />
        </div>
    )
}