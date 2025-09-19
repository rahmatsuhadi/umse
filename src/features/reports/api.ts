import { apiClient } from "@/lib/api-client";
import type { MessageReport, PaginatedApiResponse, Report } from "@/types";

// Tipe untuk parameter query
export type QueryParams = {
    page?: number;
    per_page?: number;
    category?: string;
    q?: string;

    filter?: {
        [key: string]: string | number;
    };
};


/**
 * Mengambil daftar Complain dengan paginasi dan filter.
 */
export const getReport = (params: QueryParams): Promise<PaginatedApiResponse<Report>> => {
    params = {
        ...params,
    }



    const buildQueryString = (p: QueryParams): string => {
        const parts: string[] = [];

        for (const key in p) {
            // Dapatkan nilai dari key tersebut
            const value = p[key as keyof QueryParams];

            // Perlakuan khusus jika key adalah 'filter' dan nilainya adalah objek
            if (key === 'filter' && typeof value === 'object' && value !== null) {
                const filterObject = value as { [s: string]: string | number };

                for (const filterKey in filterObject) {
                    if (Object.prototype.hasOwnProperty.call(filterObject, filterKey)) {
                        const filterValue = filterObject[filterKey];
                        // Format menjadi: filter[category__slug]=nilai
                        parts.push(`filter[${encodeURIComponent(filterKey)}]=${encodeURIComponent(filterValue)}`);
                    }
                }
            } else if (value !== undefined && value !== null) {

                parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
            }
        }
        return parts.join('&');
    };

    const query = buildQueryString(params);
    return apiClient<PaginatedApiResponse<Report>>(`/complaints?${query}`);
};


/**
 * Mengambil satu store berdasarkan id-nya.
 */
export const getReportById = (id: string): Promise<{ data: Report }> => {
    return apiClient<{ data: Report }>(`/complaints/${id}`);
};

export type CreateReportData = {
  title: string
  description: string
  category: string
  media: File[]
};


/** Menambah report baru */
export const addReport = (data: CreateReportData): Promise<Report> => {
  const formData = new FormData();

  // Menambahkan fields lainnya ke FormData
  formData.append('title', data.title);
  formData.append('description', data.description);
  formData.append("reporterId", '01990380-16e2-734a-ae88-22d72d17e368')
  formData.append('category', data.category);

  // Menambahkan media (file) ke FormData
  data.media.forEach((file, index) => {
    formData.append(`media[${index}]`, file); // Use the index to avoid collision
  });
  formData.append("_method", "POST");

  // Mengirimkan request dengan FormData
  return apiClient<Report>(`/complaints`, {
    method: 'POST',
    body: formData,
  });
};




// report message



export const getReportMesage = (id:string,params: QueryParams): Promise<PaginatedApiResponse<MessageReport>> => {
    params = {
        ...params,
    }



    const buildQueryString = (p: QueryParams): string => {
        const parts: string[] = [];

        for (const key in p) {
            // Dapatkan nilai dari key tersebut
            const value = p[key as keyof QueryParams];

            // Perlakuan khusus jika key adalah 'filter' dan nilainya adalah objek
            if (key === 'filter' && typeof value === 'object' && value !== null) {
                const filterObject = value as { [s: string]: string | number };

                for (const filterKey in filterObject) {
                    if (Object.prototype.hasOwnProperty.call(filterObject, filterKey)) {
                        const filterValue = filterObject[filterKey];
                        // Format menjadi: filter[category__slug]=nilai
                        parts.push(`filter[${encodeURIComponent(filterKey)}]=${encodeURIComponent(filterValue)}`);
                    }
                }
            } else if (value !== undefined && value !== null) {

                parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
            }
        }
        return parts.join('&');
    };

    const query = buildQueryString(params);
    return apiClient<PaginatedApiResponse<MessageReport>>(`/complaints/${id}/messages?${query}`);
};


export type CreateMessageData = {
  message: string
  media?: File[]
};

export const sendMessage = (id:string,data: CreateMessageData): Promise<MessageReport> => {

  return apiClient<MessageReport>(`/complaints/${id}/messages`, {
    method: 'POST',    
    body: JSON.stringify(data),
  });
};