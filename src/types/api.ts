
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


// Tipe untuk link di dalam meta pagination
export interface MetaLink {
  url: string | null;
  label: string;
  page:number
  active: boolean;
}

// Tipe untuk objek 'meta' dari backend
export interface Meta {
  current_page: number;
  from: number;
  last_page: number;
  count: {
    awaiting_payment: number
    cancelled: number
    delivered: number
    completed: number
    pending: number
    processing: number
    total: number
    shipped: number
  }
  links: MetaLink[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

// Tipe untuk objek 'links' dari backend
export interface Links {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

// Tipe generik untuk respons API paginasi
export interface PaginatedApiResponse<T> {
  data: T[];
  meta: Meta;
  links: Links;
}