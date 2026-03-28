import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { LoginCredentials } from "../types";

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

export const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: authService.getCurrentUser,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
};
