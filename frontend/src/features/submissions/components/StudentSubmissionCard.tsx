import {
  CaretRightOutlined,
  CheckCircleFilled,
  FileTextOutlined,
} from "@ant-design/icons";
import { Tag } from "antd";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { Submission } from "../types";

interface StudentSubmissionCardProps {
  submission: Submission;
}

export const StudentSubmissionCard = ({
  submission,
}: StudentSubmissionCardProps) => {
  const isGraded = submission.grade !== null;
  const formattedDate = dayjs(submission.turned_in_at).format(
    "DD/MM/YYYY HH:mm",
  );
  const isLate = dayjs(submission.activity.due_date).isBefore(dayjs());

  return (
    <div
      className={`bg-white border ${
        isGraded ? "border-green-100" : "border-gray-200"
      } rounded-2xl p-6 shadow-sm flex flex-col gap-4 transition-all hover:shadow-md`}
    >
      <div className="flex justify-between items-start gap-4 flex-wrap">
        <div>
          <Link
            to={`/atividades/${submission.activity.id}`}
            className="group flex flex-col items-start"
          >
            <h3 className="font-bold text-gray-800 text-lg group-hover:text-blue-600 transition-colors">
              {submission.activity.title}
            </h3>
            <span className="text-sm text-gray-500 flex items-center gap-1 mt-1">
              <FileTextOutlined /> Ver detalhes da atividade
            </span>
          </Link>
        </div>
        <div className="flex flex-col items-end gap-2">
          {isGraded ? (
            <Tag
              icon={<CheckCircleFilled />}
              color="success"
              className="m-0 px-3 py-1 font-semibold text-sm"
            >
              Nota: {submission.grade?.toFixed(1)}
            </Tag>
          ) : (
            <Tag color="processing" className="m-0">
              Aguardando Avaliação
            </Tag>
          )}
          <span className="text-xs text-gray-400">
            Enviado em {formattedDate}
          </span>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mt-2">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          O que você enviou:
        </h4>
        <p className="text-gray-700 whitespace-pre-wrap text-[0.95rem]">
          {submission.content}
        </p>
      </div>

      {isGraded && submission.feedback && (
        <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 mt-2 flex flex-col gap-2">
          <h4 className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
            Comentário do Professor:
          </h4>
          <p className="text-gray-800 whitespace-pre-wrap italic">
            "{submission.feedback}"
          </p>
        </div>
      )}

      {!isGraded && !isLate && (
        <div className="mt-2 text-right">
          <Link
            to={`/atividades/${submission.activity.id}`}
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Ainda dá tempo de editar sua resposta{" "}
            <CaretRightOutlined style={{ fontSize: "12px" }} />
          </Link>
        </div>
      )}
    </div>
  );
};
