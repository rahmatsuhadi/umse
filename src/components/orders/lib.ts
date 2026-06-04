export const getStatusBadgeClass = (status: string): string => {
  switch (status) {
    // Success/Completed states
    case "completed":
    case "delivered":
    case "paid":
      return "badge badge-forest";

    // In progress states
    case "pending":
    case "processing":
    case "shipped":
    case "partially_paid":
      return "badge badge-saffron";

    // Waiting states
    case "awaiting_payment":
    case "unpaid":
      return "badge badge-saffron";

    // Error/Cancelled states
    case "cancelled":
    case "refunded":
    case "rejected":
    case "expired":
      return "badge badge-terracotta";

    default:
      return "badge";
  }
};