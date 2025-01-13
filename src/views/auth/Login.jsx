import React, { useState } from "react";
import { Form, Input, Button, DatePicker, message } from "antd";
import {
  GoogleOutlined,
  GithubOutlined,
  FacebookOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { loginAsync } from "./authReducer";
import { Link, Navigate, useNavigate } from "react-router-dom";
const Login = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onFinish = async (values) => {
    setLoading(true);
    console.log("Success:", values);
    const { payload } = await dispatch(loginAsync(values));
    console.log(payload, "response of login successful");
    setLoading(false);
    if (payload?.success) {
      message.success("Login successful");
      navigate("/");
    } else {
      message.error("Invalid email or password");
    }
  };

  // const onFinishFailed = (errorInfo) => {
  //   console.log("Failed:", errorInfo);
  // };

  return (
    <div className="flex items-center  justify-center lg:justify-between  borde border-red-900 min-h-screen bg-gray-10">
      <div className="bg-white p-8 borde lg:ml-[10%] m-0   border-green-900 shadow-g rounded-lg w- max--md max-w-[800px]  lg:w-1/3 ">
        <div className="mb-8 text-start">
          <img
            className="w-[10rem] "
            src="https://appleazy.nyc3.cdn.digitaloceanspaces.com/web-content/Untitled-1_Recovered_mbgim5.png"
          />

          <p className="text-gray-500 mt-4">Welcome!</p>
          <h2 className="text-3xl font-bold mt-4">Log In</h2>
        </div>
        <Form
          wrapperCol={{ span: 24 }}
          labelCol={{ span: 24 }}
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          // onFinishFailed={onFinishFailed}
          className="space-y-4">
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}>
            <Input
              type="email"
              placeholder="Email"
              className="rounded bg-blue-100"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please input your password!" },
            ]}>
            <Input.Password
              placeholder="Password"
              className="rounded bg-blue-100"
            />
          </Form.Item>

          <div className="flex border- border-red-900 justify-between items-center">
            <Link
              to="/forgot-password"
              type="link"
              className="text-[#168a53] underline">
              Forgot Password?
            </Link>
          </div>

          <Form.Item>
            <button
              type="submit"
              className="w-full bg-[#168a53] py-2 px-2 hover:bg-[#267c54] text-white rounded">
              {loading ? (
                <ClipLoader
                  color="#FFFFF"
                  loading={loading}
                  //  cssOverride={override}
                  className=" rounded-full"
                  size={20}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              ) : (
                "LOGIN"
              )}
            </button>
          </Form.Item>
        </Form>

        {/* <div className="text-center text-gray-500 mb-4">or continue with</div>

        <div className="flex justify-center space-x-4 mb-4">
          <Button shape="circle" icon={<GoogleOutlined />} />
          <Button shape="circle" icon={<GithubOutlined />} />
          <Button shape="circle" icon={<FacebookOutlined />} />
        </div> */}

        {/* <div className="text-center text-gray-500 mt-4">
          Don’t have an account yet?
          <button className="text-[#168a53] ml-1 underline">
            Sign up for free
          </button>
        </div> */}
      </div>
      <div className="borde hidden lg:flex  bg-[#9affd1] w-[30rem] h-screen rounded-l-3xl  items-center justify-center border-red-900 w-1/">
        <img
          className="scale-x-[-1] ml-[-80%]  w-[25rem] borde border-red-900"
          src="/logo2.png"
        />
      </div>
    </div>
  );
};

export default Login;
