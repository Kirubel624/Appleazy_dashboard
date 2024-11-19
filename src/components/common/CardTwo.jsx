import React, { useEffect, useState } from "react";
import { FaUserCircle, FaCalendarAlt } from "react-icons/fa";
import ReactTimeAgo from "react-time-ago";

import { Avatar, Rate } from "antd";
import { useNavigate } from "react-router-dom";
const Card = ({
  data,
  createdAt,
  applications,
  daysRemaining,
  gainPercentage,
  clientName,
  clientProfile,
}) => {
  const navigate = useNavigate();
  return (
    <div
      className={` p-3   w-[18rem] sm:w-[350px] bg-white mx-5 my-8 rounded shadow-2xl`}
    >
      {/* <div className="mb-5">
        <h3 className="text-xl font-bold text-gray-900 mb-1">
          Job Application
        </h3>
        <p className="text-gray-500 text-sm">
          Applied{" "}
          <ReactTimeAgo date={date} locale="en-US" className="text-gray-500" />{" "}
        </p>
      </div> */}
      {/* Applications and Gain Percentage */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col">
          <p className="text-lg font-semibold text-gray-900">
            {data?.applicationsTotal} Job Applications
          </p>
          <p className="text-gray-600 font-medium text-sm">
            Gain: {data?.applicationsTotal * 50} Birr
          </p>
        </div>
      </div>
      <div className="flex items-center mb-4">
        {" "}
        <FaCalendarAlt className="text-[#168A53] mr-2" size={20} />
        <p className="text-gray-700 text-sm">
          Complete within {Math.ceil(data?.remainingApplications / 12)} days
        </p>
      </div>
      {/* Client Information */}
      <div className="flex items-center mb-4">
        <Avatar
          // size={40}
          src={clientProfile}
          alt={data?.User?.username}
          className="mr-2"
        >
          {data?.client?.username}
        </Avatar>
        <div>
          <p className="text-gray-900 font-semibold text-g">
            {data?.client?.username}
          </p>
          {/* <Rate
            style={{ color: "#168A53", fontSize: "15px" }}
            allowHalf
            disabled
            defaultValue={4.5}
          /> */}
        </div>
      </div>
      <div className="mt-4 flex  flex-wrap justify-between gap-5">
        <button className="bg-sky-600 text-white py-1 px-5 rounded">
          More
        </button>
        <button
          onClick={() => {
            navigate("/jobs/" + data?.subscriptionId + "/" + data?.clientId);
          }}
          className="bg-slate-800 text-white py-1 px-5 rounded"
        >
          Dashboard
        </button>
        <button className="bg-[#168A53] text-white py-1 px-5 rounded">
          Chat
        </button>
      </div>
    </div>
  );
};

export default Card;
