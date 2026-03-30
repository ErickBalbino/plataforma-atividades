import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

const { Content } = Layout;

export const MainLayout = () => {
  return (
    <Layout className="min-h-screen bg-gray-50">
      <Sidebar />
      <Layout className="transition-all duration-300">
        <Header />
        <Content className="m-6 p-6 bg-white rounded-2xl min-h-[280px] shadow-sm border border-gray-100 overflow-x-hidden">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
