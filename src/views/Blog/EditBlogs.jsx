import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import { useForm } from "antd/es/form/Form";

import {
  Modal,
  Form,
  Input,
  Button,
  Upload,
  Avatar,
  Select,
  message,
  Image,
} from "antd";
import {
  UserOutlined,
  PictureOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import useAPIPrivate from "../../hooks/useAPIPrivate";

const EditBlogs = ({
  isEditModalVisible,
  setIsEditModalVisible,
  fetchBlogs,
  setSelectedblogs,
  selectedBlogs,
}) => {
  const api = useAPIPrivate();
  const [loading, setLoading] = useState(false);
  const [form] = useForm();

  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [showFiles, setShowFiles] = useState(true);
  const [filesToUpload, setFilesToUpload] = useState([]);
  const [value, setValue] = useState("");
  const { user, accessToken } = useSelector((state) => state.auth);
  const handleEditing = async (values) => {
    setLoading(true);
    // console.log(values, "create post values");
    const formData = new FormData();
    console.log(filesToUpload, "files to be uploaded");
    formData.append("title", values.title);
    if (filesToUpload.length > 0) {
      formData.append("image", filesToUpload[0]);
    }
    formData.append("description", values.description);
    formData.append("tags", values.tags.join(","));

    formData.append("UserId", user?.id);
    try {
      const response = await api.patch(
        `/blog/${selectedBlogs?.data?.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
          onUploadProgress: (progressEvent) => {
            const { loaded, total } = progressEvent;
            let percentCompleted = Math.round((loaded * 100) / total);
            setUploadPercentage(percentCompleted);
          },
        }
      );
      console.log(response, "edddddddddd");
      if (response.status === 200) {
        console.log("status 201........................");
        message.success("Blogs updated successfully");
        fetchBlogs();
        setIsEditModalVisible(false);
        form.resetFields();
      }
      console.log(response.data, "resposne data");
    } catch (error) {
      console.error(error);
      message.error("Failed to create blogs.");
    } finally {
      setLoading(false);
      setShowFiles(false);
      setFilesToUpload([]);
    }
  };
  const handleChange = (info) => {
    if (info.fileList.length > 0) {
      setShowFiles(true);
      setFilesToUpload([info.fileList[0].originFileObj]);
    } else {
      setShowFiles(false);
      setFilesToUpload([]);
    }
  };

  const beforeUpload = (file) => {
    if (filesToUpload.length < 1) {
      return true;
    }
    message.error("You can only upload one file!");
    return false;
  };

  const handleRemove = () => {
    setShowFiles(false);
    setFilesToUpload([]);
  };
  // useEffect(() => {
  // }, []);
  useEffect(() => {
    console.log(selectedBlogs, "secllllllll");

    if (selectedBlogs) {
      console.log(selectedBlogs, "secllllllll");

      form.setFieldsValue({
        title: selectedBlogs?.data?.title,
        description: selectedBlogs?.data?.description,
        tags: selectedBlogs?.data?.tags?.split(","),
      });
    }
  }, [selectedBlogs, form]);
  console.log(form); // Check if the form instance is valid

  return (
    <>
      <Form
        form={form}
        name="editForm"
        layout="vertical"
        onFinish={handleEditing}>
        <Form.Item
          name="title"
          label="Title"
          className="mt-3"
          rules={[
            { required: true, message: "Please input your blogs title!" },
          ]}>
          <Input placeholder="Enter title" />
        </Form.Item>
        <p className="mb-2">Previous uploaded image</p>
        <Image
          style={{
            width: "30rem",
            height: "16rem",
          }}
          className="w-full h-[16rem] object-cover"
          src={selectedBlogs?.data?.image}
        />
        <Form.Item name="image" label="Image" className="mt-3">
          <Upload
            onRemove={handleRemove}
            onChange={handleChange}
            fileList={filesToUpload.map((file, index) => ({
              uid: index, // Unique uid for each file
              name: file.name,
              status: "done",
              url: URL.createObjectURL(file),
              originFileObj: file,
            }))}
            // showUploadList={showFiles}
            listType="picture"
            className="mt-3"
            showUploadList={{ showPreviewIcon: true, showRemoveIcon: true }}
            // previewFile={true}
            beforeUpload={() => false}
            maxCount={1}>
            <Button icon={<UploadOutlined />}>Select blogs attachment</Button>
          </Upload>
        </Form.Item>

        <Form.Item
          name="description"
          label="Content"
          className="mt-3 h-[240px]"
          rules={[
            { required: true, message: "Please input your blogs content!" },
          ]}>
          <ReactQuill
            className="h-[200px]"
            theme="snow"
            value={form.getFieldValue("description")}
            onChange={setValue}
          />
        </Form.Item>
        <Form.Item name="tags" label="Tags" className="mt-3">
          <Select
            mode="tags"
            style={{
              width: "100%",
            }}
            placeholder="Write tags"
            // onChange={handleChange}
            // options={options}
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="bg-[#000] w-[8rem] text-center hover:border hover:border-black border border-transparent font-robotor text-sm   text-white hover:font-bold hover:bg-white hover:text-black rounded-full ">
            Submit
          </Button>
        </Form.Item>
      </Form>
      {loading && <div>Image Upload Progress: {uploadPercentage}%</div>}
      {loading && uploadPercentage === 100 && (
        <div>Image Upload complete! Saving data</div>
      )}
    </>
  );
};

export default EditBlogs;
