import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Result,
  Select,
} from "antd";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createJobAsync, getJobAsync, updateJobAsync } from "./jobReducer";
import { useForm } from "antd/es/form/Form";
import dayjs from "dayjs";
import { ClipLoader } from "react-spinners";
import useAPIPrivate from "../../hooks/useAPIPrivate";
const { Option } = Select;
const { TextArea } = Input;

const EditJob = ({
  editModal,
  setEditModal,
  fetchJobs,
  id,
  setJobId,
  subscriptionId,
  assignmentId,
}) => {
  console.log(
    assignmentId,
    "passed assignment ....................................///////////////////////"
  );
  const [loading, setLoading] = useState(false);
  const [disable, setDisable] = useState(false);
  const [jobInfo, setJobInfo] = useState(false);
  const [warning, setWarning] = useState(false);
  const [form] = useForm();
  const dispatch = useDispatch();
  const apiPrivate = useAPIPrivate();
  const { user } = useSelector((state) => state.auth);
  const [pendingValues, setPendingValues] = useState(null);
  const handleUpdate = async (values) => {
    if (values?.status === "applied" && !disable && !jobInfo.hasBeenApplied) {
      setPendingValues(values);
      setWarning(true); // Open the warning modal
    } else {
      await handleSubmission(values); // Directly submit if no warning is needed
    }
  };

  const handleSubmission = async (values) => {
    setLoading(true);
    // if (values?.status === "applied") {
    //   setWarning(true);
    // }
    console.log(values, "valeus");
    const data = {
      ...values,
      userId: user?.id,
      jobRequestId: null,
      subscriptionId,
      assignmentId,
    };
    try {
      const { payload } = await dispatch(
        updateJobAsync({ id, data, apiPrivate })
      );
      if (payload?.status === 200) {
        message.success("Job updated successfully!");
        fetchJobs();
        form.resetFields();
        setEditModal(false);
      } else if (payload?.status === 400) {
        message.info("An error occurred");
      } else {
        message.error("An error occurred");
      }
    } catch (error) {
      console.log(error, "llllldddddddddddddddddddl");
    }
    setLoading(false);
  };
  const fetchJob = async () => {
    console.log(id, "id of job.....................");
    const { payload } = await dispatch(getJobAsync({ id, apiPrivate }));
    console.log(payload, "response of job fetching");
    const data = { ...payload, date: dayjs(payload?.date) };
    console.log(data, "after ///");
    setJobInfo(data);
    form.setFieldsValue(data);
  };
  useEffect(() => {
    console.log("inside use effect.......................");
    // console.log(fetchJob(), "resut.......////////////////////////////////");
    fetchJob();
    const hideWarning = localStorage.getItem("hideWarning");
    if (hideWarning === "true") {
      setDisable(true);
    }
  }, [id]);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  return (
    <Modal
      title="Edit job"
      width={900}
      open={editModal}
      onCancel={() => {
        setEditModal(false);
      }}
      onClose={() => {
        setEditModal(false);
      }}
      footer={null}
    >
      <div>
        {!disable && (
          <Modal
            open={warning}
            footer={null}
            onClose={() => setWarning(false)}
            onCancel={() => setWarning(false)}
          >
            <Result
              title="Are you sure?"
              subTitle="This action is permanent and will count towards your job application limit for this subscription. Once confirmed, you won't be able to delete this job."
              extra={
                <>
                  <Button
                    type="primary"
                    onClick={() => {
                      if (dontShowAgain) {
                        localStorage.setItem("hideWarning", "true");
                      }
                      handleSubmission(pendingValues);
                      setWarning(false);
                    }}
                  >
                    Yes
                  </Button>
                  <Button onClick={() => setWarning(false)} type="primary">
                    Cancel
                  </Button>
                  <div style={{ marginTop: "10px" }}>
                    <Checkbox
                      checked={dontShowAgain}
                      onChange={(e) => setDontShowAgain(e.target.checked)}
                    >
                      Don't show this again
                    </Checkbox>
                  </div>
                </>
              }
            />
          </Modal>
        )}

        <Form
          form={form}
          onFinish={handleUpdate}
          wrapperCol={{ span: 24 }}
          labelCol={{ span: 24 }}
        >
          {/* Job Title */}
          <div className="flex items-center">
            <Form.Item
              className="w-1/3"
              label="Job Title"
              name="jobTitle"
              rules={[
                { required: true, message: "Please input the job title!" },
              ]}
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
              rules={[
                { required: true, message: "Please input the location!" },
              ]}
            >
              <Input placeholder="Enter location" />
            </Form.Item>
          </div>
          <div className="flex items-center">
            {/* Pay */}
            {/* Status */}
            <Form.Item
              className="w-1/3 mr-3"
              label="Status"
              name="status"
              rules={[{ required: true, message: "Please select the status!" }]}
            >
              <Select placeholder="Select status">
                {!jobInfo.hasBeenApplied ? (
                  <>
                    <Option value="pending application">
                      Pending application
                    </Option>
                    <Option value="applied">Applied</Option>
                  </>
                ) : (
                  <>
                    <Option value="pending response">Awaiting Response</Option>
                    <Option value="acknowledged">Acknowledged</Option>
                    <Option value="interview">Interview</Option>
                    <Option value="offer">Offer</Option>
                    <Option value="rejected">Rejected</Option>
                    <Option value="no response">No response</Option>
                  </>
                )}
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
              rules={[
                { required: true, message: "Please input the job type!" },
              ]}
            >
              <Input placeholder="Enter job type" />
            </Form.Item>
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
            {/* <Button type="primary" loading={loading} htmlType="submit"></Button> */}
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
    </Modal>
  );
};

export default EditJob;
