import React, { useState } from "react";
import {
  Button,
  Checkbox,
  Form,
  Image,
  Input,
  message,
  Select,
  Upload,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
const { TextArea } = Input;
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
const TrainingEdit = () => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const onFinish = (values) => {
    console.log("Success:", values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };
  const beforeUpload = (file) => {
    console.log("file type: ", file.type);
    const isJpgOrPng = file.type.startsWith("image");
    if (!isJpgOrPng) {
      message.error("You can only upload image file!");
      return Upload.LIST_IGNORE;
    }
    const isLt2M = file.size / 1024 / 1024 < 10;
    if (!isLt2M) {
      message.error("Image must smaller than 10MB!");
      return Upload.LIST_IGNORE;
    }
    return false;
  };
  const [fileList, setFileList] = useState([]);
  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    console.log(newFileList);
  };
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };
  return (
    <div>
      <Form
        name="basic"
        initialValues={{
          remember: true,
        }}
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <div className="flex gap-5">
          <Form.Item
            label="Title"
            name="title"
            className="w-full"
            rules={[
              {
                required: true,
                message: "Please input your username!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Training type"
            name="trainingType"
            className="w-full"
            rules={[
              {
                required: true,
                message: "Please input your username!",
              },
            ]}
          >
            <Select
              className="w-full"
              defaultValue="lucy"
              onChange={handleChange}
              options={[
                {
                  value: "jack",
                  label: "Jack",
                },
                {
                  value: "lucy",
                  label: "Lucy",
                },
                {
                  value: "Yiminghe",
                  label: "yiminghe",
                },
                {
                  value: "disabled",
                  label: "Disabled",
                  disabled: true,
                },
              ]}
            />
          </Form.Item>
        </div>

        <Form.Item
          label="Description"
          name="description"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item
          label="Content"
          name="other_content"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <TextArea rows={4} />
        </Form.Item>

        <div className="my-5">
          <p className="text-xl mb-4"> Images</p>
          <Upload
            //   action="http://localhost:5173"
            listType="picture-card"
            fileList={fileList}
            onChange={onChange}
            onPreview={handlePreview}
            action={null}
            beforeUpload={beforeUpload}
          >
            {fileList.length < 3 && "+ Upload"}
          </Upload>

          {previewImage && (
            <Image
              wrapperStyle={{
                display: "none",
              }}
              preview={{
                visible: previewOpen,
                onVisibleChange: (visible) => setPreviewOpen(visible),
                afterOpenChange: (visible) => !visible && setPreviewImage(""),
              }}
              src={previewImage}
            />
          )}
        </div>
        <div className="my-5">
          <p className="text-xl mb-4"> Images</p>
          <Upload
            //   action="http://localhost:5173"
            listType="picture-card"
            fileList={fileList}
            onChange={onChange}
            onPreview={handlePreview}
            action={null}
            beforeUpload={beforeUpload}
          >
            {fileList.length < 3 && "+ Upload"}
          </Upload>

          {previewImage && (
            <Image
              wrapperStyle={{
                display: "none",
              }}
              preview={{
                visible: previewOpen,
                onVisibleChange: (visible) => setPreviewOpen(visible),
                afterOpenChange: (visible) => !visible && setPreviewImage(""),
              }}
              src={previewImage}
            />
          )}
        </div>

        <div className="my-5">
          <p className="text-xl mb-4"> Images</p>
          <Upload
            //   action="http://localhost:5173"
            listType="picture-card"
            fileList={fileList}
            onChange={onChange}
            onPreview={handlePreview}
            action={null}
            beforeUpload={beforeUpload}
          >
            {fileList.length < 3 && "+ Upload"}
          </Upload>

          {previewImage && (
            <Image
              wrapperStyle={{
                display: "none",
              }}
              preview={{
                visible: previewOpen,
                onVisibleChange: (visible) => setPreviewOpen(visible),
                afterOpenChange: (visible) => !visible && setPreviewImage(""),
              }}
              src={previewImage}
            />
          )}
        </div>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default TrainingEdit;
