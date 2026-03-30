import axios, { AxiosError } from "axios";
import { ApiErrorResponse } from "../../features/core/types/api";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/",
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

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/login/") &&
      !originalRequest.url?.includes("/auth/refresh/")
    ) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await api.post("/auth/refresh/");
        processQueue(null);
        return api(originalRequest);
      } catch (err) {
        processQueue(err);
        window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

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
