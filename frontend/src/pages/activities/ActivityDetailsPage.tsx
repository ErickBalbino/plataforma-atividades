import { ArrowLeftOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { Alert, Spin, Tag, Typography } from "antd";
import dayjs from "dayjs";
import { Link, useParams } from "react-router-dom";
import { useActivity } from "../../features/activities/hooks/useActivities";
import { SubmissionForm } from "../../features/submissions/components/SubmissionForm";
import { useUser } from "../../features/auth/hooks/useAuth";

const { Title, Text, Paragraph } = Typography;

export const ActivityDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const activityId = parseInt(id || "0", 10);
  
  const { data: user } = useUser();
  const { data: activity, isLoading, isError } = useActivity(activityId);

  const isStudent = user?.role === "STUDENT";

  if (isLoading) {
    return (
      <div className="flex justify-center flex-col items-center py-20 min-h-[50vh]">
        <Spin size="large" />
      </div>
    );
  }

  if (isError || !activity) {
    return (
      <Alert
        message="Atividade não encontrada."
        description="Esta atividade não existe ou você não tem permissão para acessá-la."
        type="error"
        showIcon
      />
    );
  }

  const isLate = dayjs(activity.due_date).isBefore(dayjs());
  const formattedDate = dayjs(activity.due_date).format("DD/MM/YYYY [às] HH:mm");

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto w-full pb-10">
      <div className="flex items-center">
        <Link 
          to="/atividades" 
          className="text-gray-500 hover:text-blue-600 transition-colors flex items-center gap-2"
        >
          <ArrowLeftOutlined /> Voltar para lista
        </Link>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
        <div className="flex justify-between items-start gap-6 border-b border-gray-100 pb-6 mb-6 flex-wrap">
          <div>
            <Title level={2} className="!mb-2 !font-bold text-gray-800">
              {activity.title}
            </Title>
            <Text type="secondary" className="text-base flex items-center gap-4">
              <span>Prof. {activity.teacher.email.split('@')[0]}</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span>{activity.classroom.name}</span>
            </Text>
          </div>
          
          <Tag 
            icon={<ClockCircleOutlined />} 
            color={isLate ? "error" : "processing"}
            className="text-sm px-3 py-1 m-0"
          >
            Prazo: {formattedDate}
          </Tag>
        </div>

        <div className="prose prose-blue max-w-none text-gray-700">
          <Paragraph className="whitespace-pre-wrap leading-relaxed text-[1.05rem]">
            {activity.description}
          </Paragraph>
        </div>
      </div>

      {isStudent && (
        <div className="bg-white border border-blue-100 rounded-2xl p-8 shadow-sm">
          <SubmissionForm 
            activityId={activity.id} 
            dueDate={activity.due_date} 
          />
        </div>
      )}
    </div>
  );
};
