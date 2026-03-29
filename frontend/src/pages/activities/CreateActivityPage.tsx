import { FileAddOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import { CreateActivityForm } from "../../features/activities/components/CreateActivityForm";

const { Title, Text } = Typography;

export const CreateActivityPage = () => {
  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-50 text-green-600">
          <FileAddOutlined className="text-xl" />
        </div>
        <div>
          <Title level={3} className="!mb-0 !font-bold text-gray-800">
            Nova Atividade
          </Title>
          <Text type="secondary" className="text-sm">
            Crie uma nova atividade e atribua a uma turma específica.
          </Text>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
        <CreateActivityForm />
      </div>
    </div>
  );
};
