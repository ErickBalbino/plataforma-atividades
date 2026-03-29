import { CheckCircleFilled } from "@ant-design/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form, Input, InputNumber, Tag } from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useGradeSubmission } from "../hooks/useSubmissions";
import { GradeSubmissionPayload, gradeSubmissionSchema } from "../schemas";
import { Submission } from "../types";

interface GradeSubmissionCardProps {
  submission: Submission;
}

export const GradeSubmissionCard = ({
  submission,
}: GradeSubmissionCardProps) => {
  const { mutate, isPending } = useGradeSubmission();
  const isGraded = submission.grade !== null;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GradeSubmissionPayload>({
    resolver: zodResolver(gradeSubmissionSchema),
    defaultValues: {
      grade: 0,
      feedback: "",
    },
  });

  useEffect(() => {
    if (isGraded) {
      reset({
        grade: submission.grade as number,
        feedback: submission.feedback || "",
      });
    }
  }, [isGraded, submission, reset]);

  const onSubmit = (data: GradeSubmissionPayload) => {
    mutate({
      submissionId: submission.id,
      grade: data.grade,
      feedback: data.feedback,
    });
  };

  const formattedDate = dayjs(submission.turned_in_at).format(
    "DD/MM/YYYY HH:mm",
  );

  return (
    <div
      className={`bg-white border ${
        isGraded ? "border-green-100" : "border-gray-200"
      } rounded-2xl p-6 shadow-sm flex flex-col gap-4`}
    >
      <div className="flex justify-between items-start gap-4">
        <div>
          <h3 className="font-bold text-gray-800 text-lg">
            {submission.student.email}
          </h3>
          <p className="text-gray-500 text-sm">
            Atividade: {submission.activity.title}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          {isGraded ? (
            <Tag
              icon={<CheckCircleFilled />}
              color="success"
              className="m-0 px-3 py-1 font-semibold"
            >
              Corrigido: {Number(submission.grade).toFixed(1)}
            </Tag>
          ) : (
            <Tag color="warning" className="m-0">
              Pendente
            </Tag>
          )}
          <span className="text-xs text-gray-400">
            Enviado em {formattedDate}
          </span>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mt-2">
        <p className="text-gray-700 whitespace-pre-wrap text-[0.95rem]">
          {submission.content}
        </p>
      </div>

      <Form
        layout="vertical"
        onFinish={handleSubmit(onSubmit)}
        className="mt-4"
      >
        <div className="flex gap-4 items-start">
          <Form.Item
            label="Nota"
            validateStatus={errors.grade ? "error" : ""}
            help={errors.grade?.message}
            className="w-32 mb-0"
          >
            <Controller
              name="grade"
              control={control}
              render={({ field }) => (
                <InputNumber
                  {...field}
                  min={0}
                  max={10}
                  step={0.5}
                  size="large"
                  className="w-full"
                  disabled={isPending}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Feedback (Opcional)"
            validateStatus={errors.feedback ? "error" : ""}
            help={errors.feedback?.message}
            className="flex-1 mb-0"
          >
            <Controller
              name="feedback"
              control={control}
              render={({ field }) => (
                <Input.TextArea
                  {...field}
                  rows={2}
                  placeholder="Deixe um comentário curto para o aluno..."
                  size="large"
                  disabled={isPending}
                />
              )}
            />
          </Form.Item>
        </div>

        <div className="flex justify-end mt-4">
          <Button
            type="primary"
            htmlType="submit"
            loading={isPending}
            className="px-6"
          >
            {isGraded ? "Atualizar Correção" : "Salvar Correção"}
          </Button>
        </div>
      </Form>
    </div>
  );
};
