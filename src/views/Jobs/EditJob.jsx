import {
  Avatar,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Progress,
  Tag,
  Tooltip,
} from "antd";
import { useForm, useWatch } from "antd/es/form/Form";
import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import dayjs from "dayjs";
import { ClipLoader } from "react-spinners";
import useAPIPrivate from "../../hooks/useAPIPrivate";

const EditJobs = ({
  editModal,
  setEditModal,
  fetchJobs,
  selectedJob,
  id,
  subscriptionId,
  setSelectedJob,
}) => {
  const [form] = useForm();
  const apiPrivate = useAPIPrivate();

  const statusColors = {
    ongoing: "orange",
    completed: "green",
    reassigned: "red",
  };
  const [loading, setLoading] = useState(false);
  const [originalRemaining, setOriginalRemaining] = useState(
    selectedJob?.remainingApplications || 0
  );
  const [originalApplicationsTotal, setOriginalApplicationsTotal] = useState(
    selectedJob?.applicationsTotal || 0
  );
  const currentApplicationsTotal = useWatch("applicationsTotal", form);

  const fetchJob = async () => {
    const data = { ...selectedJob, dueDate: dayjs(selectedJob?.dueDate) };
    form.setFieldsValue(data);
    setOriginalRemaining(selectedJob?.remainingApplications || 0);
    setOriginalApplicationsTotal(selectedJob?.applicationsTotal || 0);
  };
  const handleUpdate = async (values) => {
    setLoading(true);
    const data = {
      ...values,
      dueDate: dayjs(selectedJob?.dueDate).format("YYYY-MM-DD HH:mm:ss.SSSZ"),
    };
    console.log(data, "data");
    try {
      const res = await apiPrivate.patch(
        `/assignment/${selectedJob?.id}`,
        values
      );
      console.log(res, "resposne of update");
      if (res.status === 200) {
        message.success("Job updated successfully!");
        setLoading(false);
        form.resetFields();
        setEditModal(false);
        // setSelectedJob(null);
        fetchJobs();
      }
    } catch (error) {
      console.log(error, "error");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    console.log(selectedJob, "inside use effect.......................");
    // // console.log(fetchJob(), "resut.......////////////////////////////////");
    fetchJob();
  }, [id]);
  const handleCalculation = () => {
    const newTotal = currentApplicationsTotal;
    const oldTotal = originalApplicationsTotal;
    const oldRemaining = originalRemaining;
    let currentRemaining = form.getFieldValue("remainingApplications");

    if (newTotal === undefined || newTotal === null) {
      return; // Do nothing if newTotal is not set
    }

    if (newTotal === 0) {
      form.setFieldValue("remainingApplications", oldRemaining);
      return;
    }

    const difference = newTotal - oldTotal;
    currentRemaining += difference;

    if (currentRemaining > newTotal) {
      currentRemaining = newTotal;
    }

    if (currentRemaining < oldRemaining) {
      currentRemaining = oldRemaining;
    }

    form.setFieldValue("remainingApplications", currentRemaining);
  };

  useEffect(() => {
    handleCalculation();
  }, [currentApplicationsTotal]);

  return (
    <div>
      <Form
        form={form}
        onFinish={handleUpdate}
        wrapperCol={{ span: 24 }}
        labelCol={{ span: 24 }}>
        <div className="flex items-center gap-4">
          {/* <p>{selectedJob?.remainingApplications}</p> */}
          <Form.Item className="w-1/2" name="dueDate" label="Due date">
            <DatePicker className="w-full" />
          </Form.Item>
          <Form.Item
            className="w-1/2"
            name="applicationsTotal"
            label="Applications total"
            rules={[
              {
                validator: (_, value) => {
                  if (value < (selectedJob?.remainingApplications || 0)) {
                    return Promise.reject(
                      "Amount cannot be less than remaining applications"
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}>
            <InputNumber className="w-full" type="number" />
          </Form.Item>
        </div>
        <div className="flex items-center gap-4">
          <Form.Item
            className="w-1/2"
            name="remainingApplications"
            label="Remaining applications">
            <Input disabled type="number" />
          </Form.Item>
          <Form.Item
            className="w-1/2"
            name="maxRating"
            label="Max rating"
            rules={[
              {
                required: true,
                message: "Please enter rating",
              },
              {
                validator: (_, value) => {
                  if (value !== undefined && (value < 1 || value > 5)) {
                    return Promise.reject("Rating must be between 1 and 5");
                  }
                  return Promise.resolve();
                },
              },
            ]}>
            <InputNumber className="w-full" type="number" />
          </Form.Item>
        </div>
        <Form.Item>
          {/* <Button type="primary" loading={loading} htmlType="submit"></Button> */}
          <button
            type="submit"
            className="h-9 self-end flex 
          items-center bg-[#168A53] px-4 rounded-lg text-white ">
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
      <div className="bg-white border[1px] flex flex-col justify- h-full border-gray-200 shadow- px-4 pb-4 pt-4 rounded ">
        <h1 className="text-xl font-bold">Assignment information</h1>
        <div className="flex items-start justify-between mt-2">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              {selectedJob?.Subscription?.SubscriptionPricing?.tier}
            </h2>
            <p className="text-sm text-gray-600">
              {selectedJob?.Subscription?.SubscriptionPricing?.type}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-start mb-4">
          <div className="flex items-center w-full flex-wrap rounded justify-between border-[1px]  p-1">
            {/* Client Profile */}
            <div
              id="job-profile"
              onClick={() => setOpenProfile(true)}
              className="flex items-center hover:cursor-pointer space-x-3 bg-white p-4 rounded">
              <div className="flex items-center">
                <Avatar
                  size={42}
                  style={{ border: "0.1px solid #d8d8d8" }}
                  className="w-8 h-8 rounded-full  mr-4"
                  src={
                    selectedJob?.client?.Profile?.profileImage ||
                    `https://robohash.org/${selectedJob?.client?.Profile?.profileImage}`
                  }
                  alt="Assistant's Profile Picture"
                />
                <div className="flex flex-col">
                  <span className="font-sans text-sm font-medium">
                    {selectedJob?.client?.name?.split(" ")[0]}
                  </span>
                  <span className="text-xs text-gray-500">Client</span>
                </div>
              </div>
            </div>

            {/* Divider */}
            {/* <div className="bg-gray-200 w-[2px] h-[50px]"></div> */}

            {/* Assistant Profile */}
            <div
              id="assistant-profile"
              className="flex items-center hover:cursor-pointer space-x-3 justify-between bg-white p-4 rounded">
              <div className="flex items-center">
                <Avatar
                  style={{ border: "0.1px solid #d8d8d8" }}
                  size={42}
                  className="w-8 h-8 rounded-full border-[1px] mr-4"
                  src={
                    selectedJob?.assistant?.Assistant?.profileImage ||
                    `https://robohash.org/${selectedJob?.assistant?.username}`
                  }
                  alt="Assistant's Profile Picture"
                />
                <div className="flex flex-col">
                  <span className="font-sans text-sm font-medium">
                    {selectedJob?.assistant?.name?.split(" ")[0]}
                  </span>
                  <span className="text-xs text-gray-500">Assistant</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <p className="text-xl font-medium font-">
            {selectedJob.applicationsTotal} Job applications
          </p>

          <Tag
            className=" capitalize"
            color={statusColors[selectedJob?.status]}
            key={selectedJob.status}>
            {selectedJob?.status}
          </Tag>
        </div>
        {!selectedJob.hasBeenCompleted && (
          <div className="">
            Estimated to be completed by{" "}
            {dayjs(selectedJob?.dueDate).format("MMMM DD YYYY")}
          </div>
        )}
        <div className="my-3">
          <div className=" items-center">
            <Tooltip
              title={`Completion(Dark green): ${Number(
                selectedJob?.completionPercentage
              ).toFixed(2)}% Expected(Light green): ${Number(
                selectedJob?.elapsedPercentage
              ).toFixed(2)}%`}>
              <p>Completion percentage</p>
              <Progress
                trailColor="#F0F0F0"
                strokeColor={"#8efeca"}
                percent={selectedJob?.elapsedPercentage}
                success={{
                  percent: Number(selectedJob?.completionPercentage).toFixed(2),
                  strokeColor: "#168A53",
                }}
                status="active"
              />
            </Tooltip>

            {/* {!selectedJob.hasBeenCompleted && (
            <>
              {" "}
              <p>Expected percentage</p>
              <Progress
                trailColor="#F0F0F0"
                strokeColor={"#8efeca"}
                percent={Number(selectedJob?.elapsedPercentage).toFixed(2)}
                status="active"
              />
            </>
          )} */}
          </div>

          {/* {selectedJob.onTrackMessage} */}
          {selectedJob.progressMessage}
        </div>
      </div>
    </div>
  );
};

export default EditJobs;
