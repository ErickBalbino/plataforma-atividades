import { FileDoneOutlined, SearchOutlined } from "@ant-design/icons";
import { Alert, Empty, Input, Pagination, Spin, Typography } from "antd";
import { useState } from "react";
import { StudentSubmissionCard } from "../../features/submissions/components/StudentSubmissionCard";
import { useSubmissions } from "../../features/submissions/hooks/useSubmissions";

const { Title, Text } = Typography;

interface MySubmissionsPageProps {
  classRoomId?: number;
}

export const MySubmissionsPage = ({
  classRoomId: _classRoomId,
}: MySubmissionsPageProps) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const {
    data: response,
    isLoading,
    isError,
  } = useSubmissions({ page, search });

  const submissions = response?.results || [];
  const totalItems = response?.count || 0;

  if (isLoading) {
    return (
      <div className="flex justify-center flex-col items-center py-20 min-h-[50vh]">
        <Spin size="large" tip="Carregando histórico..." />
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

  const filteredSubmissions = submissions.filter(
    (sub) => !_classRoomId || sub.activity.classroom?.id === _classRoomId,
  );

  const sortedSubmissions = [...filteredSubmissions].sort((a, b) => {
    return (
      new Date(b.turned_in_at).getTime() - new Date(a.turned_in_at).getTime()
    );
  });

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full pb-10">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-50 text-green-700">
            <FileDoneOutlined className="text-xl" />
          </div>
          <div>
            <Title level={3} className="!mb-0 !font-bold text-gray-800">
              Minhas Respostas
            </Title>
            <Text type="secondary" className="text-sm">
              Acompanhe o status e as notas do que você já enviou
            </Text>
          </div>
        </div>
        <Input
          placeholder="Buscar nas minhas respostas..."
          prefix={<SearchOutlined className="text-gray-400" />}
          className="w-full md:w-64"
          allowClear
          size="large"
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {totalItems === 0 ? (
        <Empty
          description={
            <span className="text-gray-500 font-medium">
              {search
                ? `Nenhuma resposta encontrada para "${search}"`
                : "Você ainda não enviou respostas para atividades desta sala de aula."}
            </span>
          }
          className="py-20"
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6">
            {sortedSubmissions.map((sub) => (
              <StudentSubmissionCard key={sub.id} submission={sub} />
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <Pagination
              current={page}
              total={totalItems}
              pageSize={12}
              onChange={(p) => setPage(p)}
              showSizeChanger={false}
              className="bg-white p-2 rounded-lg shadow-sm border border-gray-100"
            />
          </div>
        </>
      )}
    </div>
  );
};
