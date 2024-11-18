import React, { useEffect, useState } from "react";
import { Input, Button, Switch, Select, Slider, message } from "antd";
import { FaCcVisa, FaCheckCircle } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import api from "../../utils/api";
import { ClipLoader } from "react-spinners";
import { motion } from "framer-motion";
import { createSubscriptionAsync } from "./subscriptionReducer";
import useAPIPrivate from "../../hooks/useAPIPrivate";

const CheckOutPage = ({
  collapsed,
  setCollapsed,
  userData,
  setUserData,
  selectedSubscription,
}) => {
  const navigate = useNavigate();
  const [selectedNumberOfJobs, setSelectedNumberOfJobs] = useState(1); // Set the minimum amount as default
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const apiPrivate = useAPIPrivate();
  // Handle slider change
  const handleSliderChange = (value) => {
    setSelectedNumberOfJobs(value);
  };
  const handleSubscription = async () => {
    setLoading(true);
    let data;

    if (selectedSubscription?.isFixed) {
      console.log("inside is diexs");
      data = {
        userId: selectedSubscription?.userId,
        subscriptionPricingId: selectedSubscription?.subscriptionPricingId,
        jobLimit: Number(selectedSubscription?.jobLimit),
        expiryDate: new Date(new Date().setMonth(new Date().getMonth() + 3)),
        userData,
      };
      const formData = new FormData();
      formData.set("userId", selectedSubscription?.userId);
      formData.set(
        "subscriptionPricingId",
        selectedSubscription?.subscriptionPricingId
      );
      formData.set("jobLimit", Number(selectedSubscription?.jobLimit));
      formData.set(
        "expiryDate",
        new Date(new Date().setMonth(new Date().getMonth() + 3))
      );

      formData.set("disabilityStatus", userData.disabilityStatus);
      formData.set("veteranStatus", userData.veteranStatus);

      formData.set("email", userData.email);
      formData.set("ethnicity", userData.ethnicity);
      formData.set("jobType", userData.jobType);
      formData.set("location", userData.location);
      formData.set("password", userData.password);
      formData.set("desiredpay", userData.desiredpay);
      formData.set("position", userData.position);
      formData.set("preferredIndustry", userData.preferredIndustry);
      formData.set("username", userData.username);
      formData.set("workAuthorization", userData.workAuthorization);
      if (userData?.resume) {
        formData.append("resume", userData?.resume);
      }

      if (userData?.cv) {
        formData.append("cv", userData?.cv);
      }

      console.log(data, "data to be sent in fixed");
      // const res = await api.post("/subscription", formData);
      const { payload } = await dispatch(
        createSubscriptionAsync({ data: formData, apiPrivate })
      );
      console.log(payload, "response data to be sent in fixed");
      if (payload?.status === 201) {
        message.success("Subscription successful");
        navigate("/");
      } else {
        message.error("An error occurred. Please try again");
      }
    } else {
      data = {
        userId: selectedSubscription?.userId,
        subscriptionPricingId: selectedSubscription?.subscriptionPricingId,
        jobLimit: selectedNumberOfJobs,
        expiryDate: new Date(new Date().setMonth(new Date().getMonth() + 3)),
        userData,
      };
      console.log(data, "data to be sent in variable");
      const formData = new FormData();
      formData.set("userId", selectedSubscription?.userId);
      formData.set(
        "subscriptionPricingId",
        selectedSubscription?.subscriptionPricingId
      );
      formData.set("jobLimit", selectedNumberOfJobs);
      formData.set(
        "expiryDate",
        new Date(new Date().setMonth(new Date().getMonth() + 3))
      );

      formData.set("disabilityStatus", userData.disabilityStatus);
      formData.set("veteranStatus", userData.veteranStatus);

      formData.set("email", userData.email);
      formData.set("ethnicity", userData.ethnicity);
      formData.set("jobType", userData.jobType);
      formData.set("location", userData.location);
      formData.set("password", userData.password);
      formData.set("desiredpay", userData.desiredpay);
      formData.set("position", userData.position);
      formData.set("preferredIndustry", userData.preferredIndustry);
      formData.set("username", userData.username);
      formData.set("workAuthorization", userData.workAuthorization);
      if (userData?.resume) {
        formData.append("resume", userData?.resume);
      }

      if (userData?.cv) {
        formData.append("cv", userData?.cv);
      }
      try {
        const { payload } = await dispatch(
          createSubscriptionAsync({ data: formData, apiPrivate })
        );
        console.log(payload, "response data to be sent in fixed");
        if (payload?.status === 201) {
          message.success("Subscription successful");
          navigate("/");
        }
      } catch (error) {
        message.error("An error occurred. Please try again");
        console.log(error, "error");
      } finally {
        setLoading(false);
      }
    }
  };
  useEffect(() => {
    console.log(
      selectedSubscription,
      "selectedSubscription? of selected subscription"
    );
  }, []);
  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{
        duration: 0.6, // Adjust duration to control the speed of the animation
        ease: [0.6, 0.01, -0.05, 0.95], // Custom easing for a smoother effect
        type: "spring", // Adds a spring-like bounce
        stiffness: 100, // Controls the "bounciness" of the spring
      }}>
      <div className="min- mt-4 bg-gray-100 flex justify-center items-center">
        <div className="bg-white shadow-lg rounded-lg w-full max-w-5xl grid grid-cols-1 md:grid-cols-2">
          {/* Left Side: Plan Summary */}
          <div className="p-8 bg-[#168A53] text-white rounded-l-lg">
            <button className="text-lg mb-">Total:</button>
            <h2 className="text-4xl font-semibold mb-4">
              {!selectedSubscription?.isFixed
                ? `US$ ${(
                    Number(selectedNumberOfJobs) *
                    Number(selectedSubscription?.amount)
                  ).toFixed(2)}`
                : `US$ ${Number(selectedSubscription?.amount).toFixed(2)}`}
            </h2>

            <ul className="mb-6">
              {selectedSubscription?.subInfo?.features.map((feature, index) => (
                <li key={index} className="flex items-center mb-2">
                  <FaCheckCircle className="text-white mr-2" />
                  <span className="text-white0">{feature}</span>
                </li>
              ))}
            </ul>

            {/* Plan Toggle */}

            {/* Slider for Custom Amount */}
            {!selectedSubscription?.isFixed && (
              <div className="mt-6">
                <p className="text-xl  font-semibold mb-2">
                  Choose your custom number of jobs max(75):
                </p>
                <Slider
                  min={1}
                  max={75}
                  step={1}
                  value={selectedNumberOfJobs}
                  onChange={handleSliderChange}
                  open={false} // Hide default tooltip
                />
                <div className="flex justify-between text-sm mt-2">
                  <p>Min: 1 job</p>
                  <p>Max: 75 jobs</p>
                </div>
              </div>
            )}

            {/* Subtotal */}
            <div className="mt-6">
              <div className="mt-4 flex justify-between text-lg font-bold">
                <p>Total Number of jobs: </p>
                <p>
                  {!selectedSubscription?.isFixed
                    ? selectedNumberOfJobs
                    : selectedSubscription?.jobLimit}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-10 text-xs text-white">
              <p>APPLEAZY ©2024 All rights reserved</p>
              <div className="flex mt-1">
                <p className="mr-2 cursor-pointer underline">Terms</p>
                <p className="cursor-pointer underline">Privacy</p>
              </div>
            </div>
          </div>

          {/* Right Side: Payment Form */}
          <div className="p-8 bg-white rounded-r-lg">
            <h2 className="text-2xl mb-6">Pay With Card</h2>

            {/* Email */}
            <Input placeholder="Email" className="mb-4" size="large" />

            {/* Name on Card */}
            <Input placeholder="Name on card" className="mb-4" size="large" />

            {/* Card Details */}
            <div className="mb-4 flex space-x-2">
              <Input
                placeholder="Card Number"
                size="large"
                className="w-2/3"
                suffix={<FaCcVisa size={24} />}
              />
              <Input placeholder="MM/YY" size="large" className="w-1/3" />
              <Input placeholder="CVC" size="large" className="w-1/3" />
            </div>

            {/* Billing Address */}
            <div className="mb-4">
              <Select defaultValue="Israel" className="w-full" size="large">
                <Option value="Israel">Israel</Option>
                <Option value="USA">USA</Option>
                <Option value="Canada">Canada</Option>
              </Select>
              <Input placeholder="Address" size="large" className="mt-4" />
            </div>

            {/* One-Click Checkout */}
            <div className="mb-4 flex items-center space-x-2">
              <input type="checkbox" id="saveInfo" className="cursor-pointer" />
              <label htmlFor="saveInfo" className="text-sm">
                Securely save my information for 1-click checkout
              </label>
            </div>

            <button
              onClick={handleSubscription}
              type="submit"
              className="w-full bg-[#168a53] py-2 px-2 hover:bg-[#267c54] text-white rounded">
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
                "Subscribe"
              )}
            </button>

            {/* Footer Text */}
            <p className="mt-4 text-xs text-gray-500">
              By confirming your subscription, you allow us to charge your card
              for this and future payments in accordance with our terms.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CheckOutPage;
