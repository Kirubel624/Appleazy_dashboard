import React, { useState } from "react";
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
import { InboxOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { updateProfileAsync } from "../auth/authReducer";
import { ClipLoader } from "react-spinners";

const { Option } = Select;
const EditProfile = ({ profile, setEdit, fetchProfile }) => {
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preferredIndustry, setPreferredIndustry] = useState(null);
  const dispatch = useDispatch();
  const [userData, setUserData] = useState({
    resume: null,
    cv: null,
    resumePreview: null,
    cvPreview: null,
  });
  const handleIndustryChange = (value) => {
    setSelectedIndustry(value);

    if (value !== "Other") {
      setOtherIndustry("");
    }
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
    const formData = new FormData();
    // Add regular form fields
    formData.set("disabilityStatus", data.disabilityStatus);
    formData.set("veteranStatus", data.veteranStatus);

    formData.set("email", data.email);
    formData.set("ethnicity", data.ethnicity);
    formData.set("jobType", data.jobType);
    formData.set("location", data.location);
    formData.set("password", data.password);
    formData.set("desiredpay", data.desiredpay);
    formData.set("position", data.position);
    formData.set("preferredIndustry", data.preferredIndustry);
    formData.set("username", data.username);
    formData.set("workAuthorization", data.workAuthorization);
    if (data?.resume) {
      formData.append("resume", data?.resume);
    }

    if (data?.cv) {
      formData.append("cv", data?.cv);
    }
    const res = await dispatch(
      updateProfileAsync({ id: profile?.userId, data: formData })
    );
    console.log(res, "response of profile update");
    // Handle form submission logic here
    setLoading(false);
    setEdit(false);
    fetchProfile();
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
  return (
    <div>
      {" "}
      <Form
        name="user-form"
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          username: profile?.username,
          location: profile?.location,
          position: profile?.position,
          desiredpay: profile?.desiredpay,
          ethnicity: profile?.desiredpay,
          jobType: profile?.jobType.split(","),
          preferredIndustry: profile?.preferredIndustry,
          veteranStatus: profile?.veteranStatus,
          disabilityStatus: profile?.disabilityStatus,
          workAuthorization: profile?.workAuthorization,
        }}>
        {/* Username */}
        <div className="flex items-center w-full">
          <Form.Item
            className="w-1/3"
            label="Username"
            name="username"
            rules={[
              { required: true, message: "Please input your username!" },
            ]}>
            <Input placeholder="Enter username" />
          </Form.Item>

          {/* Location */}
          <Form.Item
            className="w-1/3 mx-2"
            label="Location"
            name="location"
            rules={[
              { required: true, message: "Please input your location!" },
            ]}>
            <Input placeholder="Enter location" />
          </Form.Item>
          <Form.Item
            className="w-1/3 "
            label="Position"
            name="position"
            rules={[
              { required: true, message: "Please input your position!" },
            ]}>
            <Input placeholder="Enter position" />
          </Form.Item>
        </div>
        <div className="flex items-center">
          <Form.Item
            className="w-1/2"
            label="Desired Pay"
            name="desiredpay"
            rules={[
              { required: false, message: "Please input your desired pay!" },
            ]}>
            <InputNumber
              placeholder="Enter desired pay"
              min={0}
              style={{ width: "100%" }}
            />
          </Form.Item>

          {/* Ethnicity */}
          <Form.Item
            className="w-1/2 ml-2"
            label="Ethnicity"
            name="ethnicity"
            rules={[
              { required: true, message: "Please select your ethnicity!" },
            ]}>
            <Input placeholder="Enter ethnicity" />
          </Form.Item>
        </div>
        {/* Job Type */}
        <Form.Item
          label="Job Type"
          name="jobType"
          rules={[{ required: true, message: "Please select your job type!" }]}>
          <Checkbox.Group options={options} />
        </Form.Item>

        {/* Preferred Industry */}
        <Form.Item
          label="Preferred Industry"
          name="preferredIndustry"

          //   rules={[
          //     {
          //       required: true,
          //       message: "Please select your preferred industry!",
          //     },
          //   ]}
        >
          <Select
            onChange={handleIndustryChange}
            placeholder="Select an industry">
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
          <Form.Item label="Please specify">
            <Input
              placeholder="Enter your preferred industry"
              value={preferredIndustry}
              onChange={(e) => setPreferredIndustry(e.target.value)}
            />
          </Form.Item>
        )}
        <div className="flex items-center">
          <Form.Item
            className="w-1/2 mr-4"
            name="veteranStatus"
            label="Are you a veteran?">
            <Radio.Group options={optionsVeteran} optionType="button" />
          </Form.Item>
          <Form.Item
            className="w-1/2"
            name="disabilityStatus"
            label="Do you have any disability?">
            <Radio.Group options={optionsDisability} optionType="button" />
          </Form.Item>
        </div>
        <Form.Item
          name="workAuthorization"
          label="Are you authorized to work in the US?">
          <Radio.Group>
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
        <div
          className="flex justify-aro mb-4 items-center w-full
         borde border-purple-700 mt-6">
          <div
            className=" w-1/ border-red-900 flex flex-col mr-8
         items-start justify-start">
            <p className="text-start font-medium mb-2">Resume (Required)</p>
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
                  className="text-blue-500 mt-2">
                  Remove File
                </button>
              </div>
            ) : (
              <Dragger className="w-full" {...resumeProps}>
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
          <div>
            <p className="text-start font-medium mt- mb-2">CV</p>
            {userData?.cvPreview ? (
              <div className="flex flex-col items-center">
                <p>{userData.cv.name}</p>
                {/* <Document file={userData?.cv}>
                <Page pageNumber={1} />
              </Document>
              <p>
                Page {pageNumber} of {numPages}
              </p> */}
                <button onClick={handleRemoveCv} className="text-blue-500 mt-2">
                  Remove File
                </button>
              </div>
            ) : (
              <Dragger className="w-full" {...cvProps}>
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
        {/* Submit Button */}
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
              "Submit"
            )}
          </button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditProfile;
