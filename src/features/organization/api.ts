import { apiClient } from "@/lib/api-client";

interface Organization {
  id: number;
  name: string;
}

export const fetchOrganizations = async (
  term: string
): Promise<Organization[]> => {
  const url = term ? `/organizations?q=${term}` : `/organizations`;
  const { data } = await apiClient<{ data: Organization[] }>(url);
  return data;
};
