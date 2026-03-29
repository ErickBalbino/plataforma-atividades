import { zodResolver } from "@hookform/resolvers/zod";
import { Button, DatePicker, Form, Input, Select } from "antd";
import dayjs from "dayjs";
import { Controller, useForm } from "react-hook-form";
import { useCreateActivity } from "../hooks/useActivities";
import { CreateActivityPayload, createActivitySchema } from "../schemas";

const { TextArea } = Input;
const { Option } = Select;

// Mocked classrooms
const MOCKED_CLASSROOMS = [
  { id: 1, name: "Turma A (Manhã)" },
  { id: 2, name: "Turma B (Tarde)" },
  { id: 3, name: "Turma de Recuperação" },
];

export const CreateActivityForm = () => {
  const { mutate, isPending } = useCreateActivity();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateActivityPayload>({
    resolver: zodResolver(createActivitySchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const onSubmit = (data: CreateActivityPayload) => {
    mutate(data);
  };

  const disabledDate = (current: dayjs.Dayjs) => {
    return current && current < dayjs().startOf("day");
  };

  return (
    <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
      <Form.Item
        label="Título da Atividade"
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
            />
          )}
        />
      </Form.Item>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Form.Item
          label="Turma"
          validateStatus={errors.classroom ? "error" : ""}
          help={errors.classroom?.message}
        >
          <Controller
            name="classroom"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                placeholder="Selecione a turma"
                size="large"
                className="w-full"
              >
                {MOCKED_CLASSROOMS.map((c) => (
                  <Option key={c.id} value={c.id}>
                    {c.name}
                  </Option>
                ))}
              </Select>
            )}
          />
        </Form.Item>

        <Form.Item
          label="Prazo de Entrega"
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
                className="w-full"
              />
            )}
          />
        </Form.Item>
      </div>

      <Form.Item
        label="Descrição"
        validateStatus={errors.description ? "error" : ""}
        help={errors.description?.message}
        className="mb-8"
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
            />
          )}
        />
      </Form.Item>

      <div className="flex justify-end">
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          loading={isPending}
          className="px-8"
        >
          Criar Atividade
        </Button>
      </div>
    </Form>
  );
};
