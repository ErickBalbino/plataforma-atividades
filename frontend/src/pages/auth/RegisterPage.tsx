import { Layout, Typography } from "antd";
import { Link } from "react-router-dom";
import { RegisterForm } from "../../features/auth/components/RegisterForm";

const { Title, Text } = Typography;
const { Content } = Layout;

export function RegisterPage() {
  return (
    <Layout className="min-h-screen bg-[#f8f8f8]">
      <Content className="flex items-center justify-center p-6">
        <div className="w-full max-w-[450px]">
          <div className="p-8 pb-10 border border-gray-200 rounded-2xl bg-white shadow-md shadow-gray-200">
            <div className="text-center mb-8">
              <img
                src="/logo.png"
                alt="Plataforma de Atividades"
                className="w-40 mx-auto mb-2"
              />
              <Title
                level={2}
                className="!mb-2 !font-bold"
                style={{ color: "#000" }}
              >
                Criar Conta
              </Title>
              <Text type="secondary" className="text-base text-gray-700">
                Junte-se à nossa Plataforma Educacional
              </Text>
            </div>
            <RegisterForm />
          </div>

          <div className="text-center mt-6">
            <Text className="text-sm font-medium text-gray-700">
              Já tem uma conta?{" "}
              <Link
                to="/login"
                className="!text-[#137333] !important font-medium hover:underline hover:text-[#0f9d58]"
              >
                Faça login
              </Link>
            </Text>
          </div>

          <div className="text-center mt-4">
            <Text type="secondary" className="text-xs text-gray-700">
              &copy; {new Date().getFullYear()} Plataforma de Atividades
              Escolares
            </Text>
          </div>
        </div>
      </Content>
    </Layout>
  );
}
