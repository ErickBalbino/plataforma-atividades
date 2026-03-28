import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form, Input } from 'antd';
import { Controller, useForm } from 'react-hook-form';
import { loginSchema, LoginCredentials } from '../types';
import { useLogin } from '../hooks/useAuth';

export const LoginForm = () => {
  const { mutate, isPending } = useLogin();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginCredentials) => {
    mutate(data);
  };

  return (
    <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
      <Form.Item
        label="Usuário"
        validateStatus={errors.username ? 'error' : ''}
        help={errors.username?.message}
      >
        <Controller
          name="username"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="Seu usuário"
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
