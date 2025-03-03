import React, { useEffect, useState } from "react";
import {
  Button,
  Divider,
  Dropdown,
  Form,
  Input,
  InputNumber,
  Select,
  Spin,
  Switch,
  DatePicker,
} from "antd";
import styled from "styled-components";
import {
  ButtonStyle,
  FlexStyle,
  FormStyle,
} from "../../components/commons/CommonStyles";
import rolesService from "./RolesService";
import CommonModal from "../../components/commons/CommonModel";
import RolesPick from "./RolesPick";
import dayjs from "dayjs";
import CommonTable from "../../components/commons/CommonTable";
import { MoreOutlined, ReloadOutlined } from "@ant-design/icons";

import { NavLink } from "react-router-dom";
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

const RolesEdit = ({
  setIsModalOpen,
  isModelOpen,
  mode,
  setMode,
  rolesData,
  searchData,
}) => {
  const [rolesData2, setRolesData2] = useState([]);
  const api = useAPIPrivate();

  const [form] = Form.useForm();
  const [switch2, setSwitch2] = useState("");
  const [loading, setLoading] = useState("");
  const [rolePick, setRolePick] = useState(false);

  useEffect(() => {
    const featchData = async () => {
      try {
        const data = await rolesService.getRole(mode, api);
        form.setFieldsValue({
          role: { ...data, updatedAt: dayjs(data.updatedAt) },
        });
      } catch (err) {}
    };
    if (mode == "") {
    } else {
      featchData();
    }
  }, []);

  const handleReset = () => {
    form.resetFields();
  };

  const rolePickHandler = (data) => {
    console.log("rolePickHandler", data);

    setRolePick(false);
  };

  const onAdd = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const data = await rolesService.rolesDo({
        method: "add_list_to_role",
        payload: { data: rolesData2 },
        api: api,
      });
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

      const data = await rolesService.updateRole(datas.role, mode, api);
      searchData();
      setIsModalOpen(false);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const onFinish = (values) => {
    console.log("===========");
    mode == "" ? handleAddToList(values) : onUpdate(values);
  };
  const handleAddToList = (e) => {
    // e.preventDefault()
    setRolesData2([
      { ...form.getFieldsValue()?.role, _id: new Date().getTime() },
      ...rolesData2,
    ]);
    handleReset();
  };

  const onClick = ({ key }, record) => {
    if (key == "edit") {
      console.log("========", record);

      form.setFieldsValue({ role: record });
      const data = rolesData2.filter((role) => role._id !== record._id);
      setRolesData2(data);
    } else if (key === "delete") {
      console.log("========", record);
      const data = rolesData2.filter((role) => role._id !== record._id);
      setRolesData2(data);
    }
  };
  const items = [
    {
      key: "edit",
      label: <Button type="text">Edit</Button>,
    },
    {
      key: "delete",
      label: <Button type="text"> Delete</Button>,
    },
    {
      key: "3",
      label: <Button type="text"> add Permmision</Button>,
    },
  ];

  const columns = [
    {
      title: " ",
      dataIndex: "action",
      render: (_, recored) => {
        return (
          <Dropdown
            menu={{
              items,
              onClick: (value) => onClick(value, recored),
            }}
            trigger={["click"]}
            placement="bottomLeft"
          >
            <Button
              type="text"
              icon={<MoreOutlined style={{ fontSize: 20 }} />}
              onClick={() => {
                // setModeID(recored._id)
              }}
            ></Button>
          </Dropdown>
        );
      },
    },

    {
      title: "role_name",
      dataIndex: "role_name",
      render: (text, recored) => {
        return (
          <NavLink
            style={{ color: "#2f1dca" }}
            state={recored}
            to={`${recored._id}`}
          >
            {text}
          </NavLink>
        );
      },
    },
  ];

  return (
    <div>
      {/*******  picks **********/}
      {rolePick ? (
        <CommonModal
          width={700}
          isModalOpen={rolePick}
          setIsModalOpen={setRolePick}
        >
          <RolesPick
            setIsModalOpen={setRolePick}
            selectHandler={rolePickHandler}
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
      {/* <button onClick={() => setRolePick(true)}>hhhhhh</button> */}

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
          name={["role", "role_name"]}
          label="role_name"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input className="border-gray-400 py-2" />
        </Form.Item>

        {rolesData2.length > 0 && (
          <CommonTable
            rowSelectionType={"checkbox"}
            data={rolesData2}
            columns={columns}
            total={rolesData2.lenght}
            loadding={loading}
            type={true}
          />
        )}

        <Divider />

        <ButtonStyle>
          <button onClick={() => setIsModalOpen(false)}>cancel</button>

          {mode ? (
            <button type="submit">Submit</button>
          ) : (
            <button type="submit">Add List</button>
          )}

          {!mode && (
            <button
              disabled={rolesData2.length == 0}
              onClick={onAdd}
              className={rolesData2.length > 0 ? "" : "disable"}
              type="submit"
            >
              Submit
            </button>
          )}
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

export default RolesEdit;
