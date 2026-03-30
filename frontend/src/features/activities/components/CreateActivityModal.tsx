import { zodResolver } from "@hookform/resolvers/zod";
import { Button, DatePicker, Form, Input, Modal } from "antd";
import dayjs from "dayjs";
import { Controller, useForm } from "react-hook-form";
import { useCreateActivity } from "../hooks/useActivities";
import { CreateActivityPayload, createActivitySchema } from "../schemas";

const { TextArea } = Input;

interface CreateActivityModalProps {
  classRoomId: number;
  classRoomName: string;
  open: boolean;
  onClose: () => void;
}

export const CreateActivityModal = ({
  classRoomId,
  classRoomName,
  open,
  onClose,
}: CreateActivityModalProps) => {
  const { mutate, isPending } = useCreateActivity(onClose);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateActivityPayload>({
    resolver: zodResolver(createActivitySchema),
    defaultValues: {
      title: "",
      description: "",
      classroom: classRoomId,
    },
  });

  const onSubmit = (data: CreateActivityPayload) => {
    mutate({ ...data, classroom: classRoomId });
  };

  const disabledDate = (current: dayjs.Dayjs) => {
    return current && current < dayjs().startOf("day");
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      title="Nova atividade"
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={600}
      destroyOnHidden
    >
      <div className="mt-1 mb-6 pb-4 border-b border-gray-100">
        <span className="text-base font-semibold" style={{ color: "#137333" }}>
          {classRoomName}
        </span>
      </div>

      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <Form.Item
          label="Título da atividade"
          validateStatus={errors.title ? "error" : ""}
          help={errors.title?.message}
        >
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Ex: Lista de Exercícios de Matemática"
                size="large"
                aria-label="Título da atividade"
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label="Descrição"
          validateStatus={errors.description ? "error" : ""}
          help={errors.description?.message}
        >
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextArea
                {...field}
                rows={4}
                placeholder="Descreva detalhadamente o que os alunos devem fazer..."
                size="large"
                aria-label="Descrição da atividade"
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label="Prazo de entrega"
          validateStatus={errors.due_date ? "error" : ""}
          help={errors.due_date?.message}
        >
          <Controller
            name="due_date"
            control={control}
            render={({ field }) => (
              <DatePicker
                {...field}
                value={field.value ? dayjs(field.value) : null}
                onChange={(date) => field.onChange(date ? date.toDate() : null)}
                disabledDate={disabledDate}
                showTime={{ format: "HH:mm" }}
                format="DD/MM/YYYY HH:mm"
                placeholder="Selecione data e hora"
                size="large"
                aria-label="Data de entrega"
              />
            )}
          />
        </Form.Item>

        <div className="flex justify-end gap-2">
          <Button
            danger
            type="text"
            className="bg-red-100 hover:bg-red-200 font-medium text-red-600 border-none"
            onClick={handleCancel}
          >
            Cancelar
          </Button>
          <Button type="primary" htmlType="submit" loading={isPending}>
            Criar atividade
          </Button>
        </div>
      </Form>
    </Modal>
  );
};
