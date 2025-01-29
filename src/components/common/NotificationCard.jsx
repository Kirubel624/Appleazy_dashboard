import React, { useState } from "react";
import { motion } from "framer-motion";
import { Tooltip } from "antd";
import {
  BellOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import ReactTimeAgo from "react-time-ago";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { FaChevronDown, FaChevronUp, FaRegStar } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import {
  getNotificationsAsync,
  markNotificationAsReadAsync,
} from "../../views/dashboard/notificationReducer";
import { IoBriefcaseOutline } from "react-icons/io5";
import { CiBellOn } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { MdOutlinePayments } from "react-icons/md";

TimeAgo.addLocale(en);
const NotificationCard = ({
  id,
  type,
  message,
  isRead,
  target_url,
  resourceId,
  resourceType,
  createdAt,
  Job,
  setViewSidebar,
}) => {
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  const { user, profile } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const iconBg = (type) => {
    switch (type) {
      case "Job":
        return "bg-blue-200";
      case "Feedback":
        return "bg-amber-200";
      case "Transaction":
        return "bg-green-200";
      default:
        return "bg-gray-100";
    }
  };
  const getTypeIcon = (type) => {
    switch (type) {
      case "Job":
        return (
          <IoBriefcaseOutline className="text-blue-500  w-7 h-7  border-red-900" />
        );
      case "Feedback":
        return <FaRegStar className="text-amber-500  w-7 h-7" />;
      case "Transaction":
        return <MdOutlinePayments className="text-green-500  w-7 h-7" />;
      default:
        return <CiBellOn className="text-blue-500 " />;
    }
  };
  const fetchNotifications = async () => {
    try {
      console.log("inside fetch notificaitons");
      const { payload } = await dispatch(
        getNotificationsAsync({ id: user?.id })
      );
      console.log(payload, "repsonse of fetch notificaitons using redux");
      // const res = await axios.get(
      //   `http://localhost:8000/api/v1/notification/user/${user?.id}`
      // );
      // console.log("res of fetch notificaitons", res);
      // setNotifications(res?.data);
    } catch (error) {
      console.log(error, "erororroororooro");
    }
  };
  const handleMarkAsRead = async () => {
    if (!isRead) {
      //important add local is read update
      const payload = await dispatch(markNotificationAsReadAsync({ id }));
      console.log(payload, "repsonse of mark read");
    }
    //remove later after local update has been implemented
    fetchNotifications();
    setViewSidebar(false);
    navigate(target_url);
  };
  return (
    <motion.div
      onClick={toggleExpand}
      className={`flex items-start justify-between p-4 rounded- shadow- border-l-[3px] border-b   ${
        isRead
          ? "bg-[#fbfbfb] border-gray-300"
          : "bg-white border-l-[#168A53] border-b-gray-200 "
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}>
      <div className="flex flex-col items-end boder border-red-900">
        <div className="flex flex-row items-start">
          <div className="flex items-center space-x-4">
            <Tooltip title={`Notification Type: ${resourceType}`}>
              <div
                className={` p- flex items-center justify-center  p-2 rounded ${iconBg(
                  resourceType
                )} rounded-`}>
                {getTypeIcon(resourceType)}
              </div>
            </Tooltip>
            <div>
              {target_url && (
                <button
                  onClick={handleMarkAsRead}
                  // href={target_url}
                  // target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline text-sm">
                  <p className="font-medium text-start text-gray-800 hover:underline">
                    {message}
                  </p>
                </button>
              )}
              <div className="flex items-center space-x-4 ">
                <p className="text-sm text-gray-500">{resourceType}</p>
                <div className="flex items-center">
                  <div className="bg-gray-400 w-1 h-1 rounded-full mr-1"></div>
                  <ReactTimeAgo
                    date={new Date(createdAt)}
                    locale="en-US"
                    className="text-gray-500"
                  />
                </div>
              </div>
            </div>
            {/* <div className="mb-6">
              <button
                onClick={toggleExpand}
                className="flex items-center justify-between w-full text-left focus:outline-none">
                {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
              </button>
            </div> */}
          </div>
        </div>
        {/* {isExpanded && (
          <div className="mt-4 w-full text-end order">
            <p>
              {Job.jobType} role at {Job.company}
            </p>
          </div>
        )} */}
      </div>
    </motion.div>
  );
};

export default NotificationCard;
