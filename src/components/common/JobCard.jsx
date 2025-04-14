import { Avatar, Badge, Dropdown, Progress, Tag, Tooltip } from "antd";
import dayjs from "dayjs";
import React, { useRef, useState } from "react";
import utc from "dayjs/plugin/utc";
import { FaComments, FaTachometerAlt } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { GoKebabHorizontal } from "react-icons/go";
import Icon, {
  DeleteOutlined,
  EditOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { BiRepost } from "react-icons/bi";
import { TfiReload } from "react-icons/tfi";
import { Link } from "react-router-dom";
dayjs.extend(utc);

const JobCard = ({
  data,
  setSelectedJob,
  setEditModal,
  setReassignModal,
  setRepostModal,
  repostModal,
  setDeleteModal,
}) => {
  const statusColors = {
    ongoing: "orange",
    completed: "green",
    reassigned: "red",
  };

  const onClick = ({ key }, record) => {
    if (key == "edit") {
      // // console.log("inside key triiger of edit..........");
      setSelectedJob(record);
      setEditModal(true);
      // // console.log(record?.id);
    } else if (key == "reassign") {
      setSelectedJob(record);
      setReassignModal(true);
    } else if (key == "repost") {
      setSelectedJob(record);
      setRepostModal(true);
    }
    // else if (key == "delete") {
    //   setSelectedJob(record);
    //   setDeleteModal(true);
    // }
  };
  const items = [
    {
      key: "edit",
      label: "Edit",
      icon: <EditOutlined className="text-blue-500" />,
    },
    {
      key: "reassign",
      label: "Reassign",
      icon: <Icon component={() => <ReloadOutlined />} />,
    },
    {
      key: "repost",
      label: "Repost",
      icon: <Icon component={() => <TfiReload />} />,
    },
    // {
    //   key: "delete",
    //   label: "Delete",
    //   icon: (
    //     <Icon style={{ color: "red" }} component={() => <DeleteOutlined />} />
    //   ),
    // },
  ];
  const isCreatedToday = dayjs(data?.createdAt).isSame(dayjs(), "day");
  return (
    <Badge.Ribbon
      text="New"
      color="#168A53"
      placement="start"
      style={{ display: isCreatedToday ? "block" : "none" }}>
      <div className="bg-white border-[1px] flex flex-col justify- h-full border-gray-200 shadow-sm px-4 pb-4 pt-8 rounded ">
        <div className="flex items-start justify-between">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              {data?.Subscription?.SubscriptionPricing?.tier}
            </h2>
            <p className="text-sm text-gray-600">
              {data?.Subscription?.SubscriptionPricing?.type}
            </p>
          </div>

          {!data?.hasBeenCompleted && (
            <Dropdown
              className=" mb-"
              menu={{
                items,
                onClick: (value) => onClick(value, data),
              }}>
              <GoKebabHorizontal className=" border- w-5 h-5  flex justify-end items-end" />
            </Dropdown>
          )}
        </div>

        <div className="flex items-center justify-between mb-3">
          <p className="text-xl font-medium font-">
            {data.applicationsTotal} Job applications
          </p>

          <Tag
            className=" capitalize"
            color={statusColors[data?.status]}
            key={data.status}>
            {data?.status}
          </Tag>
        </div>
        {!data.hasBeenCompleted && (
          <div className="">
            Estimated to be completed by{" "}
            {dayjs(data?.dueDate).format("MMMM DD YYYY")}
          </div>
        )}
        <div className="my-3">
          <div className=" items-center">
            <Tooltip
              title={`Completion(Dark green): ${Number(
                data?.completionPercentage
              ).toFixed(2)}% Expected(Light green): ${Number(
                data?.elapsedPercentage
              ).toFixed(2)}%`}>
              <p>Completion percentage</p>
              <Progress
                trailColor="#F0F0F0"
                strokeColor={"#8efeca"}
                percent={Number(data?.elapsedPercentage).toFixed(2)}
                success={{
                  percent: Number(data?.completionPercentage).toFixed(2),
                  strokeColor: "#168A53",
                }}
                status="active"
              />
            </Tooltip>

            {/* {!data.hasBeenCompleted && (
            <>
              {" "}
              <p>Expected percentage</p>
              <Progress
                trailColor="#F0F0F0"
                strokeColor={"#8efeca"}
                percent={Number(data?.elapsedPercentage).toFixed(2)}
                status="active"
              />
            </>
          )} */}
          </div>

          {/* {data.onTrackMessage} */}
          {data.progressMessage}
        </div>
        <div className="flex flex-col items-start ">
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
                    data?.client?.Profile?.profileImage ||
                    `https://robohash.org/${data?.client?.Profile?.profileImage}`
                  }
                  alt="Assistant's Profile Picture"
                />
                <div className="flex flex-col">
                  <span className="font-sans text-sm font-medium">
                    {data?.client?.name?.split(" ")[0]}
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
                    data?.assistant?.Assistant?.profileImage ||
                    `https://robohash.org/${data?.assistant?.username}`
                  }
                  alt="Assistant's Profile Picture"
                />
                <div className="flex flex-col">
                  <span className="font-sans text-sm font-medium">
                    {data?.assistant?.name?.split(" ")[0]}
                  </span>
                  <span className="text-xs text-gray-500">Assistant</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 my-3">
            <Link
              to={`/chat/${data.assistantId}/${data.clientId}`}
              className="flex items-center gap-2 bg-[#000000] 
            border-[1px] border-[#000000] text-white px-4 py-2 rounded
           hover:bg-[#ffffff] hover:border-[1px] hover:border-black hover:text-black  transition">
              <FaComments />
              Chat
            </Link>

            <Link
              to={`${data.subscriptionId}/${data.clientId}`}
              className="flex items-center gap-2 border-[1px] border-black text-[#000000]
           px-4 py-2 rounded hover:bg-[#000000] hover:text-white transition">
              <MdDashboard />
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </Badge.Ribbon>
  );
};

export default JobCard;
