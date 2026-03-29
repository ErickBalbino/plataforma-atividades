import { Layout, Typography } from "antd";
import { LoginForm } from "../../features/auth/components/LoginForm";

const { Title, Text } = Typography;
const { Content } = Layout;

export function LoginPage() {
  return (
    <Layout className="min-h-screen bg-white">
      <Content className="flex items-center justify-center p-6">
        <div className="w-full max-w-[450px]">
          <div className="text-center mb-6">
            <img
              src="/C:/Users/erick/.gemini/antigravity/brain/f47a1f58-3b8c-472c-aade-266faf6cce72/educational_login_illustration_png_1774750673833.png"
              alt="Plataforma de Atividades"
              className="w-48 mx-auto mb-6 opacity-90"
            />
            <Title
              level={2}
              className="!mb-2 !font-bold"
              style={{ color: "#1a1a1a" }}
            >
              Bem-vindo de volta
            </Title>
            <Text type="secondary" className="text-base">
              Acesse sua conta educacional
            </Text>
          </div>

          <div
            className="p-8 pb-10 border border-gray-100 rounded-2xl bg-white"
            style={{ boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)" }}
          >
            <LoginForm />
          </div>

          <div className="text-center mt-12">
            <Text type="secondary" className="text-xs opacity-60">
              &copy; {new Date().getFullYear()} Plataforma de Atividades
              Escolares
            </Text>
          </div>
        </div>
      </Content>
    </Layout>
  );
}
