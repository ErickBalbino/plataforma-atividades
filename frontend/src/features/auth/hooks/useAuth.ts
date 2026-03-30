import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { LoginCredentials, RegisterCredentials } from "../types";

export const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authService.login(credentials),
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], data.user);
      message.success("Bem-vindo de volta!");
      navigate("/");
    },
    onError: () => {
      message.error("Erro ao realizar login. Verifique suas credenciais.");
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials: RegisterCredentials) =>
      authService.register(credentials),
    onSuccess: async (_user, credentials) => {
      try {
        const loginResponse = await authService.login({
          email: credentials.email,
          password: credentials.password,
        });
        queryClient.setQueryData(["user"], loginResponse.user);
        message.success("Conta criada com sucesso!");
        navigate("/");
      } catch {
        message.info("Cadastro realizado! Faça login para continuar.");
        navigate("/login");
      }
    },
    onError: (error: any) => {
      if (!error?.errors) {
        message.error("Erro ao realizar cadastro. Verifique os dados.");
      }
    },
  });
};

export const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: authService.getCurrentUser,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
};
