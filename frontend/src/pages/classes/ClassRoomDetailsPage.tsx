import {
  ArrowLeftOutlined,
  CopyOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Alert, Button, Spin, Tabs, Tag, Typography, message } from "antd";
import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ActivityList } from "../../features/activities/components/ActivityList";
import { CreateActivityModal } from "../../features/activities/components/CreateActivityModal";
import { useUser } from "../../features/auth/hooks/useAuth";
import { ClassRoomStudentsList } from "../../features/classes/components/ClassRoomStudentsList";
import { useClassRoom } from "../../features/classes/hooks/useClassRooms";
import { GradingPage } from "../submissions/GradingPage";
import { MySubmissionsPage } from "../submissions/MySubmissionsPage";

const { Title, Text } = Typography;

export function ClassRoomDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const classRoomId = Number(id);
  const navigate = useNavigate();
  const { data: user } = useUser();
  const { data: classroom, isLoading, isError } = useClassRoom(classRoomId);
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get("tab") || "atividades";
  const activityId = searchParams.get("activityId")
    ? Number(searchParams.get("activityId"))
    : undefined;

  const [createModalOpen, setCreateModalOpen] = useState(false);

  const handleTabChange = (key: string) => {
    setSearchParams(
      (prev) => {
        prev.set("tab", key);
        prev.delete("activityId");
        return prev;
      },
      { replace: true },
    );
  };

  const isTeacher = user?.role === "TEACHER";

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spin size="large" />
      </div>
    );
  }

  if (isError || !classroom) {
    return (
      <Alert
        message="Sala de aula não encontrada"
        description="Verifique se você tem acesso a esta sala"
        type="error"
        showIcon
        action={
          <Button onClick={() => navigate("/salas")} type="link">
            Voltar
          </Button>
        }
      />
    );
  }

  const ActivitiesTab = () => (
    <div className="flex flex-col gap-4">
      {isTeacher && (
        <div className="flex justify-end">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateModalOpen(true)}
            aria-label="Criar nova atividade nesta sala"
          >
            Nova atividade
          </Button>
        </div>
      )}
      <ActivityList classRoomId={classRoomId} />
    </div>
  );

  const teacherTabs = [
    {
      key: "atividades",
      label: "Atividades",
      children: <ActivitiesTab />,
    },
    {
      key: "correcoes",
      label: "Correções",
      children: (
        <GradingPage
          classRoomId={classRoomId}
          initialActivityId={activityId}
          onClearActivity={() =>
            setSearchParams(
              (prev) => {
                prev.delete("activityId");
                return prev;
              },
              { replace: true },
            )
          }
          onSelectActivity={(id) =>
            setSearchParams(
              (prev) => {
                prev.set("activityId", String(id));
                return prev;
              },
              { replace: true },
            )
          }
        />
      ),
    },

    {
      key: "alunos",
      label: "Alunos",
      children: <ClassRoomStudentsList classRoomId={classRoomId} />,
    },
  ];

  const studentTabs = [
    {
      key: "atividades",
      label: "Atividades",
      children: <ActivityList classRoomId={classRoomId} />,
    },
    {
      key: "respostas",
      label: "Minhas Respostas",
      children: <MySubmissionsPage classRoomId={classRoomId} />,
    },
  ];

  return (
    <div className="flex flex-col gap-4 max-w-6xl mx-auto w-full">
      <div className="flex items-center gap-4 mb-2 pb-4 border-b border-gray-100">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/salas")}
          aria-label="Voltar para lista de salas"
          style={{ color: "#5f6368" }}
        />
        <div className="flex-1 flex justify-between items-center flex-wrap gap-4">
          <div>
            <Title level={2} className="!mb-1" style={{ color: "#000" }}>
              {classroom.name}
            </Title>
            {!isTeacher && classroom.teacher && (
              <Text className="text-gray-500 font-medium">
                Prof. {classroom.teacher.name.split(" ").slice(0, 2).join(" ")}
              </Text>
            )}
            {isTeacher && (
              <Text type="secondary" className="text-sm">
                Detalhes da sala de aula
              </Text>
            )}
          </div>

          {isTeacher && (
            <div className="flex flex-col items-end gap-1">
              <Text className="text-xs text-gray-500 uppercase font-semibold tracking-wider">
                Código da Sala
              </Text>
              <Tag
                onClick={() => {
                  navigator.clipboard.writeText(classroom.code);
                  message.success("Código copiado!");
                }}
                className="m-0 flex items-center gap-2 px-3 py-1.5 cursor-pointer hover:bg-gray-100 transition-colors bg-gray-50 border border-gray-200 text-gray-700 text-sm"
                style={{ fontFamily: "monospace" }}
              >
                {classroom.code} <CopyOutlined className="text-gray-400" />
              </Tag>
            </div>
          )}
        </div>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={handleTabChange}
        items={isTeacher ? teacherTabs : studentTabs}
        size="middle"
      />

      {isTeacher && (
        <CreateActivityModal
          classRoomId={classRoomId}
          classRoomName={classroom.name}
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
        />
      )}
    </div>
  );
}
