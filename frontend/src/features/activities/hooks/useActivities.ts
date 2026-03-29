import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { CreateActivityPayload } from "../schemas";
import { activityService } from "../services/activityService";
import { Activity } from "../types";

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

export const useClassrooms = () => {
  return useQuery({
    queryKey: ["classrooms"],
    queryFn: activityService.getClassRooms,
    staleTime: 1000 * 60 * 60 * 24,
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
      message.error(
        "Erro ao criar atividade. Verifique os dados e tente novamente.",
      );
    },
  });
};
