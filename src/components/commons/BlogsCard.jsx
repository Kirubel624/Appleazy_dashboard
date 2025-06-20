import React from "react";
import { Card, Button, Modal, Input, Image } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { confirm } = Modal;

const BlogsCard = ({
  blogsItem,
  onDelete,
  setSelectedBlogs,
  selectedblogs,
  setIsEditModalVisible,
}) => {
  const showConfirm = () => {
    confirm({
      title: "Are you sure you want to delete this blogs?",
      onOk() {
        onDelete(blogsItem.id);
      },
      onCancel() {},
    });
  };

  const handleEdit = () => {
    console.log("inside edit");
    setSelectedBlogs({
      ...selectedblogs,
      id: blogsItem._id,
      data: { ...blogsItem },
    });
    setIsEditModalVisible(true);
  };

  return (
    <Card
      className="shadow-md mb-4 h-full"
      title={blogsItem.title}
      extra={
        <div className="flex space-x-2">
          <Button
            type="primary"
            className="bg-[#000000]"
            icon={<EditOutlined className="text-white" />}
            onClick={handleEdit}
          />
          <Button danger icon={<DeleteOutlined />} onClick={showConfirm} />
        </div>
      }>
      <div className="flex items-center justify-start gap-4 pt-3">
        <p className="text-[#168A53] font-robotor font-[600]">
          {blogsItem?.tag}
        </p>
        <div className="w-[6px] h-[6px] bg-[#168A53] rounded-full" />
        <p className="text-[#168A53] font-robotor font-[600]">
          {blogsItem?.readTime} min read
        </p>
      </div>
      {blogsItem?.image ? (
        <div className="image-container">
          <Image
            height={200}
            width={"100%"}
            className="object-cover"
            src={blogsItem?.image}
          />
        </div>
      ) : (
        <p className="bg-gray-300 w-full h-[200px] flex items-center justify-center text-center">
          No images available
        </p>
      )}
      <div className="flex items-center justify-between">
        <p>Author: {blogsItem?.User?.name}</p>
        <p className="text-gray-500 text-sm">
          Date: {dayjs(blogsItem.createdAt).format("DD/MM/YYYY")}
        </p>
      </div>
    </Card>
  );
};

export default BlogsCard;
