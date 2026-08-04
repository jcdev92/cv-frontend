import api from './axios';

export const resourceApi = {
  list: async <T>(basePath: string, userId: string | undefined): Promise<T[]> => {
    const res = await api.get(`${basePath}?user=${userId}`);
    return res.data;
  },
  create: async (basePath: string, payload: unknown): Promise<void> => {
    await api.post(basePath, payload);
  },
  update: async (basePath: string, id: string, payload: unknown): Promise<void> => {
    await api.put(`${basePath}/${id}`, payload);
  },
  remove: async (basePath: string, id: string): Promise<void> => {
    await api.delete(`${basePath}/${id}`);
  },
};
