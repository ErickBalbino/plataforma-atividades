import { authService } from "@/features/auth/services/authService";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { useQueryClient } from "@tanstack/react-query";
import { Avatar, Button, Layout, Space, Tag, Typography } from "antd";
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

  return (
    <AntHeader
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#fff",
        padding: "0 24px",
        borderBottom: "1px solid #f0f0f0",
        height: 64,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <Text strong style={{ fontSize: "1.2rem", color: "#1890ff" }}>
          Plataforma de Atividades
        </Text>
      </div>

      <Space size="large">
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              lineHeight: "1.2",
            }}
          >
            <Text strong style={{ fontSize: "0.9rem" }}>
              {user?.email}
            </Text>
            <Tag
              color={user?.role === "TEACHER" ? "blue" : "green"}
              style={{ margin: 0, fontSize: "0.7rem", width: "fit-content" }}
            >
              {user?.role === "TEACHER" ? "Professor" : "Aluno"}
            </Tag>
          </div>
        </Space>

        <Button
          type="text"
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          style={{ color: "#ff4d4f" }}
        >
          Sair
        </Button>
      </Space>
    </AntHeader>
  );
};
