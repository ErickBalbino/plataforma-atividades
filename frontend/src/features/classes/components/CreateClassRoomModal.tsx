import { Form, Input, Modal } from "antd";
import { useState } from "react";
import { useCreateClassRoom } from "../hooks/useClassRooms";

interface CreateClassRoomModalProps {
  open: boolean;
  onClose: () => void;
}

export const CreateClassRoomModal = ({
  open,
  onClose,
}: CreateClassRoomModalProps) => {
  const [name, setName] = useState("");
  const { mutate, isPending } = useCreateClassRoom(() => {
    setName("");
    onClose();
  });

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    mutate({ name: trimmed });
  };

  return (
    <Modal
      title="Nova sala de aula"
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      okText="Criar"
      cancelText="Cancelar"
      confirmLoading={isPending}
      okButtonProps={{ disabled: !name.trim(), className: "border-none" }}
      cancelButtonProps={{
        danger: true,
        type: "text",
        className: "bg-red-100 hover:bg-red-200 font-medium text-red-600",
      }}
      destroyOnHidden
    >
      <Form layout="vertical" className="mt-4">
        <Form.Item label="Nome">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Matemática — 3º Ano"
            size="large"
            maxLength={100}
            aria-label="Nome da sala de aula"
            onPressEnter={handleSubmit}
            autoFocus
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
