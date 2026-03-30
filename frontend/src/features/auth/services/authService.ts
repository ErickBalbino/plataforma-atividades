import api from "../../../shared/api/apiClient";
import { AuthUser, LoginCredentials, RegisterCredentials } from "../types";

export const authService = {
  login: async (credentials: LoginCredentials) => {
    const response = await api.post<{
      user: AuthUser;
      access: string;
      refresh: string;
    }>("/auth/login/", credentials);
    return response.data;
  },

  register: async (credentials: RegisterCredentials) => {
    const response = await api.post<AuthUser>("/auth/register/", credentials);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get<AuthUser>("/auth/me/");
    return response.data;
  },

  logout: async () => {
    await api.post("/auth/logout/");
  },
};
