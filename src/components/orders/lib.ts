export const getStatusBadgeClass = (status: string): string => {
  switch (status) {
    // Success/Completed states
    case "completed":
    case "delivered":
    case "paid":
      return "bg-green-100 text-green-800";

    // In progress states
    case "pending":
    case "processing":
    case "shipped":
    case "partially_paid":
      return "bg-blue-100 text-blue-800";

    // Waiting states
    case "awaiting_payment":
    case "unpaid":
      return "bg-yellow-100 text-yellow-800";

    // Error/Cancelled states
    case "cancelled":
    case "refunded":
    case "rejected":
    case "expired":
      return "bg-red-100 text-red-800";

    default:
      return "bg-gray-100 text-gray-800";
  }
};