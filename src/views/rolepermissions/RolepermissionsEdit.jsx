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
  Dropdown,
} from "antd";
import styled from "styled-components";
import { PlusOutlined } from "@ant-design/icons";
import {
  ButtonStyle,
  FlexStyle,
  FormStyle,
} from "../../components/commons/CommonStyles";
import rolepermissionsService from "./RolepermissionsService";
import CommonModal from "../../components/commons/CommonModel";
import RolepermissionsPick from "./RolepermissionsPick";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import UsersPick from "../users/UsersPick";
import RolesPick from "../roles/RolesPick";

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

const RolepermissionsEdit = ({
  setIsModalOpen,
  isModelOpen,
  mode,
  setMode,
  rolepermissionsData,
  searchData,
}) => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const [read, setRead] = useState("");
  const [create, setCreate] = useState("");
  const [update, setUpdate] = useState("");
  const [delete2, setDelete2] = useState("");
  const [readOnly, setReadOnly] = useState("");
  const [loading, setLoading] = useState("");
  const [userPick, setUserPick] = useState(false);
  const [userPickData, setUserPickData] = useState([]);
  const [rolePick, setRolePick] = useState(false);
  const [rolePickData, setRolePickData] = useState([]);

  useEffect(() => {
    const featchData = async () => {
      try {
        const data = await rolepermissionsService.getRolepermission(mode);
        form.setFieldsValue({
          rolepermission: { ...data, updatedAt: dayjs(data.updatedAt) },
        });
      } catch (err) {}
    };
    if (mode == "") {
      form.setFieldsValue({
        rolepermission: {
          read: false,
          update: false,
          destroy: false,
          create: false,
        },
      });
    } else {
      featchData();
    }
  }, []);

  const handleReset = () => {
    form.resetFields(); // Reset form fields
  };

  const userPickHandler = (data) => {
    setUserPickData(data);
    setRolePickData([]);

    setUserPick(false);
  };

  const rolePickHandler = (data) => {
    setRolePickData(data);
    setUserPickData([]);

    setRolePick(false);
  };

  const onAdd = async (datas) => {
    try {
      console.log("data", datas.rolepermission);

      setLoading(true);
      let val;
      let data2;
      if (userPickData.length > 0) {
        val = "user";
        data2 = [...userPickData];
      } else {
        val = "role";
        data2 = [...rolePickData];
      }

      const data = await rolepermissionsService.rolepermissionDo({
        method: "add_list_to_rolepermission",
        payload: { data: data2, type: val, perm: datas.rolepermission },
        id,
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

      const data = await rolepermissionsService.updateRolepermission(
        datas.rolepermission,
        mode
      );
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

  const onClick = ({ key }) => {
    if (key == "user") {
      setUserPick(true);
    } else if (key === "group") {
      setRolePick(true);
    }
  };

  const items = [
    {
      key: "user",
      label: <Button type="text">User</Button>,
    },
    {
      key: "group",
      label: <Button type="text">Role</Button>,
    },
  ];

  return (
    <div>
      {/*******  picks **********/}

      {userPick ? (
        <CommonModal
          width={700}
          title={"Select User"}
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

      {rolePick ? (
        <CommonModal
          title={"Select Role"}
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
      <Dropdown
        menu={{
          items,
          onClick: (value) => onClick(value),
        }}
        trigger={"click"}
        placement="bottom"
      >
        <Button style={{ width: 50, height: 50 }} className="icon-button">
          <PlusOutlined
            style={{ fontSize: 35, marginLeft: -7 }}
            className="icon"
          />
        </Button>
      </Dropdown>
      <span>
        {userPickData.length > 0
          ? userPickData.length + "Users Selected"
          : rolePickData.length > 0
          ? rolePickData.length + " Roles Selected"
          : ""}
      </span>
      <FormStyle
        form={form}
        layout="vertical"
        name="nest-messages"
        onFinish={onFinish}
        onError={() => {}}
        validateMessages={validateMessages}
      >
        <Divider style={{ margin: 7 }} />

        <FlexStyle>
          <Form.Item name={["rolepermission", "create"]} label="create">
            <Switch
              checked={create}
              onChange={(value) => setCreate(value)}
              style={{ background: create ? "blue" : "gray" }}
            />
          </Form.Item>

          <Form.Item name={["rolepermission", "read"]} label="read">
            <Switch
              checked={read}
              onChange={(value) => setRead(value)}
              style={{ background: read ? "blue" : "gray" }}
            />
          </Form.Item>

          <Form.Item name={["rolepermission", "update"]} label="update">
            <Switch
              checked={update}
              onChange={(value) => setUpdate(value)}
              style={{ background: update ? "blue" : "gray" }}
            />
          </Form.Item>

          <Form.Item name={["rolepermission", "destroy"]} label="destroy">
            <Switch
              checked={delete2}
              onChange={(value) => setDelete2(value)}
              style={{ background: delete2 ? "blue" : "gray" }}
            />
          </Form.Item>
          <Form.Item name={["rolepermission", "readOnly"]} label="readOnly">
            <Switch
              checked={readOnly}
              onChange={(value) => setReadOnly(value)}
              style={{ background: readOnly ? "blue" : "gray" }}
            />
          </Form.Item>
        </FlexStyle>
        {/* <Form.Item name={['rolepermission', 'date']}  label="date">
            <DatePicker format={'YYYY/MM/DD'} />
        </Form.Item> */}
        <Divider style={{ margin: 10 }} />

        <ButtonStyle>
          <button onClick={() => setIsModalOpen(false)}>cancel</button>
          <button
            className={
              userPickData.length == 0 && rolePickData.length == 0
                ? "disable"
                : ""
            }
            disabled={userPickData.length == 0 && rolePickData.length == 0}
            type="submit"
          >
            Submit
          </button>
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

export default RolepermissionsEdit;
