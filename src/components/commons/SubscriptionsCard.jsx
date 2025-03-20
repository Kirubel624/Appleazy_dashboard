import React, { useState } from "react";
import { FaCheckCircle, FaChevronDown, FaChevronUp } from "react-icons/fa";
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
}) => {
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className="md:max-w-md p-6 rounded-lg shadow
     bg-white border border-gray-200">
      {/* Tier and Type */}
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
      {/* Features List */}
      {/* Collapsible Features List */}
      <div className="mb-6">
        <button
          onClick={toggleExpand}
          className="flex items-center justify-between w-full text-left focus:outline-none">
          <span className="text-lg font-medium text-gray-900">Features</span>
          {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
        </button>

        {/* Collapsible List */}
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

      {/* Footer */}
      <div className="border-b pb-4 mb-4 text-center">
        <p className="text-sm text-gray-500">
          There are {jobsRemaining} applications remaining in this subscription.
        </p>
      </div>
      <div className="flex justify-en space-x-4 mt-4">
        {/* View Jobs Button */}
        <button
          onClick={() => {
            setAssignModal(true);
            setSelectedJob(data);
          }}
          className="bg-[#168A53] text-white px-4 py-2 
           hover:bg-[#168A53] transition">
          Assign
        </button>

        {/* Manage Subscription Button */}
        {/* <button
          // onClick={handleManageSubscription}
          className="bg-white text-[#168A53] border border-[#168A53] px-4 py-2  hover:bg-gray-600 transition">
          Manage
        </button> */}
      </div>
    </div>
  );
};

export default SubscriptionsCard;
