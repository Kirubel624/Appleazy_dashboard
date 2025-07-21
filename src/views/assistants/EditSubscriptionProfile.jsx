import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Button,
  Select,
  Checkbox,
  Radio,
} from "antd";
import Dragger from "antd/es/upload/Dragger";
import {
  EnvironmentOutlined,
  InboxOutlined,
  InfoCircleOutlined,
  UserOutlined,
  DollarCircleOutlined,
  LockOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { updateProfileAsync } from "../auth/authReducer";
import { ClipLoader } from "react-spinners";
import { updateSubscriptionProfileAsync } from "./subscriptionReducer";
import { motion } from "framer-motion";

import useAPIPrivate from "../../hooks/useAPIPrivate";

const { Option } = Select;
const EditSubscriptionProfile = ({
  profile2,
  setEdit,
  fetchSubscriptionInfo,
}) => {
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preferredIndustry, setPreferredIndustry] = useState(null);
  const [otherIndustry, setOtherIndustry] = useState("");
  const [selectedJobSettings, setSelectedJobSettings] = useState([]);
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();
  const profile = profile2;
  console.log("profile:::::", profile2);

  const [userData, setUserData] = useState({
    resume: null,
    cv: null,
    resumePreview: null,
    cvPreview: null,
  });
  const handleJobTypeChange = (checkedValues) => {
    // setSelectedJobTypes(checkedValues);
    setUserData({
      ...userData,
      jobType: checkedValues.join(","),
    });
  };
  const onFinish = async (values) => {
    setLoading(true);
    console.log("Form Values:", values);
    const data = {
      ...values,
      jobType: values.jobType.join(","),
      resume: userData.resume,
      cv: userData.cv,
    };
    setUserData({ ...userData, ...data });
    next();
    console.log(res, "response of profile update");
    setLoading(false);
  };
  const options = [
    { label: "Part-time", value: "Part-time" },
    { label: "Full-time", value: "Full-time" },
    { label: "Internship", value: "Internship" },
  ];
  const optionsVeteran = [
    {
      label: "Yes",
      value: true,
    },
    {
      label: "No",
      value: false,
    },
    {
      label: "Prefer not to disclose",
      value: null,
    },
  ];
  const optionsDisability = [
    {
      label: "Yes",
      value: true,
    },
    {
      label: "No",
      value: false,
    },
    {
      label: "Prefer not to disclose",
      value: null,
    },
  ];
  // ..
  const beforeUpload = (file) => {
    const isPdf = file.type === "application/pdf";
    if (!isPdf) {
      message.error("You can only upload PDF files!");
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error("File must be smaller than 5MB!");
    }
    return isPdf && isLt5M;
  };
  const handleRemoveResume = () => {
    console.log("removed");
    setUserData({
      ...userData,
      resumePreview: null,
      resume: null,
    });
  };

  const handleRemoveCv = () => {
    console.log("removed");
    setUserData({
      ...userData,
      cvPreview: null,
      cv: null,
    });
  };
  const resumeProps = {
    name: "file",
    maxCount: 1,
    showUploadList: false,
    onChange(info) {
      const { status, originFileObj } = info.file;
      if (status !== "uploading") {
        console.log(info.file, "info file");
        console.log(info.fileList, "info file list");
        setUserData({
          ...userData,
          resume: originFileObj,
        });
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
    beforeUpload,
    onRemove: handleRemoveResume,
  };

  const cvProps = {
    name: "file",
    maxCount: 1,
    showUploadList: false,
    Upload: null,
    onChange(info) {
      const { status, originFileObj } = info.file;
      if (status !== "uploading") {
        console.log(info.file, "info file");
        console.log(info.fileList, "info file list");
        setUserData({
          ...userData,
          cv: originFileObj,
        });
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
    beforeUpload,
    onRemove: handleRemoveCv,
  };
  const onChange = (e) => {
    const newValue = e.target.value;
    setUserData({
      ...userData,
      workAuthorization: newValue,
    });
  };
  const onChangeVet = ({ target: { value } }) => {
    console.log("radio2 checked", value);
    // setVet(value);
    setUserData({ ...userData, veteranStatus: value });
  };
  const onChangeDis = ({ target: { value } }) => {
    console.log("radio2 checked", value);
    // setDis(value);
    setUserData({ ...userData, disabilityStatus: value });
  };
  const handleIndustryChange = (value) => {
    setSelectedIndustry(value);
    setUserData({
      ...userData,
      preferredIndustry: value.join(","),
    });
  };
  useEffect(() => {
    setUserData({ ...userData, ...profile });
  }, []);
  const jobLocationOptions = [
    "New York NY",
    "Los Angeles CA",
    "Chicago IL",
    "Houston TX",
    "Phoenix AZ",
    "Philadelphia PA",
    "San Antonio TX",
    "San Diego CA",
    "Dallas TX",
    "San Jose CA",
    "Austin TX",
    "Jacksonville FL",
    "Fort Worth TX",
    "Columbus OH",
    "San Francisco CA",
    "Charlotte NC",
    "Indianapolis IN",
    "Seattle WA",
    "Denver CO",
    "Washington DC",
    "Boston MA",
    "El Paso TX",
    "Nashville TN",
    "Detroit MI",
    "Oklahoma City OK",
    "Portland OR",
    "Las Vegas NV",
    "Milwaukee WI",
    "Albuquerque NM",
    "Tucson AZ",
    "Fresno CA",
    "Sacramento CA",
    "Long Beach CA",
    "Kansas City MO",
    "Mesa AZ",
    "Virginia Beach VA",
    "Atlanta GA",
    "Colorado Springs CO",
    "Omaha NE",
    "Raleigh NC",
    "Miami FL",
    "Cleveland OH",
    "Tampa FL",
    "Tulsa OK",
    "Oakland CA",
    "Minneapolis MN",
    "Wichita KS",
    "New Orleans LA",
    "Arlington TX",
    "Bakersfield CA",
    "Honolulu HI",
    "Anaheim CA",
    "Santa Ana CA",
    "Corpus Christi TX",
    "Riverside CA",
    "St. Louis MO",
    "Pittsburgh PA",
    "Cincinnati OH",
    "Anchorage AK",
    "Henderson NV",
    "Greensboro NC",
    "Plano TX",
    "Newark NJ",
    "Chula Vista CA",
    "Tampa FL",
    "Baton Rouge LA",
    "Jackson MS",
    "Chattanooga TN",
  ];
  const [customPronoun, setCustomPronoun] = useState("");

  const handleJobSettingChange = (checkedValues) => {
    setSelectedJobSettings(checkedValues);
    setUserData({
      ...userData,
      jobSetting: checkedValues.join(","),
    });
  };
  const optionsSetting = [
    { label: "Remote", value: "Remote" },
    { label: "On-site", value: "On-site" },
    { label: "Hybrid", value: "Hybrid" },
  ];
  const handlePronounChange = (value) => {
    setCustomPronoun(value);
    setUserData({
      ...userData,
      preferredPronouns: value,
    });
  };
  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{
        duration: 0.6,
        ease: [0.6, 0.01, -0.05, 0.95],
        type: "spring",
        stiffness: 100,
      }}>
      <Form
        name="user-form"
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          location: profile?.SubscriptionProfile?.location?.split(","),
          address: profile?.SubscriptionProfile?.address,
          position: profile?.SubscriptionProfile?.position?.split(","),
          minDesiredPay: profile?.SubscriptionProfile?.minDesiredPay,
          maxDesiredPay: profile?.SubscriptionProfile?.maxDesiredPay,
          ethnicity: profile?.SubscriptionProfile?.ethnicity,
          jobType: profile?.SubscriptionProfile?.jobType?.split(","),
          jobSetting: profile?.SubscriptionProfile?.jobSetting?.split(","),
          preferredIndustry:
            profile?.SubscriptionProfile?.preferredIndustry?.split(","),
          preferredPronouns: profile?.SubscriptionProfile?.preferredPronouns,
          veteranStatus: profile?.SubscriptionProfile?.veteranStatus,
          disabilityStatus: profile?.SubscriptionProfile?.disabilityStatus,
          workAuthorization: profile?.SubscriptionProfile?.workAuthorization,
          sharedEmail: profile2?.User?.sharedEmail,
          sharedPassword: profile2?.User?.sharedPassword,
        }}>
        <div className="flex items-center">
          <Form.Item
            className="md:w-1/2 w-full"
            name="sharedEmail"
            label="Shared Email">
            <Input
              disabled
              value={profile2?.User?.sharedEmail}
              prefix={<MailOutlined />}
              className="w-full"
              type="email"
            />
          </Form.Item>
          <Form.Item
            className="md:w-1/2 mx-2 w-full"
            name="sharedPassword"
            label="Shared Password">
            <div className="relative w-full">
              <Input
                value={profile2?.User?.sharedPassword}
                prefix={<LockOutlined />}
                className="w-full pr-10"
                type={visible ? "text" : "password"}
                disabled
              />
              <span
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={() => setVisible(!visible)}>
                {visible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
              </span>
            </div>
          </Form.Item>
        </div>
        {/* Username */}
        <div className="flex items-center w-full">
          {/* Location */}
          <Form.Item
            className="w-1/3"
            label="Preferred location(s)"
            name="location"
            rules={[
              { required: true, message: "Please input your location!" },
            ]}>
            <Select
              disabled
              allowClear
              mode="tags"
              style={{
                width: "100%",
              }}
              placeholder="Enter location(s)"
              prefix={<EnvironmentOutlined />}>
              {jobLocationOptions.map((location) => (
                <Select.Option key={location} value={location}>
                  {location}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            className="md:w-1/3 w-full mx-2"
            name="address"
            label="Address"
            rules={[
              {
                required: true,
                message: "Please input your address!",
              },
            ]}>
            <Input
              disabled
              placeholder="Enter address"
              prefix={<EnvironmentOutlined />}
            />
          </Form.Item>
          <Form.Item
            className="w-1/3 "
            label="Desired Job title(s)"
            name="position"
            rules={[
              {
                required: true,
                message: "Please enter desired job title(s)",
              },
            ]}>
            <Select
              disabled
              prefix={<UserOutlined />}
              allowClear
              mode="tags"
              style={{
                width: "100%",
              }}
              placeholder="Enter position(s)"
            />
          </Form.Item>
        </div>
        <div className="flex items-center">
          <Form.Item
            className="md:w-1/3 w-full"
            name="minDesiredPay"
            label="Min Desired Pay"
            rules={[
              {
                required: true,
                message: "Please input your minimum desired pay!",
              },
            ]}>
            <InputNumber
              disabled
              prefix={<DollarCircleOutlined />}
              className="w-full"
              type="number"
              placeholder="Enter minimum desired pay"
            />
          </Form.Item>
          <Form.Item
            className="md:w-1/3 mx-2 w-full"
            name="maxDesiredPay"
            label="Max Desired Pay">
            <InputNumber
              disabled
              prefix={<DollarCircleOutlined />}
              className="w-full"
              type="number"
              placeholder="Enter maximum desired pay"
            />
          </Form.Item>

          {/* Ethnicity */}
          <Form.Item
            className="w-1/3 ml-"
            label="Ethnicity"
            name="ethnicity"
            rules={[
              { required: true, message: "Please select your ethnicity!" },
            ]}>
            <Select disabled placeholder="Select an option">
              <Option value="american-indian-alaska-native">
                American Indian or Alaska Native
              </Option>
              <Option value="asian">Asian</Option>
              <Option value="black-african-american">
                Black or African American
              </Option>
              <Option value="hispanic-latino">Hispanic or Latino</Option>
              <Option value="native-hawaiian-pacific-islander">
                Native Hawaiian or Other Pacific Islander
              </Option>
              <Option value="white">White</Option>
              <Option value="two-or-more-races">Two or More Races</Option>
              <Option value="prefer-not-to-disclose">
                Prefer not to disclose
              </Option>
            </Select>
          </Form.Item>
        </div>
        {/* Job Type */}
        <div className="flex items-center">
          <Form.Item
            className="md:w-1/2"
            label="Job Type"
            name="jobType"
            rules={[
              { required: true, message: "Please select your job type!" },
            ]}>
            <Checkbox.Group disabled options={options} />
          </Form.Item>
          <Form.Item
            className="md:w-1/2 ml-4"
            name="jobSetting"
            label="Job Setting">
            <Checkbox.Group disabled options={optionsSetting} />
          </Form.Item>
        </div>

        <div className="flex items-center">
          {/* Preferred Industry */}
          <Form.Item
            name="preferredIndustry"
            className={`md:w-1/2 w-full mr-4 border- border-red-900`}
            label="Preferred industry(ies)">
            <Select
              disabled
              allowClear
              mode="tags"
              placeholder="Select an industry">
              <Option value="Finance">Finance</Option>
              <Option value="Healthcare">Healthcare</Option>
              <Option value="IT">IT</Option>
              <Option value="Software Development">Software Development</Option>
              <Option value="Accounting">Accounting</Option>
              <Option value="Banking">Banking</Option>
              <Option value="Hospitality">Hospitality</Option>
              <Option value="Insurance">Insurance</Option>
              <Option value="Other">N/A</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="preferredPronouns"
            className={`md:w-1/2 border- w-full ${
              customPronoun === "Other" ? "" : ""
            }`}
            label="Preferred Pronouns">
            <Select
              disabled
              onChange={handlePronounChange}
              placeholder="Select your pronouns">
              <Option value="He/him">He/Him</Option>
              <Option value="She/her">She/Her</Option>
              <Option value="They/them">They/Them</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>
          {customPronoun === "Other" && (
            <div className="md:ml-4 ml-0 md:w-1/5 w-full ">
              <Form.Item label="Please specify">
                <Input placeholder="Specify your pronouns" />
              </Form.Item>
            </div>
          )}
        </div>
        <div className="flex items-center">
          <Form.Item
            className="w-1/2 mr-4"
            name="veteranStatus"
            label="Are you a veteran?">
            <Radio.Group
              disabled
              options={optionsVeteran}
              optionType="button"
            />
          </Form.Item>
          <Form.Item
            className="w-1/2"
            name="disabilityStatus"
            label="Do you have any disability?">
            <Radio.Group
              disabled
              options={optionsDisability}
              optionType="button"
            />
          </Form.Item>
        </div>
        <Form.Item
          disabled
          name="workAuthorization"
          label="Are you authorized to work in the US?">
          <Radio.Group>
            {/* <Space direction="vertical"> */}
            <Radio value={true}>
              Authorized to work in the U.S. without restrictions.
            </Radio>
            <Radio disabled className="mt-2" value={false}>
              Authorized to work in the U.S. and require sponsorship.
            </Radio>
            {/* </Space> */}
          </Radio.Group>
        </Form.Item>
        <div
          className="flex justify-aro mb-4 items-center w-full
         borde border-purple-700 mt-6">
          <div
            className=" w-1/ border-red-900 flex flex-col mr-8
         items-start justify-start">
            <p className="text-start font-medium mb-2">Resume (Required)</p>
            <a
              href={profile?.SubscriptionProfile?.resume}
              target="_blank"
              className="underline text-blue-500 mb-2">
              Previous Resume
            </a>

            {/* <p className="text-sm mt-3">{userData?.resume?.name || ""}</p> */}
          </div>
          <div>
            <p className="text-start font-medium mt- mb-2">Cover letter</p>
            <a
              href={profile?.SubscriptionProfile?.cv}
              target="_blank"
              className="underline text-blue-500 mb-2">
              Previous Cover letter
            </a>
          </div>
          {/* <p className="text-sm mt-3">{userData?.cv?.name || ""}</p> */}
        </div>
        {/* Submit Button */}
      </Form>
    </motion.div>
  );
};

export default EditSubscriptionProfile;
