import { Button, Modal } from "antd";
import React from "react";

const CustomModal = ({
  width,
  title,
  children,
  isModalOpen,
  setIsModalOpen,

  centered,
}) => {
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <div>
      <Modal
        width={width}
        title={title}
        centered={centered}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {children}
      </Modal>
    </div>
  );
};

export default CustomModal;
