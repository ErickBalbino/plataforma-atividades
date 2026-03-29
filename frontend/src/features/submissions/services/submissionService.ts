import api from "../../../shared/api/apiClient";
import { Submission } from "../types";

export const submissionService = {
  getMySubmissions: async () => {
    const response = await api.get<Submission[]>("/me/respostas");
    return response.data;
  },

  createSubmission: async (activityId: number, content: string) => {
    const response = await api.post<Submission>("/respostas/", {
      activity: activityId,
      content,
    });
    return response.data;
  },

  updateSubmission: async (submissionId: number, content: string) => {
    const response = await api.patch<Submission>(`/respostas/${submissionId}/`, {
      content,
    });
    return response.data;
  },

  gradeSubmission: async (submissionId: number, grade: number, feedback?: string) => {
    const response = await api.patch<Submission>(`/respostas/${submissionId}/`, {
      grade,
      feedback: feedback || null,
    });
    return response.data;
  },
};

