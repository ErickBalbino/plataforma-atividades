import { PaginatedResponse } from "../../../features/core/types/api";
import api from "../../../shared/api/apiClient";
import { ClassRoom, ClassRoomMember } from "../types";

export const classRoomService = {
  list: async (params?: { page?: number; search?: string }) => {
    const response = await api.get<PaginatedResponse<ClassRoom>>("/turmas/", {
      params,
    });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get<ClassRoom>(`/turmas/${id}/`);
    return response.data;
  },

  getStudents: async (
    id: number,
    params?: { page?: number; search?: string },
  ) => {
    const response = await api.get<PaginatedResponse<ClassRoomMember>>(
      `/turmas/${id}/alunos/`,
      { params },
    );
    return response.data;
  },

  create: async (payload: { name: string }) => {
    const response = await api.post<ClassRoom>("/turmas/", payload);
    return response.data;
  },

  join: async (code: string) => {
    const response = await api.post<{ detail: string }>("/turmas/entrar/", {
      code,
    });
    return response.data;
  },
};
