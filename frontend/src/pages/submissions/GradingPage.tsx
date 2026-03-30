import {
  ArrowLeftOutlined,
  RightOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Button,
  Card,
  Input,
  Pagination,
  Spin,
  Tag,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useDebounce } from "../../shared/hooks/useDebounce";

import {
  useActivities,
  useActivitySubmissions,
} from "../../features/activities/hooks/useActivities";

import { Activity } from "../../features/activities/types";
import { GradeSubmissionCard } from "../../features/submissions/components/GradeSubmissionCard";

const { Title, Text } = Typography;

interface GradingPageProps {
  classRoomId?: number;
  initialActivityId?: number;
  onClearActivity?: () => void;
  onSelectActivity?: (id: number) => void;
}

const ActivityListForGrading = ({
  classRoomId,
  onSelect,
  initialActivityId,
}: {
  classRoomId?: number;
  onSelect: (activity: Activity) => void;
  initialActivityId?: number;
}) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const {
    data: response,
    isLoading,
    isError,
  } = useActivities({
    classroom: classRoomId,
    page,
    search: debouncedSearch,
  });

  const [hasSelectedInitial, setHasSelectedInitial] = useState(false);

  useEffect(() => {
    if (initialActivityId && response?.results) {
      if (!hasSelectedInitial) {
        const activity = response.results.find(
          (a) => a.id === initialActivityId,
        );
        if (activity) {
          onSelect(activity);
          setHasSelectedInitial(true);
        }
      }
    } else if (!initialActivityId && hasSelectedInitial) {
      setHasSelectedInitial(false);
    }
  }, [initialActivityId, response, onSelect, hasSelectedInitial]);

  const activities = response?.results || [];
  const totalItems = response?.count || 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100 flex-wrap gap-4">
        <div>
          <Title level={3} className="!mb-0 !font-bold text-gray-800">
            Correções
          </Title>
          <Text type="secondary" className="text-sm">
            Selecione uma atividade para corrigir as respostas enviadas.
          </Text>
        </div>
        <Input
          placeholder="Buscar atividades..."
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

      {isLoading ? (
        <div className="flex justify-center flex-col items-center py-20 min-h-[50vh]">
          <Spin size="large" tip="Carregando atividades..." />
        </div>
      ) : isError ? (
        <Alert
          message="Erro ao carregar atividades"
          description="Ocorreu um problema ao buscar as atividades. Tente novamente mais tarde."
          type="error"
          showIcon
        />
      ) : totalItems === 0 ? (
        <div className="text-center py-20 text-gray-500">
          {search
            ? `Nenhuma atividade encontrada para "${search}"`
            : "Nenhuma atividade nesta sala de aula ainda."}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activities.map((activity) => (
              <Card
                key={activity.id}
                hoverable
                onClick={() => onSelect(activity)}
                className="border border-gray-300 shadow-sm transition-all hover:shadow-md cursor-pointer rounded-xl overflow-hidden"
                styles={{ body: { padding: "16px" } }}
              >
                <div className="flex justify-between items-center gap-4">
                  <div className="flex-1">
                    <Text
                      strong
                      className="text-base text-gray-800 line-clamp-1 block mb-1 font-medium"
                    >
                      {activity.title}
                    </Text>
                    <div className="flex items-center gap-2">
                      <Text type="secondary" className="text-xs font-medium">
                        Entrega: {dayjs(activity.due_date).format("DD/MM/YYYY")}
                      </Text>
                      {dayjs(activity.due_date).isBefore(dayjs()) ? (
                        <Tag
                          color="error"
                          className="text-[10px] m-0 border-0 bg-red-50 text-red-600 font-bold"
                        >
                          Encerrado
                        </Tag>
                      ) : (
                        <Tag
                          color="success"
                          className="text-[10px] m-0 border-0 bg-green-50 text-green-700 font-bold"
                        >
                          Aberto
                        </Tag>
                      )}
                    </div>
                  </div>
                  <RightOutlined className="text-gray-400" />
                </div>
              </Card>
            ))}
          </div>

          <div className="flex justify-center mt-6">
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

const SubmissionsGradingView = ({
  activity,
  onBack,
}: {
  activity: Activity;
  onBack: () => void;
}) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const {
    data: response,
    isLoading,
    isError,
  } = useActivitySubmissions(activity.id, { page, search: debouncedSearch });

  const studentSubmissions = response?.results || [];
  const totalItems = response?.count || 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={onBack}
              aria-label="Voltar para lista de atividades"
              style={{ color: "#5f6368" }}
            />
            <div>
              <Title
                level={3}
                className="!mb-0 !font-bold text-gray-800 line-clamp-1"
              >
                {activity.title}
              </Title>
              <Text type="secondary" className="text-sm font-medium">
                {search
                  ? "Respostas filtradas"
                  : `Respostas enviadas • ${totalItems} alunos na turma`}
              </Text>
            </div>
          </div>
          <Input
            placeholder="Buscar aluno por nome ou e-mail..."
            prefix={<SearchOutlined className="text-gray-400" />}
            allowClear
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            size="large"
            className="w-full md:w-80"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center flex-col items-center py-20 min-h-[50vh]">
          <Spin size="large" tip="Carregando respostas..." />
        </div>
      ) : isError ? (
        <Alert
          message="Erro ao carregar respostas"
          description="Ocorreu um problema ao buscar as respostas desta atividade."
          type="error"
          showIcon
        />
      ) : totalItems === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-400 text-gray-500">
          {search
            ? `Nenhum aluno encontrado para "${search}"`
            : "Esta sala não possui alunos matriculados."}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4">
            {studentSubmissions.map((item: any) => {
              if (item.submission) {
                return (
                  <GradeSubmissionCard
                    key={item.student.id}
                    submission={item.submission}
                  />
                );
              }

              return (
                <Card
                  key={item.student.id}
                  className="border border-gray-200 shadow-sm rounded-xl overflow-hidden bg-white/50"
                  styles={{ body: { padding: "20px" } }}
                >
                  <div className="flex justify-between items-center opacity-70">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center font-bold text-lg uppercase">
                        {item.student.name?.[0] || item.student.username[0]}
                      </div>
                      <div>
                        <Title level={5} className="!mb-0 text-gray-700">
                          {item.student.name || item.student.username}
                        </Title>
                        <Text type="secondary" className="text-xs">
                          {item.student.email}
                        </Text>
                      </div>
                    </div>
                    <Tag
                      color="default"
                      className="m-0 border-0 font-bold px-3 py-1"
                    >
                      NÃO ENTREGUE
                    </Tag>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="flex justify-center mt-6">
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

export const GradingPage = ({
  classRoomId,
  initialActivityId,
  onClearActivity,
  onSelectActivity,
}: GradingPageProps) => {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null,
  );

  // Efeito para resetar ALIAS quando a URL é limpa
  useEffect(() => {
    if (!initialActivityId && selectedActivity) {
      setSelectedActivity(null);
    }
  }, [initialActivityId, selectedActivity]);

  const handleSelect = (activity: Activity) => {
    setSelectedActivity(activity);
    onSelectActivity?.(activity.id);
  };

  const handleBack = () => {
    setSelectedActivity(null);
    onClearActivity?.();
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      {!selectedActivity ? (
        <ActivityListForGrading
          classRoomId={classRoomId}
          onSelect={handleSelect}
          initialActivityId={initialActivityId}
        />
      ) : (
        <SubmissionsGradingView
          activity={selectedActivity}
          onBack={handleBack}
        />
      )}
    </div>
  );
};
