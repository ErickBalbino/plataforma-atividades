import { authService } from "@/features/auth/services/authService";
import { UserOutlined } from "@ant-design/icons";
import { useQueryClient } from "@tanstack/react-query";
import { Avatar, Dropdown, Layout, MenuProps, Tag, Typography } from "antd";
import { LogOutIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../features/auth/hooks/useAuth";

const { Header: AntHeader } = Layout;
const { Text } = Typography;

export const Header = () => {
  const { data: user } = useUser();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Erro ao sair", error);
    } finally {
      queryClient.clear();
      navigate("/login", { replace: true });
    }
  };

  const menuItems: MenuProps["items"] = [
    {
      key: "profile-info",
      label: (
        <div className="flex flex-col py-2 px-1 min-w-[200px] cursor-default">
          <Text strong className="text-gray-800 text-base">
            {user?.name
              ? user.name.split(" ").slice(0, 2).join(" ")
              : user?.email?.split("@")[0]}
          </Text>
          <Text className="text-gray-500 text-sm mb-3">{user?.email}</Text>
          <div>
            <Tag
              color={user?.role === "TEACHER" ? "blue" : "green"}
              className="m-0 text-xs"
            >
              {user?.role === "TEACHER" ? "Professor" : "Aluno"}
            </Tag>
          </div>
        </div>
      ),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      danger: true,
      icon: <LogOutIcon size={18} />,
      label: "Sair da plataforma",
      onClick: handleLogout,
      className: "py-2.5",
    },
  ];

  return (
    <AntHeader
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#fff",
        padding: "0 24px",
        borderBottom: "1px solid #e5e7eb",
        height: 64,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <Text strong style={{ fontSize: "1.2rem", color: "#000" }}>
          Plataforma de Atividades
        </Text>
      </div>

      <Dropdown
        menu={{ items: menuItems }}
        placement="bottomRight"
        trigger={["click"]}
      >
        <Avatar
          icon={<UserOutlined />}
          size="large"
          className="cursor-pointer bg-green-50 text-green-700 hover:bg-green-100 transition-colors border border-green-200"
        />
      </Dropdown>
    </AntHeader>
  );
};
