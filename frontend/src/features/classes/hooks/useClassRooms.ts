import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { PaginatedResponse } from "../../core/types/api";
import { classRoomService } from "../services/classRoomService";
import { ClassRoom, ClassRoomMember } from "../types";

export const useClassRooms = (params?: { page?: number; search?: string }) => {
  return useQuery<PaginatedResponse<ClassRoom>>({
    queryKey: ["classrooms", params],
    queryFn: () => classRoomService.list(params),
    staleTime: 1000 * 60 * 5,
  });
};

export const useClassRoom = (id: number) => {
  return useQuery<ClassRoom>({
    queryKey: ["classrooms", id],
    queryFn: () => classRoomService.getById(id),
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  });
};

export const useClassRoomStudents = (
  id: number,
  params?: { page?: number; search?: string },
) => {
  return useQuery<PaginatedResponse<ClassRoomMember>>({
    queryKey: ["classrooms", id, "students", params],
    queryFn: () => classRoomService.getStudents(id, params),
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  });
};

export const useCreateClassRoom = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { name: string }) => classRoomService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classrooms"] });
      message.success("Sala de aula criada com sucesso");
      onSuccess?.();
    },
    onError: () => {
      message.error("Erro ao criar sala de aula. Tente novamente");
    },
  });
};

export const useJoinClassRoom = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (code: string) => classRoomService.join(code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classrooms"] });
      message.success("Você entrou na sala de aula com sucesso");
      onSuccess?.();
    },
    onError: () => {
      message.error(
        "Não foi possível entrar na sala de aula. Verifique o código",
      );
    },
  });
};
