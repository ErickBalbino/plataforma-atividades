import { Form, Input, Modal } from "antd";
import { useState } from "react";
import { useJoinClassRoom } from "../hooks/useClassRooms";

interface JoinClassRoomModalProps {
  open: boolean;
  onClose: () => void;
}

export const JoinClassRoomModal = ({
  open,
  onClose,
}: JoinClassRoomModalProps) => {
  const [code, setCode] = useState("");
  const { mutate, isPending } = useJoinClassRoom(() => {
    setCode("");
    onClose();
  });

  const handleSubmit = () => {
    const trimmed = code.trim();
    if (!trimmed) return;
    mutate(trimmed);
  };

  return (
    <Modal
      title="Entrar em sala de aula"
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      okText="Entrar"
      cancelText="Cancelar"
      confirmLoading={isPending}
      okButtonProps={{ disabled: !code.trim(), className: "border-none" }}
      cancelButtonProps={{
        danger: true,
        type: "text",
        className: "bg-red-100 hover:bg-red-200 font-medium text-red-600",
      }}
      destroyOnHidden
    >
      <Form layout="vertical" className="mt-4">
        <Form.Item
          label="Código"
          extra="Peça o código ao professor responsável pela sala"
        >
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Ex: A1B2C3"
            size="large"
            maxLength={6}
            aria-label="Código da sala de aula"
            onPressEnter={handleSubmit}
            autoFocus
            style={{ letterSpacing: "0.15em", fontWeight: 600 }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
