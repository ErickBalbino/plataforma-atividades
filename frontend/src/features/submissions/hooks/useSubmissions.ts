import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { ApiErrorResponse, PaginatedResponse } from "../../core/types/api";
import { submissionService } from "../services/submissionService";
import { Submission } from "../types";

export const useSubmissions = (params?: { page?: number; search?: string }) => {
  return useQuery<PaginatedResponse<Submission>>({
    queryKey: ["submissions", params],
    queryFn: () => submissionService.getMySubmissions(params),
    staleTime: 1000 * 60 * 5,
  });
};

export const useSubmissionForActivity = (activityId: number) => {
  const { data: response, isLoading } = useSubmissions();
  
  const submission = response?.results?.find(
    (sub) => sub.activity.id === activityId
  );

  return { submission, isLoading };
};

export const useCreateSubmission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ activityId, content }: { activityId: number; content: string }) =>
      submissionService.createSubmission(activityId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
      message.success("Resposta enviada com sucesso!");
    },
    onError: (e) => {
      const error = e as unknown as ApiErrorResponse;
      message.error(error.message || "Erro ao enviar resposta.");
    },
  });
};

export const useUpdateSubmission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ submissionId, content }: { submissionId: number; content: string }) =>
      submissionService.updateSubmission(submissionId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
      message.success("Resposta atualizada com sucesso!");
    },
    onError: (e) => {
      const error = e as unknown as ApiErrorResponse;
      message.error(error.message || "Erro ao atualizar resposta.");
    },
  });
};

export const useGradeSubmission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      submissionId,
      grade,
      feedback,
    }: {
      submissionId: number;
      grade: number;
      feedback?: string;
    }) => submissionService.gradeSubmission(submissionId, grade, feedback),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
      message.success("Nota e feedback salvos com sucesso!");
    },
    onError: (e) => {
      const error = e as unknown as ApiErrorResponse;
      message.error(error.message || "Erro ao salvar correção.");
    },
  });
};
