import {
  CopyOutlined,
  LoginOutlined,
  PlusOutlined,
  ScheduleOutlined,
  SearchOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Button,
  Card,
  Empty,
  Input,
  message,
  Pagination,
  Spin,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../features/auth/hooks/useAuth";
import { CreateClassRoomModal } from "../../features/classes/components/CreateClassRoomModal";
import { JoinClassRoomModal } from "../../features/classes/components/JoinClassRoomModal";
import { useClassRooms } from "../../features/classes/hooks/useClassRooms";
import { useDebounce } from "../../shared/hooks/useDebounce";

const { Title, Text } = Typography;

export function ClassRoomsPage() {
  const { data: user } = useUser();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const {
    data: response,
    isLoading,
    isError,
  } = useClassRooms({ page, search: debouncedSearch });

  const navigate = useNavigate();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [joinModalOpen, setJoinModalOpen] = useState(false);

  const isTeacher = user?.role === "TEACHER";
  const classrooms = response?.results || [];
  const totalItems = response?.count || 0;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleCopyCode = (e: React.MouseEvent, code: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    message.success("Código copiado para a área de transferência");
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100 flex-wrap gap-4">
        <div>
          <Title level={3} className="!mb-1 text-gray-900">
            Salas de Aula
          </Title>
          <Text className="text-gray-500 text-sm">
            {isTeacher
              ? "Gerencie suas salas de aula"
              : "Salas de aula em que você participa"}
          </Text>
        </div>

        <div className="flex items-center gap-3">
          <Input
            placeholder="Buscar salas..."
            prefix={<SearchOutlined className="text-gray-400" />}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-64"
            allowClear
            size="large"
          />
          {isTeacher ? (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setCreateModalOpen(true)}
              size="large"
              className="shadow-sm"
            >
              Nova Sala
            </Button>
          ) : (
            <Button
              type="primary"
              icon={<LoginOutlined />}
              onClick={() => setJoinModalOpen(true)}
              size="large"
              className="shadow-sm"
            >
              Entrar em Sala
            </Button>
          )}
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center py-20 min-h-[50vh] flex-col items-center">
          <Spin size="large" tip="Carregando salas..." />
        </div>
      )}

      {isError && (
        <Alert
          message="Erro ao carregar salas de aula"
          description="Tente recarregar a página."
          type="error"
          showIcon
          className="mb-4"
        />
      )}

      {!isLoading && !isError && totalItems === 0 && (
        <Empty
          description={
            <span className="text-gray-500 font-medium">
              {search
                ? `Nenhuma sala encontrada para "${search}"`
                : isTeacher
                  ? "Você ainda não criou nenhuma sala de aula"
                  : "Você ainda não entrou em nenhuma sala de aula"}
            </span>
          }
          className="py-20"
        >
          {!search &&
            (isTeacher ? (
              <Button type="primary" onClick={() => setCreateModalOpen(true)}>
                Criar minha primeira sala
              </Button>
            ) : (
              <Button type="primary" onClick={() => setJoinModalOpen(true)}>
                Entrar em uma sala
              </Button>
            ))}
        </Empty>
      )}

      {!isLoading && !isError && classrooms.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {classrooms.map((classroom) => (
              <Card
                key={classroom.id}
                hoverable
                onClick={() => navigate(`/salas/${classroom.id}`)}
                className="border border-gray-300 shadow-sm transition-all hover:shadow-md cursor-pointer rounded-2xl overflow-hidden"
                styles={{ body: { padding: "0" } }}
              >
                <div className="h-28 bg-[#137333] flex flex-col justify-center items-center">
                  <Title
                    level={4}
                    className="!text-white line-clamp-2 font-bold text-center w-full px-8"
                    style={{ lineHeight: "1.2" }}
                  >
                    {classroom.name}
                  </Title>

                  {!isTeacher && classroom.teacher && (
                    <Text className="text-white/80 text-xs mt-2 block font-medium uppercase tracking-wider">
                      Prof.{" "}
                      {classroom.teacher.name || classroom.teacher.username}
                    </Text>
                  )}
                </div>

                <div className="p-5 flex flex-col gap-4">
                  <div className="flex justify-between items-center text-gray-800 text-sm">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5">
                        <Tooltip title="Alunos inscritos">
                          <TeamOutlined className="text-gray-500" />{" "}
                          <span className="font-semibold">
                            {classroom.students_count ?? 0}
                          </span>
                        </Tooltip>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Tooltip title="Atividades geradas">
                          <ScheduleOutlined className="text-gray-500" />{" "}
                          <span className="font-semibold">
                            {classroom.activities_count ?? 0}
                          </span>
                        </Tooltip>
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 font-medium">
                      {formatDate(classroom.created_at)}
                    </span>
                  </div>

                  {isTeacher && (
                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                      <Text className="text-xs text-gray-500 uppercase font-semibold tracking-wider">
                        Código da Sala
                      </Text>
                      <Tag
                        onClick={(e) => handleCopyCode(e, classroom.code)}
                        className="m-0 flex items-center gap-1 px-3 py-1 cursor-pointer hover:bg-gray-100 transition-colors bg-gray-50 border border-gray-200 text-gray-800 font-medium"
                        style={{ fontFamily: "monospace", fontSize: "14px" }}
                      >
                        {classroom.code}{" "}
                        <CopyOutlined className="text-gray-400" />
                      </Tag>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>

          <div className="flex justify-center mt-8 pb-10">
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

      <CreateClassRoomModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
      <JoinClassRoomModal
        open={joinModalOpen}
        onClose={() => setJoinModalOpen(false)}
      />
    </div>
  );
}
