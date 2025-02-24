import React, { useEffect, useState } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Spin,
  Switch,
} from "antd";
import styled from "styled-components";
import {
  ButtonStyle,
  FlexStyle,
  FormStyle,
} from "../../components/commons/CommonStyles";
import userService from "./UsersService";
import CommonModal from "../../components/commons/CommonModel";
import UsersPick from "./UsersPick";
import dayjs from "dayjs";
import SectorsPick from "../sectors/SectorsPick";
import { SearchOutlined } from "@ant-design/icons";
import WoredaPick from "../woreda/WeredaPick";
import ZonePick from "../zone/zonePick";
import StatePick from "../state/StatePick";
import { updateZoneState } from "../zone/ZoneRedux";
import { useDispatch, useSelector } from "react-redux";
import { updateWoredaState } from "../woreda/WoredaRedux";
import { useTranslation } from "react-i18next";

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
  setUsersData,
  searchData,
}) => {
  const [form] = Form.useForm();
  const [switch2, setSwitch2] = useState("");
  const [loading, setLoading] = useState("");
  const [userPick, setUserPick] = useState(false);
  const [sector, setSector] = useState({});
  const [wereda, setWereda] = useState({});
  const [state, setState] = useState({});
  const [zone, setZone] = useState({});
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);
  const { t, i18n } = useTranslation();

  console.log("currentUser", currentUser);
  const type = Form.useWatch(["user", "type"], form) || "";

  const [sectorPick, setSectorPick] = useState(false);
  const [weredaPick, setWeredaPick] = useState(false);
  const [statePick, setStatePick] = useState(false);
  const [zonePick, setZonePick] = useState(false);
  useEffect(() => {
    form.setFieldsValue({
      user: {
        ...form.getFieldsValue().user,
        type: currentUser.type,
      },
    });
  }, []);

  // useEffect(() => {
  useEffect(() => {
    if (currentUser.type == "state_level") {
      setState(currentUser.state);
      form.setFieldsValue({
        user: {
          ...form.getFieldsValue().user,
          state: currentUser.state._id,
        },
      });
    } else if (currentUser.type == "zone_level") {
      setState(currentUser.state);
      setZone(currentUser.zone);
      form.setFieldsValue({
        user: {
          ...form.getFieldsValue().user,
          state: currentUser.state._id,
          zone: currentUser.zone._id,
        },
      });
    } else if (currentUser.type == "woreda_level") {
      setState(currentUser.state);
      setZone(currentUser.zone);
      setWereda(currentUser.wereda);
    }
  }, []);
  useEffect(() => {
    const featchData = async () => {
      try {
        const data = await userService.getUser(mode);
        console.log("data", data);
        form.setFieldsValue({
          user: {
            ...data,
            state: data.state?._id,
            zone: data.zone?._id,
            wereda: data.wereda?._id,
            sector: data.sector?._id,
            isServiceProvider: data.isServiceProvider,
            date: dayjs(data.date),
          },
        });
        setSector(data.sector);
        setWereda(data.wereda);
        setState(data.state);
        setZone(data.zone);
        setSwitch2(data.isServiceProvider);
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

  const sectorPickHandler = (data) => {
    console.log("sectorPickHandler", data);
    setSector(data);
    form.setFieldsValue({
      user: {
        ...form.getFieldsValue().user,
        sector: data._id,
      },
    });
    setSectorPick(false);
  };
  const weredaPickHandler = (data) => {
    console.log("weredaPickHandler", data);
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
    console.log("statePickHandler", data);
    setState(data);
    form.setFieldsValue({
      user: {
        ...form.getFieldsValue().user,
        state: data._id,
        zone: null,
        wereda: null,
      },
    });
    setZone(null);

    setWereda(null);
    setStatePick(false);
  };
  const zonePickHandler = (data) => {
    console.log("zonePickHandler", data);
    setZone(data);
    form.setFieldsValue({
      user: {
        ...form.getFieldsValue().user,
        zone: data._id,
        wereda: null,
      },
    });
    setWereda(null);
    setZonePick(false);
  };

  const onAdd = async (datas) => {
    try {
      setLoading(true);

      const data = await userService.createUser(datas.user);
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

      const data = await userService.updateUser(datas.user, mode);
      const mapData = usersData.map((user) => {
        if (user._id == mode) {
          return data;
        } else {
          return user;
        }
      });
      setUsersData(mapData);
      setIsModalOpen(false);
      setLoading(false);
      searchData();
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
      {sectorPick ? (
        <CommonModal
          width={700}
          isModalOpen={sectorPick}
          setIsModalOpen={setSectorPick}
        >
          <SectorsPick
            setIsModalOpen={setSectorPick}
            selectHandler={sectorPickHandler}
          />
        </CommonModal>
      ) : (
        ""
      )}
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
            stateId={state?._id}
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
            zoneId={zone?._id}
            setIsModalOpen={setWeredaPick}
            selectHandler={weredaPickHandler}
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
        <FlexStyle>
          <Form.Item
            className=" flex-1"
            name={["user", "fullName"]}
            label={t("Full_Name")}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input className="border-gray-400 py-2" />
          </Form.Item>

          <Form.Item
            className=" flex-1 border-gray-400"
            name={["user", "email"]}
            label={t("Email")}
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
            label={t("Username")}
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
            label={t("Gender")}
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
              placeholder="select your gender"
            >
              <Option value="male">{t("Male")}</Option>
              <Option value="female">{t("Female")}</Option>
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
            label={t("Phone_Number")}
          >
            <Input className="border-gray-400 py-2" />
          </Form.Item>
        </FlexStyle>
        {/* <Form.Item
        name={['user', 'branch']}
        label="Branch"
        className=' flex-1'
        rules={[
          {
            required: true,
            message: 'Please select branch!',
          },
        ]}
      >
        <Select
        className='border-gray-400 '
        placeholder="select your branch">
          <Option value="Main Brnach">Main Branch</Option>
          <Option value="Store">Srore</Option>
        </Select>
      </Form.Item> */}

        <div className="flex gap-2">
          {/* <Form.Item
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
              placeholder="select your status"
            >
              <Option value={true}>Active</Option>
              <Option value={false}>Inactive</Option>
            </Select>
          </Form.Item> */}
          <Form.Item
            className=" flex-1 border-gray-400"
            name={["user", "location"]}
            label={t("Location")}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input className="border-gray-400 py-2" />
          </Form.Item>
        </div>
        <Form.Item
          className=" flex-1"
          name={["user", "sector"]}
          label={t("Sector")}
        >
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
        </Form.Item>
        <div className="flex gap-2">
          <Form.Item
            name={["user", "type"]}
            label={t("Level")}
            className=" flex-1"
            rules={[
              {
                required: true,
                message: "Please select status!",
              },
            ]}
          >
            <Select
              onChange={() => {
                setState(null);
                setWereda(null);
                setZone(null);

                form.setFieldsValue({
                  user: {
                    ...form.getFieldsValue().user,
                    wereda: null,
                    zone: null,
                    state: null,
                  },
                });
              }}
              // disabled={!currentUser?.isSystemAdmin}
              className="border-gray-400 "
              placeholder="select your level"
            >
              {currentUser.type == "federal_level" && (
                <Option value={"federal_level"}>{t("Federal_Level")}</Option>
              )}

              {(currentUser.type == "federal_level" ||
                currentUser.type == "state_level") && (
                <Option value={"state_level"}>{t("Region_Level")}</Option>
              )}

              {(currentUser.type == "federal_level" ||
                currentUser.type == "zone_level" ||
                currentUser.type == "state_level" ||
                currentUser.type == "federal_level") && (
                <Option value={"zone_level"}>{t("Zone_Level")}</Option>
              )}

              <Option value={"woreda_level"}>{t("Woreda_Level")}</Option>
            </Select>
          </Form.Item>

          {type == "woreda_level" && (
            <Form.Item
              className=" flex-1 border-gray-400"
              name={["user", "isServiceProvider"]}
              label="Is Service Provider"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Switch
                checked={switch2}
                onChange={(value) => setSwitch2(value)}
                style={{ background: switch2 ? "blue" : "gray" }}
              />
            </Form.Item>
          )}
        </div>

        {type == "federal_level" ? null : (
          <>
            {(type == "state_level" ||
              type == "zone_level" ||
              type == "woreda_level") && (
              <Form.Item
                className=" flex-1"
                name={["user", "state"]}
                label={t("State")}
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
                      onClick={() => {
                        dispatch(
                          updateZoneState({ stateIdSearch: state?._id })
                        );

                        setZonePick(true);
                      }}
                      disabled={!state?._id}
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
                      onClick={() => {
                        dispatch(updateWoredaState({ zoneId: zone?._id })); // Update Redux state with the selected state ID

                        setWeredaPick(true);
                      }}
                      disabled={!zone?._id}
                      shape="circle"
                      icon={<SearchOutlined />}
                      size={"small"}
                    />
                  }
                </div>
              </Form.Item>
            )}
          </>
        )}

        {/* <Form.Item
          name={['user', 'userType']}
          label="role"
          className=' flex-1'
          rules={[
            {
              required: true,
              message: 'Please select role!',
            },
          ]}
        >
          <Select
            className='border-gray-400 '
            placeholder="select your status">
            <Option value={'sales'}>Sales</Option>
            <Option value={'store'}>Store</Option>
            <Option value={'manager'}>Manager</Option>
            <Option value={'admin'}>Admin</Option>


          </Select>
        </Form.Item> */}

        {/* <Form.Item name={["user", "date"]} label="DatePicker">
          <DatePicker format={"YYYY/MM/DD"} />
        </Form.Item> */}
        <ButtonStyle>
          <button onClick={() => setIsModalOpen(false)}>{t("Cancel")}</button>
          <button type="submit">{t("Submit")}</button>
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
