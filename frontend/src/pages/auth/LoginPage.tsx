import { Card, Layout, Typography } from "antd";
import { LoginForm } from "../../features/auth/components/LoginForm";

const { Title, Text } = Typography;
const { Content } = Layout;

export function LoginPage() {
  return (
    <Layout className="min-h-screen bg-[#f0f2f5]">
      <Content className="flex items-center justify-center p-6">
        <Card
          className="w-full max-w-[400px] shadow-sm"
          styles={{ body: { padding: "40px 32px" } }}
        >
          <div className="text-center mb-8">
            <Title level={2} className="!mb-2">
              Plataforma de Atividades
            </Title>
            <Text type="secondary">
              Entre com suas credenciais para continuar
            </Text>
          </div>

          <LoginForm />

          <div className="text-center mt-4">
            <Text type="secondary" className="text-xs">
              &copy; {new Date().getFullYear()} Plataforma Educacional
            </Text>
          </div>
        </Card>
      </Content>
    </Layout>
  );
}
