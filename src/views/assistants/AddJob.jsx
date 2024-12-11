import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Select,
} from "antd";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createJobAsync } from "./jobReducer";
import { ClipLoader } from "react-spinners";
import { useForm } from "antd/es/form/Form";
import useAPIPrivate from "../../hooks/useAPIPrivate";
const { Option } = Select;
const { TextArea } = Input;
const AddJob = ({ subscriptionId, setAddModal, fetchJobs }) => {
  const [form] = useForm();

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const apiPrivate = useAPIPrivate();
  const { user } = useSelector((state) => state.auth);
  const handleAdd = async (values) => {
    try {
      setLoading(true);
      console.log(values, "valeus");
      const data = {
        ...values,
        userId: user?.id,
        subscriptionId,
        jobRequestId: null,
      };
      const { payload } = await dispatch(createJobAsync({ data, apiPrivate }));
      console.log(payload, "not in catch error the payload");
      if (payload?.status === 200) {
        message.success("Job added successfully!");
        fetchJobs();
        form.resetFields();
      } else if (payload?.status === 400) {
        message.info(
          "You have reached the limit of adding jobs for this subscription!"
        );
      } else {
        message.error("An error has occurred");
      }
      setAddModal(false);
    } catch (error) {
      console.log("inside error conditon in modal");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <Form
        form={form}
        onFinish={handleAdd}
        wrapperCol={{ span: 24 }}
        labelCol={{ span: 24 }}
      >
        {/* Job Title */}
        <div className="flex items-center">
          <Form.Item
            className="w-1/3"
            label="Job Title"
            name="jobTitle"
            rules={[{ required: true, message: "Please input the job title!" }]}
          >
            <Input placeholder="Enter job title" />
          </Form.Item>
          <Form.Item
            // className=""

            className="mx-3 w-1/3"
            label="Company"
            name="company"
            rules={[
              { required: true, message: "Please input the company name!" },
            ]}
          >
            <Input placeholder="Enter company name" />
          </Form.Item>
          <Form.Item
            className="w-1/3"
            label="Location"
            name="location"
            rules={[{ required: true, message: "Please input the location!" }]}
          >
            <Input placeholder="Enter location" />
          </Form.Item>
        </div>
        <div className="flex items-center">
          <Form.Item
            className="w-1/3 mx-3"
            label="Status"
            name="status"
            rules={[{ required: true, message: "Please select the status!" }]}
          >
            <Select placeholder="Select status">
              <Option value="pending response">Awaiting Response</Option>
              {/* <Option value="interview">Interview</Option>
              <Option value="offer">Offer</Option>
              <Option value="rejected">Rejected</Option> */}
            </Select>
          </Form.Item>
          {/* Date */}
          <Form.Item
            className="w-1/3"
            label="Date"
            name="date"
            rules={[{ required: true, message: "Please select the date!" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            className="w-1/3 ml-3"
            label="Job Setting"
            name="jobSetting"
            rules={[
              { required: true, message: "Please input the job setting!" },
            ]}
          >
            <Input placeholder="Enter job setting" />
          </Form.Item>{" "}
        </div>
        <div className="flex items-center">
          <Form.Item
            className="w-1/2"
            label="Job Type"
            name="jobType"
            rules={[{ required: true, message: "Please input the job type!" }]}
          >
            <Input placeholder="Enter job type" />
          </Form.Item>
          {/* Pay */}
          <Form.Item
            className="w-1/3 mx-3"
            label="Minumum Pay"
            name="minPay"
            rules={[
              { required: true, message: "Please input the minimum pay!" },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Enter minimum pay"
              min={0}
              formatter={(value) =>
                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
            />
          </Form.Item>
          <Form.Item
            className="w-1/3"
            label="Maximum Pay"
            name="maxPay"
            rules={[
              { required: true, message: "Please input the maximum pay!" },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Enter maximum pay"
              min={0}
              formatter={(value) =>
                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
            />
          </Form.Item>

          {/* Status */}
        </div>

        {/* Description */}
        <Form.Item
          label="Description"
          name="description"
          rules={[
            { required: true, message: "Please enter the job description!" },
          ]}
        >
          <TextArea rows={4} placeholder="Enter job description" />
        </Form.Item>

        {/* Link */}
        <Form.Item
          label="Link"
          name="link"
          rules={[
            {
              required: true,
              message: "Please enter the job application link!",
            },
          ]}
        >
          <Input placeholder="Enter application link" />
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          {/* <Button type="primary" loading={loading} htmlType="submit">
            Submit
          </Button> */}
          <button
            type="submit"
            className="h-9 self-end flex 
          items-center bg-[#168A53] px-4 rounded-lg text-white "
          >
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

export default AddJob;
