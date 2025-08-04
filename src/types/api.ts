
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    total: number;
    currentPage: number;
    totalPages: number;
  };
}

