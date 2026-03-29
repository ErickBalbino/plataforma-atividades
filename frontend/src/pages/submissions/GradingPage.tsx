import { CheckCircleOutlined } from "@ant-design/icons";
import { Alert, Spin, Typography } from "antd";
import { GradeSubmissionCard } from "../../features/submissions/components/GradeSubmissionCard";
import { useSubmissions } from "../../features/submissions/hooks/useSubmissions";

const { Title, Text } = Typography;

export const GradingPage = () => {
  const { data: submissions, isLoading, isError } = useSubmissions();

  if (isLoading) {
    return (
      <div className="flex justify-center flex-col items-center py-20 min-h-[50vh]">
        <Spin size="large" />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert
        message="Erro ao carregar resoluções"
        description="Ocorreu um problema ao buscar as respostas dos alunos. Tente novamente mais tarde."
        type="error"
        showIcon
      />
    );
  }

  const sortedSubmissions = [...(submissions || [])].sort((a, b) => {
    if (a.grade === null && b.grade !== null) return -1;
    if (a.grade !== null && b.grade === null) return 1;
    return (
      new Date(b.turned_in_at).getTime() - new Date(a.turned_in_at).getTime()
    );
  });

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full pb-10">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 text-blue-600">
          <CheckCircleOutlined className="text-xl" />
        </div>
        <div>
          <Title level={3} className="!mb-0 !font-bold text-gray-800">
            Correções Recentes
          </Title>
          <Text type="secondary" className="text-sm">
            Avalie as respostas dos alunos e forneça feedback construtivo.
          </Text>
        </div>
      </div>

      {sortedSubmissions.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          Nenhuma resposta pendente ou avaliada no momento.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {sortedSubmissions.map((sub) => (
            <GradeSubmissionCard key={sub.id} submission={sub} />
          ))}
        </div>
      )}
    </div>
  );
};
