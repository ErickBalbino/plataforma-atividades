import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { submissionService } from "../services/submissionService";
import { Submission } from "../types";

export const useSubmissions = () => {
  return useQuery<Submission[]>({
    queryKey: ["submissions"],
    queryFn: submissionService.getMySubmissions,
    staleTime: 1000 * 60 * 5,
  });
};

export const useSubmissionForActivity = (activityId: number) => {
  const { data: submissions, isLoading } = useSubmissions();
  
  const submission = submissions?.find(
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
    onError: () => {
      message.error("Erro ao enviar resposta. Verifique os dados e tente novamente.");
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
    onError: () => {
      message.error("Erro ao atualizar resposta. Verifique o prazo da atividade.");
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
    onError: () => {
      message.error("Erro ao salvar correção. Tente novamente.");
    },
  });
};
