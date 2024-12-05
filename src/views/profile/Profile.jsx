import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Upload,
  message,
  Typography,
  Space,
  Modal,
} from "antd";
import {
  UploadOutlined,
  UserOutlined,
  MailOutlined,
  EditOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { update_User, updateProfileAsync } from "../auth/authReducer";
import styled from "styled-components";
import useAPIPrivate from "../../hooks/useAPIPrivate";

const { Title } = Typography;

const StyledContainer = styled.div`
  max-width: 600px;
  padding: 24px;
  border-radius: 8px;
`;

const StyledForm = styled(Form)`
  .ant-form-item-label {
    font-weight: bold;
  }
`;

const Profile = ({ collapsed }) => {
  const { user } = useSelector((state) => state.auth);
  const [form] = Form.useForm();
  const api = useAPIPrivate();
  const dispatch = useDispatch();
  const [verifyEmailModal, setVerifyEmailModal] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const onFinish = async (values) => {
    try {
      const response = await api.post(`/user/newcode`, {
        email: values.email,
      });
      if (response.status === 200) {
        setVerifyEmailModal(true);
      }
    } catch (error) {
      console.log(error, "error in profile");
    }
  };
  const handleVerifyEmail = async (values) => {
    try {
      console.log(values, "values in profile");
      const resVerify = await api.post(`/user/verify-email`, {
        code: values.verificationCode,
        email: form.getFieldValue("email"),
      });
      if (resVerify.status === 201) {
        setVerifyLoading(true);
        setVerifyEmailModal(false);
        dispatch(updateProfileAsync({ id: user?.id, data: values }))
          .then(() => {
            dispatch(update_User(values));
            message.success("Profile updated successfully");
          })
          .catch((error) => {
            // message.error("Failed to update profile,error:", error);
          });
      }
    } catch (error) {
      console.log(error, "error in profile");
      message.error("Invalid verification code");
    }
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <StyledContainer
      className={`${
        collapsed ? "ml-[80px]" : "ml-[200px]"
      } transition-all ease-in mt-10 pl-10`}
    >
      <Modal
        title="Verify Email"
        open={verifyEmailModal}
        onCancel={() => setVerifyEmailModal(false)}
        footer={null}
      >
        <Form
          name="verify-email"
          onFinish={handleVerifyEmail}
          layout="vertical"
        >
          <Form.Item
            name="verificationCode"
            label="Verification Code"
            rules={[
              {
                required: true,
                message:
                  "Please input the verification code sent to your email!",
              },
            ]}
          >
            <Input
              prefix={<LockOutlined />}
              placeholder="Enter verification code"
            />
          </Form.Item>

          <Form.Item>
            <Space className="w-full justify-end">
              <Button onClick={() => setVerifyEmailModal(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={verifyLoading}>
                Verify
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Title level={2} style={{ marginBottom: "24px" }}>
        Update Profile
      </Title>
      <StyledForm
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          email: user?.email,
          name: user?.name,
          username: user?.username,
        }}
      >
        <Form.Item
          name="email"
          label="Email"
          rules={[
            {
              required: true,
              type: "email",
              message: "Please input your email!",
            },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Please input your name!" }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Name" />
        </Form.Item>

        <Form.Item
          name="username"
          label="Username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input prefix={<EditOutlined />} placeholder="Username" />
        </Form.Item>

        <Form.Item>
          <Space style={{ width: "100%", justifyContent: "center" }}>
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
              type="submit"
            >
              Update Profile
            </button>
          </Space>
        </Form.Item>
      </StyledForm>
    </StyledContainer>
  );
};

export default Profile;
