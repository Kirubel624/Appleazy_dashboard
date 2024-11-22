import React, { useState } from "react";
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
} from "antd";
import {
  UserOutlined,
  PictureOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import useAPIPrivate from "../../hooks/useAPIPrivate";

const AddBlogs = ({ isModalVisible, setIsModalVisible, fetchBlogs }) => {
  const api = useAPIPrivate();
  const [loading, setLoading] = useState(false);
  const [form] = useForm();
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [showFiles, setShowFiles] = useState(true);
  const [filesToUpload, setFilesToUpload] = useState([]);
  const [value, setValue] = useState("");
  const { user, accessToken } = useSelector((state) => state.auth);
  const handlePosting = async (values) => {
    setLoading(true);
    // console.log(values, "create post values");
    const formData = new FormData();
    console.log(filesToUpload, "files to be uploaded");
    formData.append("title", values.title);
    if (filesToUpload.length > 0) {
      formData.append("image", filesToUpload[0]);
    }
    formData.append("description", values.content);
    formData.append("UserId", user.id);

    // values.tags?.map((t) => {
    formData.append("tags", values.tags.join(","));
    // }); []

    console.log("values", values);
    formData.append("author", user?._id);
    setLoading(true);

    try {
      const response = await api.post("/api/v1/blog", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          let percentCompleted = Math.round((loaded * 100) / total);
          setUploadPercentage(percentCompleted);
        },
      });
      if (response.status === 201) {
        message.success("Blogs added successfully");
        fetchBlogs();
        setIsModalVisible(false);
      }
      console.log(response.data);
    } catch (error) {
      console.error(error);
      message.error("Failed to create blogs.");
    } finally {
      setLoading(false);
      setShowFiles(false);

      form.resetFields();
      setFilesToUpload([]);
    }
    // console.log(response);
    // if (response) {
    // }
    // setIsModalVisible(false);
    // form.resetFields();
    // setFilesToUpload([]);

    // console.log(
    //   response,
    //   "resposne of group craetion_+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"
    // );
    // setLoading(false);
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
  return (
    <Modal
      title="Create a Blogs"
      open={isModalVisible}
      width={800}
      // onOk={handleOk}
      footer={null}
      onCancel={() => setIsModalVisible(false)}
    >
      <Form
        name="postForm"
        layout="vertical"
        onFinish={handlePosting}
        form={form}
      >
        <Form.Item
          name="title"
          label="Title"
          className="mt-3"
          rules={[
            { required: true, message: "Please input your blogs title!" },
          ]}
        >
          <Input placeholder="Enter title" />
        </Form.Item>
        <Form.Item
          name="image"
          label="Image"
          className="mt-3"
          rules={[{ required: true, message: "Please input image!" }]}
        >
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
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Select blogs attachment</Button>
          </Upload>
        </Form.Item>

        <Form.Item
          name="content"
          label="Content"
          className="mt-3 h-[240px]"
          rules={[
            { required: true, message: "Please input your blogs content!" },
          ]}
        >
          <ReactQuill
            className="h-[200px]"
            theme="snow"
            value={value}
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
            className="bg-[#000] w-[8rem] text-center hover:border hover:border-black border border-transparent font-robotor text-sm   text-white hover:font-bold hover:bg-white hover:text-black rounded-full "
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
      {loading && <div>Image Upload Progress: {uploadPercentage}%</div>}
      {loading && uploadPercentage === 100 && (
        <div>Image Upload complete! Saving data</div>
      )}
    </Modal>
  );
};

export default AddBlogs;
