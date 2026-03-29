import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { activityService } from "../services/activityService";
import { Activity } from "../types";
import { CreateActivityPayload } from "../schemas";

export const useActivities = () => {
  return useQuery<Activity[]>({
    queryKey: ["activities"],
    queryFn: activityService.getActivities,
    staleTime: 1000 * 60 * 5,
    select: (data) => {
      return [...data].sort(
        (a, b) =>
          new Date(a.due_date).getTime() - new Date(b.due_date).getTime(),
      );
    },
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

export const useCreateActivity = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: CreateActivityPayload) =>
      activityService.createActivity(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      message.success("Atividade criada com sucesso!");
      navigate("/atividades");
    },
    onError: () => {
      message.error("Erro ao criar atividade. Verifique os dados e tente novamente.");
    },
  });
};
