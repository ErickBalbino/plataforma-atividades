import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider } from "antd";
import ptBR from "antd/locale/pt_BR";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        locale={ptBR}
        theme={{
          token: {
            colorPrimary: "#137333",
            borderRadius: 8,
            colorBgLayout: "#f8f9fa",
            colorText: "#202124",
            colorTextSecondary: "#5f6368",
            colorBorder: "#9ca3af",
            colorPrimaryBorder: "#137333",


            fontFamily:
              'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial',
          },
          components: {
            Layout: {
              headerBg: "#ffffff",
              siderBg: "#ffffff",
            },
          },
        }}
      >
        <App />
      </ConfigProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
