import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { PaginatedResponse } from "../../core/types/api";
import { CreateActivityPayload } from "../schemas";
import { activityService } from "../services/activityService";
import { Activity } from "../types";

export const useActivities = (params?: {
  classroom?: number;
  page?: number;
  search?: string;
}) => {
  return useQuery<PaginatedResponse<Activity>>({
    queryKey: ["activities", params],
    queryFn: () => activityService.getActivities(params),
    staleTime: 1000 * 60 * 5,
  });
};

export const useActivity = (id: number) => {
  return useQuery<Activity>({
    queryKey: ["activities", id],
    queryFn: () => activityService.getActivityById(id),
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  });
};

export const useActivitySubmissions = (
  activityId: number,
  params?: { page?: number; search?: string },
) => {
  return useQuery<PaginatedResponse<any>>({
    queryKey: ["activities", activityId, "submissions", params],
    queryFn: () => activityService.getActivitySubmissions(activityId, params),
    staleTime: 1000 * 60 * 5,
    enabled: !!activityId,
  });
};

export const useCreateActivity = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateActivityPayload) =>
      activityService.createActivity(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      message.success("Atividade criada com sucesso");
      onSuccess?.();
    },
    onError: () => {
      message.error("Erro ao criar atividade. Tente novamente");
    },
  });
};
