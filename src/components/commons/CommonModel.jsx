import React, { useState } from "react";
import { Button, Modal } from "antd";
const CommonModal = ({
  children,
  isModalOpen,
  setIsModalOpen,
  setSelectedTemplate,
  handleSubmit,
  width,
  title,
}) => {
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    if (setSelectedTemplate) {
      setSelectedTemplate(null);
    }
  };
  return (
    <>
      <Modal
        width={width}
        footer={false}
        title={title}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {children}
      </Modal>
    </>
  );
};
export default CommonModal;
