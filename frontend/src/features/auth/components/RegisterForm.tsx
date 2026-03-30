import {
  LockOutlined,
  MailOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Button, Form, Input, Select } from "antd";
import { Controller, useForm } from "react-hook-form";
import { useRegister } from "../hooks/useAuth";
import { RegisterCredentials, registerSchema } from "../types";

export const RegisterForm = () => {
  const { mutateAsync, isPending, isError } = useRegister();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterCredentials>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "STUDENT",
    },
  });

  const onSubmit = async (data: RegisterCredentials) => {
    try {
      await mutateAsync(data);
    } catch (error: any) {
      if (error?.errors) {
        Object.entries(error.errors).forEach(([field, messages]) => {
          setError(field as keyof RegisterCredentials, {
            type: "manual",
            message: Array.isArray(messages)
              ? (messages[0] as string).charAt(0).toUpperCase() +
                (messages[0] as string).slice(1)
              : (messages as string).charAt(0).toUpperCase() +
                (messages as string).slice(1),
          });
        });
      }
    }
  };

  return (
    <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
      {isError && (
        <Alert
          message="Erro ao realizar cadastro. Verifique os dados"
          type="error"
          showIcon
          className="mb-6"
        />
      )}

      <Form.Item
        label="Nome Completo"
        validateStatus={errors.name ? "error" : ""}
        help={errors.name?.message}
      >
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="Seu nome"
              size="large"
              aria-label="Campo para nome completo"
            />
          )}
        />
      </Form.Item>

      <Form.Item
        label="E-mail"
        validateStatus={errors.email ? "error" : ""}
        help={errors.email?.message}
      >
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              prefix={<MailOutlined className="text-gray-400 translate-y-[1px]" />}
              placeholder="seu@email.com"
              size="large"
              aria-label="Campo para e-mail"
            />
          )}
        />
      </Form.Item>

      <Form.Item
        label="Senha"
        validateStatus={errors.password ? "error" : ""}
        help={errors.password?.message}
      >
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <Input.Password
              {...field}
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Crie uma senha forte"
              size="large"
              aria-label="Campo para senha"
            />
          )}
        />
      </Form.Item>

      <Form.Item
        label="Eu sou um(a)"
        validateStatus={errors.role ? "error" : ""}
        help={errors.role?.message}
      >
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              size="large"
              placeholder="Selecione seu perfil"
              aria-label="Campo para selecionar perfil"
              suffixIcon={<TeamOutlined className="text-gray-400" />}
              options={[
                { value: "STUDENT", label: "Estudante" },
                { value: "TEACHER", label: "Professor(a)" },
              ]}
            />
          )}
        />
      </Form.Item>

      <Form.Item className="mt-8">
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          block
          loading={isPending}
          aria-label="Botão de concluir cadastro"
        >
          Criar Conta
        </Button>
      </Form.Item>
    </Form>
  );
};
