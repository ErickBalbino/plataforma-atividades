import { FileDoneOutlined } from "@ant-design/icons";
import { Alert, Spin, Typography } from "antd";
import { StudentSubmissionCard } from "../../features/submissions/components/StudentSubmissionCard";
import { useSubmissions } from "../../features/submissions/hooks/useSubmissions";

const { Title, Text } = Typography;

export const MySubmissionsPage = () => {
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
        message="Erro ao carregar histórico"
        description="Ocorreu um problema ao buscar suas respostas anteriores. Tente novamente mais tarde"
        type="error"
        showIcon
      />
    );
  }

  const sortedSubmissions = [...(submissions || [])].sort((a, b) => {
    return (
      new Date(b.turned_in_at).getTime() - new Date(a.turned_in_at).getTime()
    );
  });

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full pb-10">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 text-blue-600">
          <FileDoneOutlined className="text-xl" />
        </div>
        <div>
          <Title level={3} className="!mb-0 !font-bold text-gray-800">
            Minhas Respostas
          </Title>
          <Text type="secondary" className="text-sm">
            Acompanhe o status e as notas de tudo o que você enviou
          </Text>
        </div>
      </div>

      {sortedSubmissions.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          Você ainda não respondeu nenhuma atividade. As atividades da sua turma
          aparecerão no seu Início
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {sortedSubmissions.map((sub) => (
            <StudentSubmissionCard key={sub.id} submission={sub} />
          ))}
        </div>
      )}
    </div>
  );
};
