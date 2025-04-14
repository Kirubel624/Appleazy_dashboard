import { Avatar, Badge, Form, Input, Modal, Radio } from "antd";
import React, { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";
import { ClipLoader } from "react-spinners";

const AssistantCard = ({
  data,
  handleReassignment,
  reassignOption,
  setReassignOption,
  selectedJob,
  loading,
  setLoading,
  type,
  handleAssignment,
}) => {
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  const [isExpanded, setIsExpanded] = useState(false);
  const [assign, setAssign] = useState(false);
  const [formData, setFormData] = useState({
    reason: "",
    reasonDescription: "",
  });
  const handleChange = (changedValues) => {
    console.log(changedValues, "values");
    setFormData((prevData) => ({
      ...prevData,
      ...changedValues,
    }));
  };
  useEffect(() => {
    console.log(formData, "datatatatatat");
  }, [formData]);
  return (
    <div>
      {type === "assignment" ? (
        <Badge.Ribbon
          text="Current"
          color="#168A53"
          placement="end"
          style={{
            display: data.id === selectedJob?.assistantId ? "block" : "none",
          }}>
          <div
            className="bg-white flex flex-col items-center gap-
     justify-center rounded-lg max-w-md p-5 border-[1px] border-gray-200">
            <Avatar
              size={52}
              style={{ border: "0.1px solid #d8d8d8" }}
              className=" rounded-full  "
              src={
                data?.Assistant?.profileImage ||
                `https://robohash.org/${data?.name}`
              }
              alt="Assistant's Profile Picture"
            />
            <p className="font-medium mt-2">{data.name}</p>
            <p className="text-gray-600">Ongoing Jobs</p>
            <p className="font-medium">{data.totalOngoingAssignments}</p>
            <button
              disabled={data.id === selectedJob?.assistantId}
              onClick={() => setAssign(true)}
              className={`${
                data.id === selectedJob?.assistantId
                  ? "bg-[#69d0a0]"
                  : "bg-[#168A53]"
              } mt-2 text-sm text-white py-2 px-5 font- `}>
              Assign
            </button>
            <Modal
              open={assign}
              onClose={() => setAssign(false)}
              onCancel={() => setAssign(false)}
              footer={null}>
              <div>
                <div>
                  <h1 className="text-lg font-semibold mb-4">
                    How would you like to reassign this assignment?
                  </h1>
                  <Radio.Group
                    onChange={(e) => setReassignOption(e.target.value)}
                    value={reassignOption}
                    className="flex flex-col gap-3">
                    <Radio value="penalty">
                      <span className="font-medium">Reassign with penalty</span>{" "}
                      – The assistant's maximum rating will decrease, and this
                      will count as a failed job.
                    </Radio>
                    <Radio value="no_penalty">
                      <span className="font-medium">
                        Reassign without penalty
                      </span>{" "}
                      – The assistant will not receive any penalty, and the
                      assignment will be removed. They will still be paid for
                      completed jobs.
                    </Radio>
                    <Radio value="replacement">
                      <span className="font-medium">Complete replacement</span>{" "}
                      – Another assistant will take over all responsibilities,
                      including applications. The previous assistant will not be
                      paid for any jobs applied for. (Recommended for jobs where
                      the assistant hasn't started applying yet.)
                    </Radio>
                  </Radio.Group>
                  <Form
                    className="mt-4"
                    name="reasonForm"
                    initialValues={formData}
                    layout="vertical"
                    onValuesChange={handleChange}>
                    <Form.Item
                      label="Reason"
                      name="reason"
                      rules={[
                        { required: true, message: "Please provide a reason" },
                      ]}>
                      <Input value={formData.reason} />
                    </Form.Item>

                    <Form.Item
                      label="Reason Description"
                      name="reasonDescription"
                      rules={[
                        {
                          required: true,
                          message: "Please provide a description",
                        },
                      ]}>
                      <Input.TextArea value={formData.reasonDescription} />
                    </Form.Item>
                  </Form>
                </div>
                <button
                  onClick={() =>
                    handleReassignment(
                      reassignOption,
                      formData?.reason,
                      formData?.reasonDescription,
                      data.id
                    )
                  }
                  className="bg-[#168A53] mt- text-sm text-white py-2 px-5 font- ">
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
                    "Continue"
                  )}
                </button>
              </div>
            </Modal>
          </div>
        </Badge.Ribbon>
      ) : (
        <div
          className="bg-white flex flex-col items-center gap-
     justify-center rounded-lg max-w-md p-5 border-[1px] border-gray-200">
          <Avatar
            size={52}
            style={{ border: "0.1px solid #d8d8d8" }}
            className=" rounded-full  "
            src={
              data?.Assistant?.profileImage ||
              `https://robohash.org/${data?.name}`
            }
            alt="Assistant's Profile Picture"
          />
          <p className="font-medium mt-2">{data.name}</p>
          <p className="text-gray-600">Ongoing Jobs</p>
          <p className="font-medium">{data.totalOngoingAssignments}</p>
          <button
            disabled={data.id === selectedJob?.assistantId}
            onClick={() => setAssign(true)}
            className={`${
              data.id === selectedJob?.assistantId
                ? "bg-[#69d0a0]"
                : "bg-[#168A53]"
            } mt-2 text-sm text-white py-2 px-5 font- `}>
            Assign
          </button>
          <Modal
            open={assign}
            onClose={() => setAssign(false)}
            onCancel={() => setAssign(false)}
            footer={null}>
            <div>
              <div>
                <h1 className="text-lg font-semibold mb-4">
                  Are you sure you want to assign this subscripton to this
                  assistant?
                </h1>
              </div>
              <div>
                <button
                  onClick={() => handleAssignment(data.id)}
                  className="bg-[#168A53] mt- text-sm text-white py-2 px-5 font- mr-3">
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
                    "Yes"
                  )}
                </button>
                <button className="border border-[#168A53] mt- text-sm text-[#168A53] py-2 px-5 font- ">
                  No
                </button>
              </div>
            </div>
          </Modal>
        </div>
      )}
    </div>
  );
};

export default AssistantCard;
