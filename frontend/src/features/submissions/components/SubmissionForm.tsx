import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form, Input } from "antd";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  useCreateSubmission,
  useSubmissionForActivity,
  useUpdateSubmission,
} from "../hooks/useSubmissions";
import { SubmissionPayload, submissionSchema } from "../schemas";

const { TextArea } = Input;

interface SubmissionFormProps {
  activityId: number;
  dueDate: string;
}

export const SubmissionForm = ({
  activityId,
  dueDate,
}: SubmissionFormProps) => {
  const { submission, isLoading: isFetching } =
    useSubmissionForActivity(activityId);

  const { mutate: createSubmission, isPending: isCreating } =
    useCreateSubmission();
  const { mutate: updateSubmission, isPending: isUpdating } =
    useUpdateSubmission();

  const isPending = isCreating || isUpdating;
  const isLate = new Date(dueDate) < new Date();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubmissionPayload>({
    resolver: zodResolver(submissionSchema),
    defaultValues: {
      content: "",
    },
  });

  useEffect(() => {
    if (submission) {
      reset({ content: submission.content });
    }
  }, [submission, reset]);

  const onSubmit = (data: SubmissionPayload) => {
    if (submission) {
      updateSubmission({ submissionId: submission.id, content: data.content });
    } else {
      createSubmission({ activityId, content: data.content });
    }
  };

  if (isFetching) {
    return <div className="text-gray-400">Verificando envio anterior...</div>;
  }

  if (isLate) {
    if (submission) {
      return (
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
          <h4 className="font-semibold text-gray-700 mb-2">Sua Resposta:</h4>
          <p className="text-gray-600 whitespace-pre-wrap">
            {submission.content}
          </p>
          {submission.grade !== null && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <span className="font-semibold text-gray-800">
                Nota: {submission.grade}
              </span>
              {submission.feedback && (
                <p className="text-sm text-gray-600 mt-1">
                  Feedback: {submission.feedback}
                </p>
              )}
            </div>
          )}
        </div>
      );
    }
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        O prazo para envio desta atividade já se encerrou
      </div>
    );
  }

  return (
    <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
      <Form.Item
        label={
          <span className="font-semibold text-gray-700">
            {submission ? "Editar sua Resposta" : "Sua Resposta"}
          </span>
        }
        validateStatus={errors.content ? "error" : ""}
        help={errors.content?.message}
      >
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <TextArea
              {...field}
              rows={6}
              placeholder="Escreva sua resposta detalhada aqui..."
              size="large"
              disabled={isPending}
            />
          )}
        />
      </Form.Item>

      <div className="flex justify-end gap-3 items-center">
        {submission && (
          <span className="text-sm text-green-600 font-medium">
            Resposta salva. Você pode editá-la até o prazo acabar.
          </span>
        )}
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          loading={isPending}
          className="px-8"
        >
          {submission ? "Atualizar Resposta" : "Enviar Resposta"}
        </Button>
      </div>
    </Form>
  );
};
