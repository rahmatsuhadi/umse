interface Props {
  orderId: string;
}

export default function PaymentHeader({ orderId }: Props) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Status Pembayaran</h1>
          <p className="text-gray-600">
            Pesanan <span id="orderNumber" className="font-medium text-primary">#{orderId}</span>
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <span className="text-sm text-gray-500">1 September 2025</span>
        </div>
      </div>
    </div>
  );
}
