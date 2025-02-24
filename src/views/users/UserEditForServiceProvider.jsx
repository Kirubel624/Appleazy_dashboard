import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  Select,
  Switch,
  Spin,
  message
  
} from "antd";
import { SearchOutlined } from "@ant-design/icons";

import styled from "styled-components";
import {
  ButtonStyle,
  FlexStyle,
  FormStyle,
} from "../../components/commons/CommonStyles";
import userService from "./UsersService";
import CommonModal from "../../components/commons/CommonModel";
import WoredaPick from "../woreda/WeredaPick";
import ZonePick from "../zone/zonePick";
import StatePick from "../state/StatePick";

const { Option } = Select;

const UsersEdit = ({
  setIsModalOpen,
  isModelOpen,
  mode,
  setMode,
  usersData,
  setUsersData,
  searchData,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [wereda, setWereda] = useState({});
  const [state, setState] = useState({});
  const [zone, setZone] = useState({});
  const type = Form.useWatch(["user", "type"], form) || "";

  const [switch2, setSwitch2] = useState(true); // Default to "on" (true)
  const [weredaPick, setWeredaPick] = useState(false);
  const [statePick, setStatePick] = useState(false);
  const [zonePick, setZonePick] = useState(false);

  useEffect(() => {
   
 
      // Set default values for "add" mode
      form.setFieldsValue({
        user: {
          type: "woreda_level",
          isServiceProvider: true,
        },
      });
      setSwitch2(true); // Default to "on" for the switch
    
  }, []);

  const handleReset = () => {
    form.resetFields();
  };

  const weredaPickHandler = (data) => {
    console.log("dkdkdkkdkd".data);
    setWereda(data);
    form.setFieldsValue({
      user: {
        ...form.getFieldsValue().user,
        wereda: data._id,
      },
    });
    setWeredaPick(false);
  };

  const statePickHandler = (data) => {
    setState(data);
    form.setFieldsValue({
      user: {
        ...form.getFieldsValue().user,
        state: data._id,
      },
    });
    setStatePick(false);
  };

  const zonePickHandler = (data) => {
    setZone(data);
    form.setFieldsValue({
      user: {
        ...form.getFieldsValue().user,
        zone: data._id,
      },
    });
    setZonePick(false);
  };

  const onAdd = async (datas) => {
    try {
      setLoading(true);
      await userService.createUser(datas.user);
      message.success("User added successfully!");
      setIsModalOpen(false);
      searchData();
      // setLoading(false);
    } catch (err) {
      message.error("Failed to add user. Please try again!",err);
      setLoading(false);
    }
  };

//   const onUpdate = async (datas) => {
//     try {
//       setLoading(true);
//       const updatedUser = await userService.updateUser(datas.user, mode);
//       setUsersData((prev) =>
//         prev.map((user) => (user._id === mode ? updatedUser : user))
//       );
//       setIsModalOpen(false);
//       setLoading(false);
//     } catch (err) {
//       setLoading(false);
//     }
//   };

  const onFinish = (values) => {
  onAdd(values) ;
  };

  return (
    <div>

      {loading ? (
        <SpinStyle>
          <Spin size="large" />
        </SpinStyle>
      ) : null}

{statePick ? (
        <CommonModal
          width={700}
          isModalOpen={statePick}
          setIsModalOpen={setStatePick}
        >
          <StatePick
            setIsModalOpen={setStatePick}
            selectHandler={statePickHandler}
          />
        </CommonModal>
      ) : (
        ""
      )}
{zonePick ? (
        <CommonModal
          width={700}
          isModalOpen={zonePick}
          setIsModalOpen={setZonePick}
        >
          <ZonePick
            setIsModalOpen={setZonePick}
            selectHandler={zonePickHandler}
          />
        </CommonModal>
      ) : (
        ""
      )}
 {weredaPick ? (
        <CommonModal
          width={700}
          isModalOpen={weredaPick}
          setIsModalOpen={setWeredaPick}
        >
          <WoredaPick
            setIsModalOpen={setWeredaPick}
            selectHandler={weredaPickHandler}
          />
        </CommonModal>
      ) : (
        ""
      )}




      <FormStyle
        form={form}
        layout="vertical"
        name="nest-messages"
        onFinish={onFinish}
      >
        <FlexStyle>
          <Form.Item
            className="flex-1"
            name={["user", "fullName"]}
            label="Full Name"
            rules={[{ required: true }]}
          >
            <Input className="border-gray-400 py-2" />
          </Form.Item>
          <Form.Item
            className="flex-1"
            name={["user", "email"]}
            label="Email"
            rules={[
              {
                type: "email",
                required: true,
              },
            ]}
          >
            <Input className="border-gray-400 py-2" />
          </Form.Item>
          <Form.Item
            className=" flex-1 border-gray-400"
            name={["user", "username"]}
            label="Username"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input className="border-gray-400 py-2" />
          </Form.Item>
        </FlexStyle>
        <FlexStyle>
          <Form.Item
            name={["user", "gender"]}
            label="Gender"
            className=" flex-1"
            rules={[
              {
                required: true,
                message: "Please select gender!",
              },
            ]}
          >
            <Select
              className="border-gray-400 "
              placeholder="select  gender"
            >
              <Option value="male">Male</Option>
              <Option value="female">Female</Option>
            </Select>
          </Form.Item>

          <Form.Item
            rules={[
              {
                required: true,
                message: "Please select Phone Number!",
              },
            ]}
            className=" flex-1"
            name={["user", "phoneNumber"]}
            label="Phone Number"
          >
            <Input className="border-gray-400 py-2" />
          </Form.Item>
        </FlexStyle>

        <div className="flex gap-2">
          <Form.Item
            name={["user", "status"]}
            label="Status"
            className=" flex-1 "
            rules={[
              {
                required: true,
                message: "Please select status!",
              },
            ]}
          >
            <Select
              className="border-gray-400 "
              placeholder="select  status"
            >
              <Option value={true}>Active</Option>
              <Option value={false}>Inactive</Option>
            </Select>
          </Form.Item>
          <Form.Item
            className=" flex-1 border-gray-400"
            name={["user", "location"]}
            label="Location"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input className="border-gray-400 py-2" />
          </Form.Item>
        </div>
        {/* <Form.Item className=" flex-1" name={["user", "sector"]} label="Sector">
          <div className="flex items-center bg-[#F5F5F5]">
            <div className="flex-1 bg-white">
              <Input
                value={sector?.name}
                disabled
                className="border-none py-2 bg-red-700  "
              />
            </div>

            {
              <Button
                onClick={() => setSectorPick(true)}
                shape="circle"
                icon={<SearchOutlined />}
                size={"small"}
              />
            }
          </div>
        </Form.Item> */}

        <div className="flex gap-2">
          <Form.Item
            name={["user", "type"]}
            label="Status"
            className="flex-1"
            rules={[{ required: true }]}
          >
            <Select
              onChange={(value) => {
                if (value !== "woreda_level") {
                  setWereda(null);
                }
                form.setFieldsValue({
                  user: {
                    ...form.getFieldsValue().user,
                    wereda: null,
                  },
                });
              }}
              disabled={true} 
              className="border-gray-400"
              placeholder="Select status"
            >
              
              <Option value="woreda_level">Woreda Level</Option>
            </Select>
          </Form.Item>

          <Form.Item
            className="flex-1"
            name={["user", "isServiceProvider"]}
            label="Is Service Provider"
            valuePropName="checked"
          >
            <Switch
              checked={switch2}
              disabled={true} 
            />
          </Form.Item>
        </div>

     
        {(type == "state_level" ||
              type == "zone_level" ||
              type == "woreda_level") && (
              <Form.Item
                className=" flex-1"
                name={["user", "state"]}
                label="State"
              >
                <div className="flex items-center bg-[#F5F5F5]">
                  <div className="flex-1 bg-white">
                    <Input
                      value={state?.name}
                      disabled
                      className="border-none py-2 bg-red-700"
                    />
                  </div>

                  {
                    <Button
                      onClick={() => setStatePick(true)}
                      shape="circle"
                      icon={<SearchOutlined />}
                      size={"small"}
                    />
                  }
                </div>
              </Form.Item>
            )}
            {(type == "zone_level" || type == "woreda_level") && (
              <Form.Item
                className=" flex-1"
                name={["user", "zone"]}
                label="Zone"
              >
                <div className="flex items-center bg-[#F5F5F5]">
                  <div className="flex-1 bg-white">
                    <Input
                      value={zone?.name}
                      disabled
                      className="border-none py-2 bg-red-700  "
                    />
                  </div>

                  {
                    <Button
                      onClick={() => setZonePick(true)}
                      shape="circle"
                      icon={<SearchOutlined />}
                      size={"small"}
                    />
                  }
                </div>
              </Form.Item>
            )}

            {type == "woreda_level" && (
              <Form.Item
                className=" flex-1"
                name={["user", "wereda"]}
                label="Wereda"
              >
                <div className="flex items-center bg-[#F5F5F5]">
                  <div className="flex-1 bg-white">
                    <Input
                      value={wereda?.name}
                      disabled
                      className="border-none py-2 bg-red-700  "
                    />
                  </div>

                  {
                    <Button
                      onClick={() => setWeredaPick(true)}
                      shape="circle"
                      icon={<SearchOutlined />}
                      size={"small"}
                    />
                  }
                </div>
              </Form.Item>
            )}
     

        <ButtonStyle>
          <button onClick={() => setIsModalOpen(false)}>Cancel</button>
          <button type="submit">Submit</button>
        </ButtonStyle>
      </FormStyle>
    </div>
  );
};

const SpinStyle = styled.div`
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
`;

export default UsersEdit;
