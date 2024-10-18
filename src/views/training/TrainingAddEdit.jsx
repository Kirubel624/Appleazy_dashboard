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
import trainingService from "./TrainingService";
import CommonModal from "../../components/commons/CommonModel";
import TrainingPick from "./TrainingPick";
import dayjs from "dayjs";
import CommonTable from "../../components/commons/CommonTable";
import { MoreOutlined, ReloadOutlined } from "@ant-design/icons";

import { NavLink } from "react-router-dom";
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

const TrainingEdit = ({
  setIsModalOpen,
  isModelOpen,
  mode,
  setMode,
  trainingData,
  searchData,
}) => {
  const [trainingData2, setTrainingData2] = useState([]);

  const [form] = Form.useForm();
  const [switch2, setSwitch2] = useState("");
  const [loading, setLoading] = useState("");
  const [traininPick, setTraininPick] = useState(false);

  useEffect(() => {
    const featchData = async () => {
      try {
        const data = await trainingService.getTrainin(mode);
        form.setFieldsValue({
          trainin: { ...data, updatedAt: dayjs(data.updatedAt) },
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

  const traininPickHandler = (data) => {
    console.log("traininPickHandler", data);

    setTraininPick(false);
  };

  const onAdd = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const data = await trainingService.trainingDo({
        method: "add_list_to_trainin",
        payload: { data: trainingData2 },
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

      const data = await trainingService.updateTrainin(datas.trainin, mode);
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
    setTrainingData2([
      { ...form.getFieldsValue()?.trainin, _id: new Date().getTime() },
      ...trainingData2,
    ]);
    handleReset();
  };

  const onClick = ({ key }, record) => {
    if (key == "edit") {
      console.log("========", record);

      form.setFieldsValue({ trainin: record });
      const data = trainingData2.filter(
        (trainin) => trainin._id !== record._id
      );
      setTrainingData2(data);
    } else if (key === "delete") {
      console.log("========", record);
      const data = trainingData2.filter(
        (trainin) => trainin._id !== record._id
      );
      setTrainingData2(data);
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
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.luohanacademy.com"
        >
          3rd menu item
        </a>
      ),
    },
  ];

  const columns = [
    {
      title: "title",
      dataIndex: "title",
    },

    {
      title: "description",
      dataIndex: "description",
    },

    {
      title: "content",
      dataIndex: "content",
    },

    {
      title: "training_type",
      dataIndex: "training_type",
    },
  ];

  return (
    <div>
      {/*******  picks **********/}
      {traininPick ? (
        <CommonModal
          width={700}
          isModalOpen={traininPick}
          setIsModalOpen={setTraininPick}
        >
          <TrainingPick
            setIsModalOpen={setTraininPick}
            selectHandler={traininPickHandler}
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
      <button onClick={() => setTraininPick(true)}>hhhhhh</button>

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
          name={["trainin", "title"]}
          label="title"
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
          name={["trainin", "description"]}
          label="description"
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
          name={["trainin", "content"]}
          label="content"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input className="border-gray-400 py-2" />
        </Form.Item>

        <Form.Item
          name={["trainin", "training_type"]}
          label="training_type"
          className=" flex-1"
          rules={[
            {
              required: true,
              message: "Please select trainingType!",
            },
          ]}
        >
          <Select
            className="border-gray-400 "
            placeholder="select your trainingType"
          >
            <Option value="value1">Value1</Option>
            <Option value="value2">Value2</Option>
          </Select>
        </Form.Item>

        {trainingData2.length > 0 && (
          <CommonTable
            rowSelectionType={"checkbox"}
            data={trainingData2}
            columns={columns}
            total={trainingData2.lenght}
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
              disabled={trainingData2.length == 0}
              onClick={onAdd}
              className={trainingData2.length > 0 ? "" : "disable"}
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

export default TrainingEdit;
