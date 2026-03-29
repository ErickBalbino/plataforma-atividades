import api from "../../../shared/api/apiClient";
import { CreateActivityPayload } from "../schemas";
import { Activity } from "../types";

export const activityService = {
  getActivities: async () => {
    const response = await api.get<Activity[]>("/me/atividades");
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
};

