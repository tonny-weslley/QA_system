import { apiClient } from './client';

export interface ConfigResponse {
  [key: string]: boolean | string | number;
}

export const configApi = {
  getAll: async (): Promise<ConfigResponse> => {
    const response = await apiClient.get('/admin/config');
    return response.data;
  },

  update: async (key: string, value: boolean | string | number): Promise<void> => {
    await apiClient.put(`/admin/config/${key}`, { value });
  },
};
