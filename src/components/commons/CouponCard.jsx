import React, { useState } from "react";
import { Button, message, Tag } from "antd";
import dayjs from "dayjs";
import { FaCopy } from "react-icons/fa";

const CouponCard = ({ coupon, setSelectedCoupon, setVisible, showConfirm }) => {
  const { code, jobLimit, expiryDate, createdAt } = coupon;
  const handleEdit = () => {
    setSelectedCoupon(coupon);
    setVisible(true);
  };
  const handleDelete = () => {
    showConfirm(coupon?.id);
  };
  const handleCopyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    message.success("Coupon code copied to clipboard!");
  };
  return (
    <div
      className="w-full max-w-[20rem] bg-white shadow-lg 
    rounded-lg border border-dashed border-gray-300
     overflow-hidden relative">
      <div className="absolute -left-3 top-1/2 transform -translate-y-1/2 h-6 w-6 bg-white border-2 border-gray-300 rounded-full"></div>
      <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 h-6 w-6 bg-white border-2 border-gray-300 rounded-full"></div>

      <div className="bg-[#168A53] px-4 py-3 text-center">
        <h3 className="text-lg font-bold text-white">Coupon Code</h3>

        <div className="flex items-center justify-center space-x-2 mt-2">
          <p className="text-sm font-sans bg-white font-medium px-3 py-1 rounded-md inline-block">
            {code}
          </p>
          <button
            className="text-white hover:border border border-transparent hover:border-white rounded-md p-2 transition"
            onClick={() => handleCopyToClipboard(code)}>
            <FaCopy className="text-" />
          </button>
        </div>
      </div>

      <div className="px-6 py-4 space-y-2">
        <p className="text-sm text-gray-600">
          <strong>Job Limit:</strong> {jobLimit}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Expiry Date:</strong>{" "}
          {expiryDate ? (
            <span className="text-gray-800">
              {dayjs(expiryDate).format("MMM DD, YYYY")}
            </span>
          ) : (
            <Tag color="gold">No Expiry</Tag>
          )}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Created At:</strong> {dayjs(createdAt).format("MMM DD, YYYY")}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Used:</strong> {"200 "}times
        </p>
      </div>

      <div className="border-t-2 border-dashed border-gray-300 mx-4"></div>

      <div className="px-4 py-3 space-x-4 flex justify-start items-center">
        <Button onClick={handleEdit} type="default" size="medium">
          Edit
        </Button>
        <Button onClick={handleDelete} type="default" danger size="medium">
          Delete
        </Button>
      </div>
    </div>
  );
};

export default CouponCard;
