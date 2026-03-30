import { PaginatedResponse } from "../../../features/core/types/api";
import api from "../../../shared/api/apiClient";
import { CreateActivityPayload } from "../schemas";
import { Activity } from "../types";

export const activityService = {
  getActivities: async (params?: {
    classroom?: number;
    page?: number;
    search?: string;
  }) => {
    const response = await api.get<PaginatedResponse<Activity>>(
      "/me/atividades",
      {
        params,
      },
    );
    return response.data;
  },

  getActivityById: async (id: number) => {
    const response = await api.get<Activity>(`/atividades/${id}/`);
    return response.data;
  },

  createActivity: async (payload: CreateActivityPayload) => {
    const response = await api.post<Activity>("/atividades/", payload);
    return response.data;
  },

  getActivitySubmissions: async (
    activityId: number,
    params?: { page?: number; search?: string },
  ) => {
    const response = await api.get<PaginatedResponse<any>>(
      `/atividades/${activityId}/respostas/`,
      { params },
    );
    return response.data;
  },
};
