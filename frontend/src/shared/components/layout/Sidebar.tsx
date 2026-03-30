import { authService } from "@/features/auth/services/authService";
import {
  BankOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useQueryClient } from "@tanstack/react-query";
import {
  Button as AntButton,
  Avatar,
  ConfigProvider,
  Layout,
  Menu,
  MenuProps,
  message,
  Tooltip,
  Typography,
} from "antd";
import { LogOutIcon } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../../../features/auth/hooks/useAuth";

const { Sider } = Layout;
const { Text } = Typography;

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
  const location = useLocation();
  const navigate = useNavigate();
  const { data: user } = useUser();
  const queryClient = useQueryClient();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Erro ao sair", error);
    } finally {
      queryClient.clear();
      navigate("/login", { replace: true });
      message.success("Você saiu da plataforma com sucesso.");
    }
  };

  const menuItems: MenuItem[] = [
    getItem("Salas de Aula", "salas", <BankOutlined />),
  ];

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    navigate(`/${e.key}`);
  };

  const isActivePath = (key: string) => {
    const path = location.pathname;
    if (key === "salas") {
      return (
        path.startsWith("/salas") ||
        path.startsWith("/atividades") ||
        path.startsWith("/respostas")
      );
    }
    return path.startsWith(`/${key}`);
  };

  const selectedKey = isActivePath("salas") ? "salas" : "";

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      trigger={null}
      breakpoint="lg"
      collapsedWidth="80"
      width={260}
      theme="dark"
      className="bg-[#137333] h-screen sticky top-0 left-0 shadow-xl"
    >
      <div className="flex flex-col h-full bg-[#137333]">
        <div
          className={`p-2 flex flex-col items-center border-b border-white/10 shrink-0 min-h-[120px] relative transition-all duration-300 ${collapsed ? "justify-center" : ""}`}
        >
          <div
            className={`w-full flex ${collapsed ? "justify-center" : "justify-between items-center"} mb-2 py-2`}
          >
            {!collapsed && (
              <div className="flex justify-start w-full">
                <img
                  src="/logo.png"
                  alt="Logo"
                  className="object-contain transition-all duration-300 filter brightness-0 invert mb-2 w-40"
                />
              </div>
            )}

            <AntButton
              type="text"
              icon={
                collapsed ? (
                  <MenuUnfoldOutlined style={{ fontSize: "20px" }} />
                ) : (
                  <MenuFoldOutlined style={{ fontSize: "20px" }} />
                )
              }
              onClick={() => setCollapsed(!collapsed)}
              className="text-white/70 hover:!text-white hover:!bg-white/10 border-none transition-all duration-300"
              size="large"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 scrollbar-thin scrollbar-thumb-white/20">
          <ConfigProvider
            theme={{
              components: {
                Menu: {
                  itemSelectedBg: "#ffffff",
                  itemSelectedColor: "#137333",
                  itemHoverBg: "rgba(255, 255, 255, 0.1)",
                  itemHoverColor: "#ffffff",
                  itemColor: "rgba(255, 255, 255, 0.8)",
                  itemMarginBlock: 8,
                  itemBorderRadius: 8,
                },
              },
            }}
          >
            <Menu
              mode="inline"
              selectedKeys={[selectedKey]}
              items={menuItems}
              onClick={handleMenuClick}
              className="bg-transparent border-none"
            />
          </ConfigProvider>
        </div>



        <div
          className={`p-4 border-t border-white/10 shrink-0 flex items-center ${collapsed ? "justify-center flex-col gap-4" : "justify-between"}`}
        >
          <div
            className={`flex items-center gap-3 ${collapsed ? "flex-col" : ""}`}
          >
            <Tooltip title={collapsed ? user?.email : ""} placement="right">
              <Avatar
                icon={<UserOutlined />}
                className="bg-white/20 text-white shrink-0 border border-white/10"
                size={41}
              />
            </Tooltip>
            {!collapsed && (
              <div className="flex flex-col overflow-hidden whitespace-nowrap">
                <Text strong className="text-white text-sm line-clamp-1">
                  {user?.name
                    ? user.name.split(" ").slice(0, 2).join(" ")
                    : user?.email?.split("@")[0]}
                </Text>
                <Text className="text-white/60 text-xs line-clamp-1">
                  {user?.role === "TEACHER" ? "Professor" : "Aluno"}
                </Text>
              </div>
            )}
          </div>

          <Tooltip
            title={collapsed ? "Sair da plataforma" : ""}
            placement="right"
          >
            <button
              onClick={handleLogout}
              className={`transition-all transform shrink-0 flex items-center justify-center rounded-xl hover:cursor-pointer bg-white/10 hover:bg-white/20 text-white border-none ${
                collapsed ? "p-2 w-10 h-10" : "p-2.5"
              }`}
              aria-label="Sair"
            >
              <LogOutIcon size={18} />
            </button>
          </Tooltip>
        </div>
      </div>
    </Sider>
  );
};
