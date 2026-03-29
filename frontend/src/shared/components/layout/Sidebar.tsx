import {
  BookOutlined,
  CheckCircleOutlined,
  DashboardOutlined,
  PlusCircleOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import { Layout, Menu, MenuProps } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../../../features/auth/hooks/useAuth";

const { Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return { key, icon, children, label } as MenuItem;
}

export const Sidebar = () => {
  const { data: user } = useUser();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems: MenuItem[] = [
    getItem("Dashboard", "dashboard", <DashboardOutlined />),
    getItem("Atividades", "atividades", <BookOutlined />),
    ...(user?.role === "TEACHER"
      ? [
          getItem("Nova Atividade", "nova-atividade", <PlusCircleOutlined />),
          getItem("Correções", "correcoes", <CheckCircleOutlined />),
        ]
      : [
          getItem("Minhas Respostas", "minhas-respostas", <SolutionOutlined />),
        ]),
  ];

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    navigate(`/${e.key}`);
  };

  const selectedKey = location.pathname.split("/")[1] || "dashboard";

  return (
    <Sider
      breakpoint="lg"
      collapsedWidth="0"
      theme="light"
      style={{
        borderRight: "1px solid #f0f0f0",
        height: "100vh",
        position: "sticky",
        top: 0,
        left: 0,
      }}
    >
      <div
        style={{
          padding: "24px 16px",
          textAlign: "center",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <div
          style={{ color: "#1890ff", fontWeight: "bold", fontSize: "1.1rem" }}
        >
          Plataforma de Atividades
        </div>
      </div>

      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        items={menuItems}
        onClick={handleMenuClick}
        style={{ borderRight: 0, marginTop: "12px" }}
      />
    </Sider>
  );
};
