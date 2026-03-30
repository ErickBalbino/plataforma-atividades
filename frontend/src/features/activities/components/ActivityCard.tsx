import {
  ClockCircleOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Card, Tag, Typography } from "antd";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
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
    <Link to={`/atividades/${activity.id}`} className="block h-full">
      <Card
        hoverable
        className="h-full border border-gray-300 shadow-sm transition-all hover:shadow-md rounded-xl cursor-pointer"
        styles={{ body: { padding: "20px", height: "100%" } }}
      >
        <div className="flex flex-col h-full">
          <div className="flex-1">
            <Tag
              icon={<ClockCircleOutlined />}
              color={isLate ? "error" : "success"}
              className="mt-1 shrink-0 font-medium"
            >
              {formatDate(activity.due_date)}
            </Tag>

            <div className="flex justify-between items-start mb-2 gap-2">
              <div className="flex flex-col gap-1 w-full">
                <Title
                  level={4}
                  className="!mb-0 !text-gray-800 line-clamp-3 leading-tight"
                >
                  {activity.title}
                </Title>
                {!isTeacher && activity.is_submitted && (
                  <Tag
                    color="cyan"
                    className="w-fit font-medium border-cyan-200 mt-1"
                  >
                    Respondida
                  </Tag>
                )}
              </div>
            </div>
            <Text className="text-gray-500 line-clamp-3 leading-relaxed block mb-4">
              {activity.description}
            </Text>
          </div>

          <div className="flex items-center gap-2 pt-4 mt-auto border-t border-gray-50 shrink-0">
            {isTeacher ? (
              <>
                <TeamOutlined className="text-gray-400" />
                <Text type="secondary" className="text-sm font-medium">
                  {activity.classroom.name}
                </Text>
              </>
            ) : (
              <>
                <UserOutlined className="text-gray-400" />
                <Text type="secondary" className="text-sm font-medium">
                  Prof.{" "}
                  {activity.teacher?.name.split(" ").slice(0, 2).join(" ")}
                </Text>
              </>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
};
