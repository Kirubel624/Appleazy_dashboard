import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  Spin,
  Switch,
  DatePicker,
  Divider,
} from "antd";
import styled from "styled-components";
import {
  ButtonStyle,
  FlexStyle,
  FormStyle,
} from "../../components/commons/CommonStyles";
import usersService from "./UsersService";
import CommonModal from "../../components/commons/CommonModel";
import UsersPick from "./UsersPick";
import dayjs from "dayjs";
import useAPIPrivate from "../../hooks/useAPIPrivate";

const { Option } = Select;

const validateMessages = {
  required: "${label} is required!",
  types: {
    email: "${label} is not a valid email!",
    number: "${label} is not a valid number!",
  },
  number: {
    range: "${label} must be between ${min} and ${max}",
  },
};

const UsersEdit = ({
  setIsModalOpen,
  isModelOpen,
  mode,
  setMode,
  usersData,
  searchData,
}) => {
  const api = useAPIPrivate();

  const [form] = Form.useForm();
  const [switch2, setSwitch2] = useState("");
  const [loading, setLoading] = useState("");
  const [userPick, setUserPick] = useState(false);

  useEffect(() => {
    const featchData = async () => {
      try {
        const data = await usersService.getUser(mode, api);
        console.log("what-----------:", data);
        form.setFieldsValue({
          user: { ...data, password: "" },
        });
      } catch (err) {}
    };
    if (mode == "") {
    } else {
      featchData();
    }
  }, []);

  const handleReset = () => {
    form.resetFields(); // Reset form fields
  };

  const userPickHandler = (data) => {
    console.log("userPickHandler", data);

    setUserPick(false);
  };

  const onAdd = async (datas) => {
    try {
      setLoading(true);

      const data = await usersService.createUser(datas.user, api);
      setIsModalOpen(false);
      searchData();

      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const onUpdate = async (datas) => {
    try {
      setLoading(true);

      const data = await usersService.updateUser(datas.user, mode, api);
      searchData();
      setIsModalOpen(false);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const onFinish = (values) => {
    mode == "" ? onAdd(values) : onUpdate(values);
  };

  return (
    <div>
      {/*******  picks **********/}
      {userPick ? (
        <CommonModal
          width={700}
          isModalOpen={userPick}
          setIsModalOpen={setUserPick}
        >
          <UsersPick
            setIsModalOpen={setUserPick}
            selectHandler={userPickHandler}
          />
        </CommonModal>
      ) : (
        ""
      )}

      {loading ? (
        <SpinStyle>
          <Spin style={{ color: "#fff" }} size="large" />
        </SpinStyle>
      ) : (
        ""
      )}
      {/* <button onClick={() => setUserPick(true)}>hhhhhh</button> */}

      <FormStyle
        form={form}
        layout="vertical"
        name="nest-messages"
        onFinish={onFinish}
        onError={() => {}}
        validateMessages={validateMessages}
      >
        <Form.Item
          className=" flex-1"
          name={["user", "name"]}
          label="name"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input className="border-gray-400 py-2" />
        </Form.Item>

        <Form.Item
          className=" flex-1"
          name={["user", "username"]}
          label="username"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input className="border-gray-400 py-2" />
        </Form.Item>

        <Form.Item
          className=" flex-1"
          name={["user", "email"]}
          label="email"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input className="border-gray-400 py-2" />
        </Form.Item>

        <Form.Item
          className=" flex-1"
          name={["user", "password"]}
          label="password"
        >
          <Input className="border-gray-400 py-2" />
        </Form.Item>

        <ButtonStyle>
          <button onClick={() => setIsModalOpen(false)}>cancel</button>
          <button type="submit">Submit</button>
        </ButtonStyle>
      </FormStyle>
    </div>
  );
};

const SpinStyle = styled.div`
  /* border: 1px solid; */
  width: 50px;
  height: 50px;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 100;
  display: flex;
  border-radius: 120px;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 40%;

  .ant-spin-dot .ant-spin-dot-spin {
    background-color: red;
  }
`;

export default UsersEdit;
