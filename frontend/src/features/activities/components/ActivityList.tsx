import { SearchOutlined } from "@ant-design/icons";
import { Alert, Empty, Input, Pagination, Spin } from "antd";
import { useState } from "react";
import { useDebounce } from "../../../shared/hooks/useDebounce";
import { useActivities } from "../hooks/useActivities";
import { ActivityCard } from "./ActivityCard";

interface ActivityListProps {
  classRoomId?: number;
}

export const ActivityList = ({ classRoomId }: ActivityListProps) => {
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

  const activities = response?.results || [];
  const totalItems = response?.count || 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <Input
          placeholder="Buscar atividades..."
          prefix={<SearchOutlined className="text-gray-400" />}
          allowClear
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          size="large"
          className="max-w-md"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20 min-h-[300px]">
          <Spin size="large" tip="Carregando atividades..." />
        </div>
      ) : isError ? (
        <Alert
          message="Erro ao carregar atividades"
          description="Ocorreu um problema ao buscar as atividades. Tente novamente mais tarde"
          type="error"
          showIcon
        />
      ) : totalItems === 0 ? (
        <Empty
          description={
            <span className="text-gray-500 font-medium">
              {search
                ? `Nenhuma atividade encontrada para "${search}"`
                : "Nenhuma atividade nesta sala de aula"}
            </span>
          }
          className="my-16"
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
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

