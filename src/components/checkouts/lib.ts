export type CheckoutStep = "checkout" | "payment" | "confirmation" | "success";

export const steps = [
    { key: "checkout", label: "Checkout" },
    { key: "payment", label: "Pembayaran" },
    { key: "success", label: "Berhasil" },
];