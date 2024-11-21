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
import { InboxOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { updateProfileAsync } from "../auth/authReducer";
import { ClipLoader } from "react-spinners";
import { motion } from "framer-motion";
import {
  EnvironmentOutlined,
  UserOutlined,
  DollarCircleOutlined,
  // UserOutlined,
} from "@ant-design/icons";
const { Option } = Select;
const EditProfile = ({
  setEdit,
  fetchProfile,
  userData,
  setUserData,
  next,
  previous,
}) => {
  const { user, profile } = useSelector((state) => state.auth);

  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preferredIndustry, setPreferredIndustry] = useState(null);
  const [otherIndustry, setOtherIndustry] = useState("");

  const dispatch = useDispatch();
  // const [userData, setUserData] = useState({
  //   resume: null,
  //   cv: null,
  //   resumePreview: null,
  //   cvPreview: null,
  // });
  const handleJobTypeChange = (checkedValues) => {
    setSelectedJobTypes(checkedValues);
    setUserData({
      ...userData,
      jobType: values.jobType.join(","),
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
    // Handle form submission logic here
    setLoading(false);
  };
  const options = [
    { label: "Part-time", value: "Part-time" },
    { label: "Full-time", value: "Full-time" },
    { label: "Contract", value: "Contract" },
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
      value: "",
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
      value: "",
    },
  ];
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
          resumePreview: URL.createObjectURL(originFileObj),
        }); // Update the state with the current file list
      }

      // if (status === "done") {
      //   message.success(${info.file.name} file uploaded successfully.);
      // } else if (status === "error") {
      //   message.error(${info.file.name} file upload failed.);
      // }
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
          cvPreview: URL.createObjectURL(originFileObj),
        }); // Update the state with the current file list
      }

      // if (status === "done") {
      //   message.success(${info.file.name} file uploaded successfully.);
      // } else if (status === "error") {
      //   message.error(${info.file.name} file upload failed.);
      // }
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
      preferredIndustry: value,
    });
    if (value !== "Other") {
      setOtherIndustry("");
    }
  };
  useEffect(() => {
    setUserData({ ...userData, ...profile });
  }, []);
  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{
        duration: 0.6, // Adjust duration to control the speed of the animation
        ease: [0.6, 0.01, -0.05, 0.95], // Custom easing for a smoother effect
        type: "spring", // Adds a spring-like bounce
        stiffness: 100, // Controls the "bounciness" of the spring
      }}
    >
      <h1 className="text-2xl font-bold font-organetto mb-2 mt-3 text-center">
        Edit your profile
      </h1>
      <div className="flex items-center justify-center w-full mb-2 ">
        <InfoCircleOutlined />
        <p className="text-center ml-1">
          This is the profile that will be shown to the assistant that will
          apply for this job
        </p>
      </div>
      <Form
        name="user-form"
        layout="vertical"
        initialValues={{
          username: profile?.username,
          location: profile?.location,
          position: profile?.position,
          desiredpay: profile?.desiredpay,
          ethnicity: profile?.ethnicity,
          jobType: profile?.jobType?.split(","),
          preferredIndustry: profile?.preferredIndustry,
          veteranStatus: profile?.veteranStatus,
          disabilityStatus: profile?.disabilityStatus,
          workAuthorization: profile?.workAuthorization,
        }}
      >
        {/* Username */}
        <div className="flex items-center w-full">
          <Form.Item
            className="w-1/3"
            label="Desired Pay"
            name="desiredpay"
            rules={[
              { required: false, message: "Please input your desired pay!" },
            ]}
          >
            <InputNumber
              value={userData?.desiredpay}
              placeholder=""
              type="number"
              className="w-full"
              prefix={<DollarCircleOutlined />}
              onChange={(value) =>
                setUserData({ ...userData, desiredpay: value })
              }
            />
          </Form.Item>
          {/* Location */}
          <Form.Item
            initialValue={userData?.location}
            className="w-1/3 mx-4"
            name="location"
            label="Location"
            rules={[{ required: true, message: "Please enter a location" }]}
          >
            <Input
              placeholder=""
              // defaultValue={userData?.location}
              prefix={<EnvironmentOutlined />}
              value={userData?.location}
              onChange={(e) =>
                setUserData({ ...userData, location: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item
            initialValue={userData?.position}
            className="w-1/3"
            name="position"
            label="Position"
          >
            <Input
              placeholder=""
              value={userData?.position}
              prefix={<UserOutlined />}
              onChange={(e) => {
                setUserData({ ...userData, position: e.target.value });
              }}
            />
          </Form.Item>
        </div>
        <div className="flex items-center">
          {/* Ethnicity */}
          <Form.Item
            className="w-1/3 ml-"
            label="Ethnicity"
            name="ethnicity"
            rules={[
              { required: true, message: "Please select your ethnicity!" },
            ]}
          >
            <Select
              // className="w-1/3"
              placeholder="Select an option"
              value={userData?.ethnicity}
              onChange={(value) =>
                setUserData({ ...userData, ethnicity: value })
              }
            >
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
          {/* Job Type */}
          <Form.Item
            label="Job Type"
            className="w-1/3 ml-2"
            name="jobType"
            rules={[
              { required: true, message: "Please select your job type!" },
            ]}
          >
            <Checkbox.Group
              options={options}
              value={userData?.jobType}
              onChange={handleJobTypeChange}
            />
          </Form.Item>
          <Form.Item
            label="Preferred Industry"
            name="preferredIndustry"
            className="w-1/3 mr-"

            //   rules={[
            //     {
            //       required: true,
            //       message: "Please select your preferred industry!",
            //     },
            //   ]}
          >
            <Select
              placeholder="Select an industry"
              onChange={handleIndustryChange}
              value={userData?.preferredIndustry}
            >
              <Option value="Finance">Finance</Option>
              <Option value="Healthcare">Healthcare</Option>
              <Option value="IT">IT</Option>
              <Option value="Software Development">Software Development</Option>
              <Option value="Accounting">Accounting</Option>
              <Option value="Banking">Banking</Option>
              <Option value="Hospitality">Hospitality</Option>
              <Option value="Insurance">Insurance</Option>
              <Option value="Other">Other (open answer)</Option>
            </Select>
          </Form.Item>
          {selectedIndustry === "Other" && (
            <Form.Item className="w-1/3" label="Please specify">
              <Input
                placeholder="Enter your preferred industry"
                value={userData?.preferredIndustry}
                onChange={(e) =>
                  setUserData({
                    ...userData,
                    preferredIndustry: e.target.value,
                  })
                }
              />
            </Form.Item>
          )}
        </div>
        <div className="flex items-center">
          <Form.Item
            className="w-1/3 mr-4"
            name="veteranStatus"
            label="Are you a veteran?"
            rules={[{ required: true, message: "Please enter required field" }]}
          >
            <Radio.Group
              options={optionsVeteran}
              onChange={onChangeVet}
              value={userData?.veteranStatus}
              optionType="button"
            />
          </Form.Item>
          <Form.Item
            className="w-1/3"
            name="disabilityStatus"
            label="Do you have any disability?"
            rules={[{ required: true, message: "Please enter required field" }]}
          >
            <Radio.Group
              options={optionsDisability}
              onChange={onChangeDis}
              value={userData?.disabilityStatus}
              optionType="button"
            />
          </Form.Item>{" "}
          <Form.Item
            name="workAuthorization"
            className="w-1/3 border- border-purple-500"
            label="Are you authorized to work in the US?"
          >
            <Radio.Group
              className="flex flex-col "
              onChange={onChange}
              value={userData?.workAuthorization}
            >
              {/* <Space direction="vertical"> */}
              <Radio value={true}>
                Authorized to work in the U.S. without restrictions.
              </Radio>
              <Radio className="mt-2" value={false}>
                Authorized to work in the U.S. and require sponsorship.
              </Radio>
              {/* </Space> */}
            </Radio.Group>
          </Form.Item>
        </div>

        {/* Preferred Industry */}

        <div className="flex items-start justify-between w-full borde border-red-900">
          <div
            className="flex justify-aro mb-4 items-center w-2/3
         borde border-purple-700 mt-"
          >
            <div
              className=" w-1/2 border- border-red-900 flex flex-col mr-8
         items-start justify-start"
            >
              <p className="text-start font-medium mb-2">Resume (Required)</p>
              <a
                href={profile?.resume}
                target="_blank"
                className="underline text-blue-500 mb-2"
              >
                Previous Resume
              </a>
              {userData?.resumePreview ? (
                <div className="flex flex-col items-center">
                  <p>{userData.resume.name}</p>
                  {/* <Document file={userData?.resume}>
                <Page pageNumber={1} />
              </Document>
              <p>
                Page {pageNumber} of {numPages}
              </p> */}
                  <button
                    onClick={handleRemoveResume}
                    className="text-blue-500 mt-2"
                  >
                    Remove File
                  </button>
                </div>
              ) : (
                <Dragger
                  className="w-full  borde border-red-900"
                  {...resumeProps}
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Click or drag file to this area to upload
                  </p>
                  <p className="ant-upload-hint">
                    Only PDF files are allowed. Max size: 5MB.
                  </p>
                </Dragger>
              )}
              {/* <p className="text-sm mt-3">{userData?.resume?.name || ""}</p> */}
            </div>
            <div
              className=" w-1/2 border- border-red-900 flex flex-col mr-8
         items-start justify-start"
            >
              <p className="text-start font-medium mt- mb-2">CV</p>
              <a
                href={profile?.cv}
                target="_blank"
                className="underline text-blue-500 mb-2"
              >
                Previous CV
              </a>
              {userData?.cvPreview ? (
                <div className="flex flex-col items-center">
                  <p>{userData.cv.name}</p>
                  {/* <Document file={userData?.cv}>
                <Page pageNumber={1} />
              </Document>
              <p>
                Page {pageNumber} of {numPages}
              </p> */}
                  <button
                    onClick={handleRemoveCv}
                    className="text-blue-500 mt-2"
                  >
                    Remove File
                  </button>
                </div>
              ) : (
                <Dragger
                  className="w-full mt- borde border-red-900"
                  {...cvProps}
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Click or drag file to this area to upload
                  </p>
                  <p className="ant-upload-hint">
                    Only PDF files are allowed. Max size: 5MB.
                  </p>
                </Dragger>
              )}
            </div>
            {/* <p className="text-sm mt-3">{userData?.cv?.name || ""}</p> */}
          </div>
        </div>
        {/* Submit Button */}
        <Form.Item className="flex justify-end">
          <div className="inline-block self-end ">
            <button
              onClick={next}
              className="w- bg-[#168a53] w-32 py-2 px-2 hover:bg-[#267c54] text-white "
            >
              Next
            </button>
          </div>
        </Form.Item>
      </Form>
    </motion.div>
  );
};

export default EditProfile;
