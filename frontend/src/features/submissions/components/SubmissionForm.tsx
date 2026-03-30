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
  const isGraded = !!submission && submission.grade !== null;


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

  if (isLate || isGraded) {
    if (submission) {
      return (
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-gray-700 m-0">Sua Resposta:</h4>
            {isGraded && (
              <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded">
                RESPOSTA AVALIADA
              </span>
            )}
          </div>
          <p className="text-gray-600 whitespace-pre-wrap">
            {submission.content}
          </p>
          {submission.grade !== null && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <span className="font-bold text-gray-800 text-lg">
                Nota: {Number(submission.grade).toFixed(1)}
              </span>
              {submission.feedback && (
                <div className="bg-blue-50/50 p-4 rounded-lg mt-3 border border-blue-100">
                  <span className="text-xs font-bold text-blue-700 uppercase block mb-1">
                    Feedback do professor:
                  </span>
                  <p className="text-sm text-gray-700 italic m-0">
                    "{submission.feedback}"
                  </p>
                </div>
              )}
            </div>
          )}
          {isGraded && !isLate && (
            <div className="mt-4 text-xs text-amber-600 font-medium">
              * Esta resposta não pode mais ser editada pois já recebeu uma
              avaliação.
            </div>
          )}
        </div>
      );
    }
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        {isLate
          ? "O prazo para envio desta atividade já se encerrou"
          : "Esta atividade já foi avaliada e não permite edição"}
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
