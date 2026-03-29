import { BookOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import { ActivityList } from "../../features/activities/components/ActivityList";

const { Title, Text } = Typography;

export const ActivitiesPage = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 text-blue-500">
          <BookOutlined className="text-xl" />
        </div>
        <div>
          <Title level={3} className="!mb-0 !font-bold text-gray-800">
            Minhas Atividades
          </Title>
          <Text type="secondary" className="text-sm">
            Gerencie e acompanhe o progresso das suas tarefas
          </Text>
        </div>
      </div>

      <ActivityList />
    </div>
  );
};
