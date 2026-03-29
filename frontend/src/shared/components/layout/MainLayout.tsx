import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

const { Content } = Layout;

export const MainLayout = () => {
  return (
    <Layout style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <Sidebar />
      <Layout>
        <Header />
        <Content
          style={{
            margin: "24px",
            padding: "24px",
            background: "#fff",
            borderRadius: "8px",
            minHeight: 280,
            boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
