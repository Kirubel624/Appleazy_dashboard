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
  Tag,
} from "antd";
import styled from "styled-components";
import {
  ButtonStyle,
  FlexStyle,
  FormStyle,
} from "../../components/commons/CommonStyles";
import exerciseService from "./ExerciseService";
import CommonModal from "../../components/commons/CommonModel";
import ExercisePick from "./ExercisePick";
import dayjs from "dayjs";

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

const ExerciseEdit = ({
  setIsModalOpen,
  isModelOpen,
  mode,
  setMode,
  exerciseData,
  searchData,
}) => {
  const [form] = Form.useForm();
  const [switch2, setSwitch2] = useState("");
  const [loading, setLoading] = useState("");
  const [exercisPick, setExercisPick] = useState(false);
  const [choice, setChoice] = useState("");
  const [inputValue, setInputValue] = useState("");
  useEffect(() => {
    const featchData = async () => {
      try {
        const data = await exerciseService.getExercis(mode);
        form.setFieldsValue({
          exercis: { ...data, updatedAt: dayjs(data.updatedAt) },
        });
        setChoice(data?.choice);
      } catch (err) {}
    };
    if (mode == "") {
      form.setFieldsValue({
        exercis: { excerciceType: "one", trainingType: "all" },
      });
    } else {
      featchData();
    }
  }, []);

  const handleReset = () => {
    form.resetFields(); // Reset form fields
  };

  const exercisPickHandler = (data) => {
    console.log("exercisPickHandler", data);

    setExercisPick(false);
  };

  const onAdd = async (datas) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("type", datas?.exercis.type);
      formData.append("question", datas?.exercis.question);
      formData.append("excerciceType", datas?.exercis.excerciceType);
      formData.append("trainingType", datas?.exercis.trainingType);
      formData.append("choice", choice);

      const data = await exerciseService.createExercis(formData);
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
      const formData = new FormData();
      formData.append("type", datas?.exercis.type);
      formData.append("question", datas?.exercis.question);
      formData.append("excerciceType", datas?.exercis.excerciceType);
      formData.append("trainingType", datas?.exercis.trainingType);
      formData.append("choice", choice);
      const data = await exerciseService.updateExercis(formData, mode);
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
    <Container>
      {/*******  picks **********/}
      {exercisPick ? (
        <CommonModal
          width={700}
          isModalOpen={exercisPick}
          setIsModalOpen={setExercisPick}
        >
          <ExercisePick
            setIsModalOpen={setExercisPick}
            selectHandler={exercisPickHandler}
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
      {/* <button onClick={() => setExercisPick(true)}>hhhhhh</button> */}

      <FormStyle
        form={form}
        layout="vertical"
        name="nest-messages"
        onFinish={onFinish}
        onError={() => {}}
        validateMessages={validateMessages}
      >
        <div className="flex gap-7">
          <Form.Item
            name={["exercis", "type"]}
            label="Type"
            className=" flex-1 p-2"
            rules={[
              {
                required: true,
                message: "Please select type!",
              },
            ]}
          >
            <Select className="border-gray-400 " placeholder="select your type">
              <Option value="choice">Choice</Option>
              <Option value="short_answer">Short Answer</Option>
            </Select>
          </Form.Item>

          <Form.Item
            className=" flex-1"
            name={["exercis", "question"]}
            label="Question"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input.TextArea className="border-gray-400 py-2" />
          </Form.Item>
        </div>
        <div className="flex gap-8 ">
          <Form.Item
            className=" flex-1"
            name={["exercis", "excerciceType"]}
            label="Excercise Type"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              className="border-gray-400 "
              defaultValue={"one"}
              placeholder="select your type"
            >
              <Option value="one">Excercise one</Option>
              <Option value="two">Excercise two</Option>
              <Option value="three">Excercise three</Option>
              <Option value="four">Excercise four</Option>
              <Option value="five">Excercise five</Option>
              <Option value="six">Excercise six</Option>
            </Select>
          </Form.Item>
          <Form.Item
            className=" flex-1"
            name={["exercis", "trainingType"]}
            label="Training type"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              className="w-full"
              defaultValue="all"
              // onChange={handleChange}
              options={[
                {
                  label: "all",
                  value: "all",
                },
                {
                  label: "Training one",
                  value: "training_one",
                },
                {
                  label: "Training two",
                  value: "training_two",
                },
                {
                  label: "Training three",
                  value: "training_three",
                },
                {
                  label: "Training four",
                  value: "training_four",
                },
              ]}
            />
          </Form.Item>
        </div>

        <p className="text-lg">Choice</p>
        <div className="flex flex-wrap g-4 items-center my-4">
          {choice &&
            choice.split("*+*").map(
              (c) =>
                c && (
                  <Tag
                    className="border bg-slate-200  px-5 py-[5px]"
                    bordered={false}
                    closable
                  >
                    {c}
                  </Tag>
                )
            )}

          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onPressEnter={(e) => {
              e.preventDefault();
              console.log("input:", e.target.value);
              setChoice(choice + "*+*" + e.target.value);
              setInputValue("");
            }}
            className="border-gray-400 my-2  w-32"
          />
        </div>
        {/* <Form.Item
          className=" flex-1"
          name={["exercis", "files"]}
          label="files"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input className="border-gray-400 py-2" />
        </Form.Item> */}

        <ButtonStyle>
          <button onClick={() => setIsModalOpen(false)}>cancel</button>
          <button type="submit">Submit</button>
        </ButtonStyle>
      </FormStyle>
    </Container>
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
const Container = styled.div`
  .ant-select-selector {
    padding: 20;
  }
`;

export default ExerciseEdit;
