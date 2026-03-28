import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-screen bg-[#f0f2f5]">
      <Result
        status="404"
        title="404"
        subTitle="Desculpe, a página que você está procurando não existe."
        extra={
          <Button type="primary" onClick={() => navigate("/")}>
            Voltar para o Início
          </Button>
        }
      />
    </div>
  );
}
