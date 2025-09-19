import { apiClient } from "@/lib/api-client";
import type { PaginatedApiResponse, Article, CategoryArticle } from "@/types";

// Tipe untuk parameter query
export type QueryParams = {
    page?: number;
    per_page?: number;
    search?: string;
    category?:CategoryArticle ;
    filter?: {
        [key: string]: string | number; 
    };
};





/**
 * Mengambil daftar produk dengan paginasi dan filter.
 */
export const getArticles = (params: QueryParams): Promise<PaginatedApiResponse<Article>> => {
    params = {
        ...params,
    }


    const { category, ...otherParams } = params;

    const apiParams= { ...otherParams };

    if (category) {
        apiParams.filter = {
            ...apiParams.filter, 
            category: category,
        };
    }
    console.log(apiParams)

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

    const query = buildQueryString(apiParams);
    return apiClient<PaginatedApiResponse<Article>>(`/articles?${query}`);
};


/**
 * Mengambil satu store berdasarkan id-nya.
 */
export const getArticleById = (id: string): Promise<{ data: Article }> => {
    return apiClient<{ data: Article }>(`/articles/${id}`);
};

export const getBannerArticle = (limit:number = 5): Promise<{ data: Article[] }> => {
    return apiClient<{ data: Article[] }>(`/articles?per_page=${limit}&sort=-created_at`);
};