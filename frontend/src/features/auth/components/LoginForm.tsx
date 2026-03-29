import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form, Input, Alert } from 'antd';
import { Controller, useForm } from 'react-hook-form';
import { loginSchema, LoginCredentials } from '../types';
import { useLogin } from '../hooks/useAuth';

export const LoginForm = () => {
  const { mutate, isPending, isError } = useLogin();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginCredentials) => {
    mutate(data);
  };

  return (
    <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
      {isError && (
        <Alert
          message="E-mail ou senha incorretos."
          type="error"
          showIcon
          className="mb-6"
        />
      )}
      <Form.Item
        label="E-mail"
        validateStatus={errors.email ? 'error' : ''}
        help={errors.email?.message}
      >
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              prefix={<MailOutlined className="text-gray-400" />}
              placeholder="seu@email.com"
              size="large"
            />
          )}
        />
      </Form.Item>

      <Form.Item
        label="Senha"
        validateStatus={errors.password ? 'error' : ''}
        help={errors.password?.message}
      >
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <Input.Password
              {...field}
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Sua senha"
              size="large"
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
        >
          Entrar
        </Button>
      </Form.Item>
    </Form>
  );
};
