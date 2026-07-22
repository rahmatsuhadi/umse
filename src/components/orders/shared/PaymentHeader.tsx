import { formatDate } from "@/lib/format-date";

interface Props {
  orderId: string;
  date: string | null;
}

export default function PaymentHeader({ orderId, date }: Props) {
  return (
    <div className="bg-white border-[1.5px] border-[var(--cream-dark)] rounded-[var(--radius-md)] p-5 mb-4 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-base font-extrabold text-[var(--text-primary)] mb-1">Status Pembayaran</h1>
          <div className="flex items-center gap-1.5 pl-1">
            <i className="fas fa-hashtag text-[var(--terracotta)] text-xs"></i>
            <p className="text-xs text-[var(--text-muted)] font-medium">
              Pesanan{" "}
              <span id="orderNumber" className="font-bold text-[var(--terracotta-dark)]">
                {orderId}
              </span>
            </p>
          </div>
        </div>
        {date && (
          <div className="flex items-center gap-1.5 bg-[var(--cream)] border border-[var(--cream-dark)]/40 px-3 py-1.5 rounded-[var(--radius-sm)]">
            <i className="far fa-calendar-alt text-[var(--brown-light)] text-xs"></i>
            <span className="text-xs text-[var(--text-secondary)] font-medium">{formatDate(date)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
