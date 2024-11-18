import React, { useEffect, useState } from "react";
import {
  LoadingOutlined,
  SmileOutlined,
  SolutionOutlined,
  UserOutlined,
  CheckCircleFilled,
  CheckCircleOutlined,
  FileOutlined,
  FilePdfOutlined,
  CheckSquareOutlined,
  DollarCircleOutlined,
  // UserOutlined,
} from "@ant-design/icons";
import { Modal, Steps } from "antd";
import { Button, message, theme } from "antd";

import Password from "antd/es/input/Password";

import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

import api from "../../utils/api";
import { ClipLoader } from "react-spinners";
import { motion } from "framer-motion";
import AddSubscription from "./AddSubscription";
import SubscriptionProfile from "./SubscriptionProfile";
import CheckOutPage from "./CheckOutPage";
import { getProfileAsync } from "../auth/authReducer";
import { useSelector } from "react-redux";
const SubscriptionFlow = ({ collapsed, setCollapsed }) => {
  const { token } = theme.useToken();

  const [loading, setLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);

  const [current, setCurrent] = useState(0);
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
    resume: null,
    cv: null,
    position: "",
    location: "",
    desiredpay: 0,
    veteranStatus: "",
    disabilityStatus: "",
    ethnicity: "",
    jobType: "",
    preferredIndustry: "",
    workAuthorization: true,
    resumePreview: null,
    cvPreview: null,
  });
  // console.log(userData, "user data in main tree........");
  const next = async () => {
    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
  };

  const steps = [
    {
      title: "Choose tier",
      status: "finish",
      icon: <DollarCircleOutlined />,
      content: (
        <AddSubscription
          setSelectedSubscription={setSelectedSubscription}
          userData={userData}
          setUserData={setUserData}
          current={current}
          setCurrent={setCurrent}
          next={next}
          previous={prev}
          setShowLogin={setShowLogin}
          showLogin={showLogin}
        />
      ),
    },
    {
      title: "Job Profile",
      status: "finish",
      icon: <UserOutlined />,
      content: (
        <SubscriptionProfile
          userData={userData}
          setUserData={setUserData}
          next={next}
          previous={prev}
        />
      ),
    },
    {
      title: "Payment",
      status: "process",
      icon: <CheckCircleOutlined />,
      content: (
        <CheckOutPage
          selectedSubscription={selectedSubscription}
          userData={userData}
          setUserData={setUserData}
        />
      ),
    },
  ];
  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
    icon: item.icon,
  }));
  const contentStyle = {
    lineHeight: "260px",
    // textAlign: "center",
    // color: token.colorTextTertiary,
    // backgroundColor: token.colorFillAlter,
    // borderRadius: token.borderRadiusLG,
    // border: `1px dashed ${token.colorBorder}`,
    marginTop: 16,
  };
  useEffect(() => {
    window.scrollTo(0, 0);
    console.log(current, "currentvybuniom,p");
  }, [current]);
  useEffect(() => {
    console.log(userData, "user data////////////////");
  }, [userData]);
  return (
    <div
      className={`${
        collapsed ? "ml-[80px]" : "ml-[200px]"
      } mt- my-8 borde border-red-900 pb-8 pt-2 md:px-16 px-8 `}>
      {/* <Steps items={[]} /> */}
      <Steps
        className="borde borderre\"
        direction="horizontal"
        current={current}
        items={items}
      />
      <Modal
        open={showLogin}
        onCancel={() => setShowLogin(false)}
        footer={null}>
        <div>
          {/* <button className=" bg-[#168A53] hover:cursor-pointer px-5 w-80 justify-center py-2 flex items-center text-white rounded-full">
            Proceed to login
          </button> */}
          <div className="bg-white rounded-lg shadow-l p-6 w-full">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              🎉 Registration Complete!
            </h2>
            <p className="text-gray-600 mb-6">
              You have already successfully completed your registration. You can
              now proceed to log in to your account.
            </p>
            <a
              href="http://localhost:5174/login"
              target="_blank"
              onClick={() => setShowLogin(false)}
              className="w-full px-3 py- bg-green-500 
              hover:bg-green-600 text-white font-semibold py-2 rounded-lg shadow-md transition-all">
              Proceed to Login
            </a>
          </div>
        </div>
      </Modal>
      <div className="flex ">
        {current > 0 && (
          <div
            className=" border-[#168A53] hover:cursor-pointer border text-[#168A53] p-3 flex mr-4 items-center text- rounded-full"
            onClick={() => prev()}>
            <FaArrowLeft className="ml- borde lead border-red-900" />
          </div>
        )}{" "}
      </div>
      <div className=" ">{steps[current].content}</div>
      {/* <div className="flex items-center justify-center pt-5 border- border-green-900">
        {current === steps.length - 1 && (
          <div
            className=" bg-[#168A53] mr-4 hover:cursor-pointer px-5 w-80 justify-center py-2 flex items-center text-white rounded-full"
            onClick={() => {
              console.log(userData, "User data to be submitted...");
              handleSignup(userData);
            }}>
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
              <p className="borde border-red-900  px-2 py-2 leading-[0.5rem]">
                Done
              </p>
            )}
            <CheckCircleFilled className="ml- borde lead border-red-900" />
          </div>
        )}

        {current < steps.length - 1 && current != 0 && (
          <div
            className=" bg-[#168A53] hover:cursor-pointer px-5 w-80 justify-center py-2 flex items-center text-white rounded-full"
            onClick={() => next()}>
            <p className="borde border-red-900  px-2 py-2 leading-[0.5rem]">
              {current === 2 ? "Let's go" : "Next"}
            </p>
            <FaArrowRight className="ml- borde lead border-red-900" />
          </div>
        )}
      </div> */}
    </div>
  );
};

export default SubscriptionFlow;
