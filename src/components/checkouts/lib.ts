export type CheckoutStep = "checkout" | "payment" | "confirmation" | "success";

export const steps = [
    { key: "checkout", label: "Checkout" },
    { key: "payment", label: "Pembayaran" },
    { key: "confirmation", label: "Konfirmasi" },
    { key: "success", label: "Berhasil" },
];