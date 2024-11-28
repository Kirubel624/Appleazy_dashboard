import React, { useState } from "react";
import { Button, Form, Input, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LockOutlined } from "@ant-design/icons";
import useAPIPrivate from "../../hooks/useAPIPrivate";

const ChangePassword = ({ collapsed }) => {
  const [loading, setLoading] = useState(false);
  const api = useAPIPrivate();
  const { user } = useSelector((state) => state.auth);
  console.log(user, "user");
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      setLoading(true);
      if (values.newPassword !== values.confirmPassword) {
        message.error("New passwords do not match!");
        setLoading(false);
        return;
      }

      const response = await api.patch("/user/change-password", {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        userId: user?.id,
      });

      if (response.status === 200) {
        message.success("Password changed successfully!");
        navigate("/profile");
      }
    } catch (error) {
      message.error(
        error.response?.data?.message || "Failed to change password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`${
        collapsed ? "ml-[52px] mr-2 sm:[80px]" : "ml-[200px]"
      } transition-all ease-in mt-10 pl-10`}
    >
      <div className="flex items-center  border-red-700 justify-center min-h-[80vh] bg-white ml-5 mr-5">
        <div className="w-full max-w-md  border-red-700 p-8 space-y-6 bg-white rounded-lg shadow-lg">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">
              Change Password
            </h2>
            <p className="mt-2 text-gray-600">
              Enter your passwords below to change
            </p>
          </div>

          <Form
            name="change-password"
            className="space-y-4"
            onFinish={onFinish}
            layout="vertical"
          >
            <Form.Item
              name="currentPassword"
              label="Current Password"
              rules={[
                {
                  required: true,
                  message: "Please input your current password!",
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Current Password"
                className="h-10"
              />
            </Form.Item>

            <Form.Item
              name="newPassword"
              label="New Password"
              rules={[
                {
                  required: true,
                  message: "Please input your new password!",
                },
                {
                  min: 6,
                  message: "Password must be at least 6 characters long",
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="New Password"
                className="h-10"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Confirm New Password"
              rules={[
                {
                  required: true,
                  message: "Please confirm your new password!",
                },
                {
                  min: 6,
                  message: "Password must be at least 6 characters long",
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Confirm New Password"
                className="h-10"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ backgroundColor: "#168A53", color: "white" }}
                loading={loading}
                className="w-full h-10 bg-[#168A53] hover:bg-[#0e663d]"
              >
                Change Password
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
