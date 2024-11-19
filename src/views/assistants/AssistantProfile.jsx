import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Modal,
  Progress,
  Rate,
  Form,
  Input,
  message,
} from "antd";
import { MessageOutlined, StarOutlined, StarFilled } from "@ant-design/icons";
import dayjs from "dayjs";
import { FaCommentDots } from "react-icons/fa";
import ReviewService from "./reviewService";

const AssistantProfile = ({
  username,
  fullName,
  profileImage,
  completionPercentage,
  onTrackMessage,
  skills,
  rating,
  feedbacks = [],
  experience,
  delayedDays,
  dueDate,
  remainingApplications,
  applicationsTotal,
  hasBeenCompleted,
  status,
  id,
  assistantId,
  clientId,
  maxRating,
}) => {
  const twoColors = {
    "0%": "#168A53",
    // "50%": "#20be74",
    "100%": "#168A53",
  };
  const [form] = Form.useForm();
  const [feedBack, setFeedBack] = useState();
  const [showFeedBack, setShowFeedBack] = useState();
  const [loading, setLoading] = useState(false);
  const onFinish = async (values) => {
    const data = {
      ...values,
      assignmentId: id,
      reviewedId: assistantId,
      reviewerId: clientId,
    };
    setLoading(true);

    if (feedBack !== null) {
      const res = await ReviewService.updateReview(feedBack.id, data);
    } else {
      const res = await ReviewService.createReview(data);
    }
    console.log(data);

    setLoading(false);
    setShowFeedBack(false);
    message.success("Feedback submitted successfully!");
    form.resetFields();
  };
  const fetchReview = async (id = null) => {
    const res = await ReviewService.getReviewById({
      id: id,
      reviewedId: assistantId,
      reviewerId: clientId,
    });
    if (res.status === 404) {
      setFeedBack(null);
    } else {
      setFeedBack(res);
    }
    console.log(res, "response of get review,,,,,,,,,,,,,");
  };
  useEffect(() => {
    fetchReview();
  }, []);
  return (
    <div className="assistant-profile bg-white shadow-d p-6 rounded-lg">
      <Modal
        open={showFeedBack}
        onCancel={() => setShowFeedBack(false)}
        onClose={() => setShowFeedBack(false)}
        footer={null}>
        <div className=" mx-auto p-6 bg-white rounded-md">
          <h2 className="text-2xl font-semibold mb-6 flex items-center text-[#168A53]">
            <FaCommentDots className="mr-2" /> Feedback Form(fetch the previous
            review if available)
          </h2>

          <Form
            initialValues={{ ...feedBack }}
            form={form}
            layout="vertical"
            onFinish={onFinish}>
            {/* Rating */}
            <Form.Item
              name="rating"
              label="Rate your experience"
              rules={[{ required: true, message: "Please provide a rating!" }]}>
              <Rate
                count={maxRating}
                className="text-[#168A53]"
                character={<StarFilled />}
              />
            </Form.Item>

            {/* Feedback */}
            <Form.Item
              name="comment"
              label="Your feedback"
              rules={[
                { required: true, message: "Please share your feedback!" },
              ]}>
              <Input.TextArea
                rows={4}
                placeholder="Tell us about your experience with this job application assistant..."
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="w-full bg-[#168A53] hover:bg-green-600 text-white">
                Submit Feedback
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
      {/* Header with Name, Avatar, and Message Button */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <Avatar
            src={profileImage || `https://robohash.org/${username}`}
            size={64}
          />
          <div>
            <h2 className="text-xl font-semibold">{fullName}</h2>
            <p className="text-sm text-gray-500">Job Application Assistant</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setAddModal(true)}
            className="h-9 flex items-center bg-[#168A53] px-3 rounded-lg text-white">
            <MessageOutlined className="mr-2" /> Message
          </button>
          {hasBeenCompleted && status === "completed" && (
            <button
              onClick={() => setShowFeedBack(true)}
              className="h-9 flex items-center bg-[#168A53] px-3 rounded-lg text-white">
              <StarOutlined className="mr-2" /> Share feedback
            </button>
          )}
        </div>
      </div>

      {/* Job Application Progress */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Job Application Status</h3>
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="font-medium">Applications remaining</p>
            <p className="font-">
              {remainingApplications} / {applicationsTotal}
            </p>
          </div>
          <div>
            <p className="font-medium">Estimated to be completed by</p>
            <p className="font-">{dayjs(dueDate).format("DD/MM/YYYY")}</p>
          </div>
        </div>
        <p className="font-medium">Application progress</p>
        <Progress
          trailColor="#F0F0F0"
          strokeColor={"#168A53"}
          percent={completionPercentage}
          status="active"
        />
        <p className="text-sm mt-2 text-gray-600">{onTrackMessage}</p>
      </div>
      <div className="mb-6">
        <p className="text-lg font-medium mb-2">Completed projects</p>

        <p>{delayedDays}</p>
      </div>
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Experience</h3>
        <p>{experience}</p>
      </div>

      {/* Skills and Rating */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Skills</h3>
        <div className="flex space-x-2">
          {skills.map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg text-sm">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AssistantProfile;
