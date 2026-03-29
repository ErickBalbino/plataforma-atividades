import axios, { AxiosError } from "axios";
import { ApiErrorResponse } from "../../features/core/types/api";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const formattedError: ApiErrorResponse = {
      message: "Ocorreu um erro inesperado. Tente novamente",
    };

    if (error.response && error.response.data) {
      const data = error.response.data as Record<string, any>;

      if (data.detail) {
        formattedError.message = data.detail;
      } else if (
        data.non_field_errors &&
        Array.isArray(data.non_field_errors)
      ) {
        formattedError.message = data.non_field_errors[0];
      } else if (typeof data === "object") {
        formattedError.message =
          "Verifique os dados enviados e tente novamente";
        formattedError.errors = data;
      }
    } else if (error.message) {
      formattedError.message = error.message;
    }

    return Promise.reject(formattedError);
  },
);

export default api;
