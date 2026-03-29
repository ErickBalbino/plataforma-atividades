import {
  ClockCircleOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Card, Tag, Typography } from "antd";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { useUser } from "../../auth/hooks/useAuth";
import { Activity } from "../types";

const { Text, Title } = Typography;

interface ActivityCardProps {
  activity: Activity;
}

export const ActivityCard = ({ activity }: ActivityCardProps) => {
  const { data: user } = useUser();
  const isTeacher = user?.role === "TEACHER";

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format("DD/MM/YYYY HH:mm");
  };

  const isLate = dayjs(activity.due_date).isBefore(dayjs());

  return (
    <Link to={`/atividades/${activity.id}`}>
      <Card
        hoverable
        className="h-full border border-gray-100 shadow-sm transition-all hover:shadow-md rounded-xl cursor-pointer"
        styles={{ body: { padding: "20px" } }}
      >
        <div className="flex flex-col h-full justify-between gap-4">
          <div>
            <div className="flex justify-between items-start mb-2 gap-4">
              <Title level={4} className="!mb-0 !text-gray-800 line-clamp-2">
                {activity.title}
              </Title>
              <Tag
                icon={<ClockCircleOutlined />}
                color={isLate ? "error" : "success"}
                className="mt-1 shrink-0"
              >
                {formatDate(activity.due_date)}
              </Tag>
            </div>
            <Text className="text-gray-500 line-clamp-3 leading-relaxed">
              {activity.description}
            </Text>
          </div>

          <div className="flex items-center gap-2 pt-4 mt-auto border-t border-gray-50">
            {isTeacher ? (
              <>
                <TeamOutlined className="text-gray-400" />
                <Text type="secondary" className="text-sm">
                  {activity.classroom.name}
                </Text>
              </>
            ) : (
              <>
                <UserOutlined className="text-gray-400" />
                <Text type="secondary" className="text-sm">
                  Prof. {activity.teacher?.email?.split("@")[0] || "Desconhecido"}
                </Text>
              </>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
};
