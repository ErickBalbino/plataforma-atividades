import { Alert, Empty, Spin } from "antd";
import { useActivities } from "../hooks/useActivities";
import { ActivityCard } from "./ActivityCard";

export const ActivityList = () => {
  const { data: activities, isLoading, isError } = useActivities();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spin size="large" />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert
        message="Erro ao carregar atividades"
        description="Ocorreu um problema ao buscar suas atividades. Tente novamente mais tarde."
        type="error"
        showIcon
      />
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <Empty
        description={
          <span className="text-gray-500">Nenhuma atividade no momento</span>
        }
        className="my-16"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {activities.map((activity) => (
        <ActivityCard key={activity.id} activity={activity} />
      ))}
    </div>
  );
};
