import { SearchOutlined } from "@ant-design/icons";
import { Alert, Empty, Input, Pagination, Spin } from "antd";
import { useState } from "react";
import { useDebounce } from "../../../shared/hooks/useDebounce";
import { useClassRoomStudents } from "../hooks/useClassRooms";
import { ClassRoomMember } from "../types";

interface ClassRoomStudentsListProps {
  classRoomId: number;
}

export const ClassRoomStudentsList = ({
  classRoomId,
}: ClassRoomStudentsListProps) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const {
    data: response,
    isLoading,
    isError,
  } = useClassRoomStudents(classRoomId, { page, search: debouncedSearch });

  const members = response?.results || [];
  const totalItems = response?.count || 0;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="flex flex-col gap-6 pb-10">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <Input
          placeholder="Buscar alunos por nome ou e-mail..."
          prefix={<SearchOutlined className="text-gray-400" />}
          allowClear
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          size="large"
          className="max-w-md w-full"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16 min-h-[200px]">
          <Spin size="large" tip="Carregando alunos..." />
        </div>
      ) : isError ? (
        <Alert
          message="Erro ao carregar alunos"
          description="Não foi possível obter a lista de alunos desta sala"
          type="error"
          showIcon
        />
      ) : members.length === 0 ? (
        <Empty
          description={
            <span className="text-gray-500 font-medium">
              {search
                ? `Nenhum aluno encontrado para "${search}"`
                : "Nenhum aluno matriculado nesta sala de aula"}
            </span>
          }
          className="py-12"
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {members.map((member: ClassRoomMember) => (
              <div
                key={member.id}
                className="bg-white border border-gray-300 rounded-xl p-5 shadow-sm hover:shadow transition-shadow flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-green-50 text-green-700 font-bold flex items-center justify-center text-lg uppercase">
                  {member.student.name?.[0] ||
                    member.student.username.charAt(0)}
                </div>
                <div className="flex flex-col flex-1 overflow-hidden">
                  <h4 className="font-semibold text-gray-800 line-clamp-1 m-0">
                    {member.student.name || member.student.username}
                  </h4>
                  <span className="text-sm text-gray-500 line-clamp-1 mb-2">
                    {member.student.email}
                  </span>
                  <span className="text-xs text-gray-400 mt-auto pt-2 border-t border-gray-100">
                    Entrou em {formatDate(member.joined_at)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {totalItems > 12 && (
            <div className="flex justify-center pt-4">
              <Pagination
                current={page}
                total={totalItems}
                pageSize={12}
                onChange={(p) => setPage(p)}
                showSizeChanger={false}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};
