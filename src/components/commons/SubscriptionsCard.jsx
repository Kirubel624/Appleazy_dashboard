import Icon, { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Avatar, Dropdown } from "antd";
import React, { useState } from "react";
import { FaCheckCircle, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { GoKebabHorizontal } from "react-icons/go";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const SubscriptionsCard = ({
  id,
  SubscriptionPricing,
  jobsRemaining,
  jobLimit,
  assignModal,
  setAssignModal,
  selectedJob,
  setSelectedJob,
  data,
  User,
  setDeleteModal,
}) => {
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState(false);
  const onClick = ({ key }, record) => {
    if (key == "delete") {
      setSelectedJob(record);
      setDeleteModal(true);
    }
  };
  const items = [
    {
      key: "delete",
      label: "Delete",
      icon: (
        <Icon style={{ color: "red" }} component={() => <DeleteOutlined />} />
      ),
    },
  ];
  return (
    <div
      className="md:max-w-md p-6 rounded-lg shadow
     bg-white border border-gray-200">
      <div className=" mb- borde flex items-end justify-end self-end w-full">
        <Dropdown
          className="self-end"
          menu={{
            items,
            onClick: (value) => onClick(value, data),
          }}>
          <GoKebabHorizontal className="  borde border-red-900 w-5 h-5  " />
        </Dropdown>
      </div>
      <div className="flex items-center justify-between">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            {SubscriptionPricing?.tier}
          </h2>
          <p className="text-sm text-gray-600">{SubscriptionPricing?.type}</p>
        </div>

        {/* Jobs Remaining */}
        <div className="text-lg font-medium text-green-600 mb-4">
          <span>Total jobs: </span>
          {jobLimit}
        </div>
      </div>
      <div className="mb-6">
        <button
          onClick={toggleExpand}
          className="flex items-center justify-between w-full text-left focus:outline-none">
          <span className="text-lg font-medium text-gray-900">Features</span>
          {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
        </button>
        {isExpanded && (
          <div>
            {SubscriptionPricing?.features.map((feature) => (
              <div className="flex items-center text-black mb-2">
                <FaCheckCircle className="text-green-500 mr-2" />
                <div
                  className="text-black"
                  dangerouslySetInnerHTML={{ __html: feature }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="border-b pb-4 mb-4 text-center">
        <p className="text-sm text-gray-500">
          There are {jobsRemaining} applications remaining in this subscription.
        </p>
      </div>
      <div className="flex items-center justify-between space-x-4 mt-4">
        <button
          onClick={() => {
            setAssignModal(true);
            setSelectedJob(data);
          }}
          className="bg-[#168A53] text-white px-4 py-2 
           hover:bg-[#168A53] transition">
          Assign
        </button>
        <div className="flex items-center">
          <Avatar
            size={42}
            style={{ border: "0.1px solid #d8d8d8" }}
            className="w-8 h-8 rounded-full  mr-4"
            src={
              User?.Profile?.profileImage ||
              `https://robohash.org/${User?.username}`
            }
            alt="Assistant's Profile Picture"
          />
          <div className="flex flex-col">
            <span className="font-sans text-sm font-medium">
              {User?.username}
            </span>
            <span className="text-xs text-gray-500">Client</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionsCard;
