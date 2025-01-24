import React, { useState } from "react";
import { Input, Button, message } from "antd";
import axios from "axios";
import { RiLockPasswordFill } from "react-icons/ri";
import { MdEmail } from "react-icons/md";
import { ClipLoader } from "react-spinners";
// import api from "../../utils/api";
import { useNavigate } from "react-router-dom";
import useAPIPrivate from "../../hooks/useAPIPrivate";
const ForgotPassword = () => {
  const api = useAPIPrivate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleRequestReset = async () => {
    setLoading(true);
    try {
      await api.post("/user/forgot-password", { email });
      message.success("Password reset link has been sent to your email.");
      setEmail(null);
      navigate("/login");
    } catch (error) {
      message.error("Failed to send reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <img
        width={108}
        height={108}
        className=" ml-6 mt-4"
        src="https://appleazy.nyc3.cdn.digitaloceanspaces.com/web-content/appleazy_inverted_logo_ky0kxg.png"
      />
      <div
        className="flex flex-col items-center justify-center
       h-screen bg--100  mx-[2rem]">
        <div
          className="bg-white border- p- rounded- flex flex-col items-center
         justify-center ">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Reset Your Password
          </h2>
          <div className="bg-[#8EFECA] inline-block p-5 mb-6 rounded-full">
            <MdEmail className="w-8 h-8 " />
          </div>
          <p className="text-gray-600 mb-4 text-center">
            Enter your email address and we’ll send you a link to reset your
            password.
          </p>
          <Input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4"
          />
          <button
            className="bg-[#168a53] w-full rounded py-2
            text-white font-medium border border-transparent hover:bg-white hover:border hover:border-[#168a53] hover:text-[#168a53] "
            block
            onClick={handleRequestReset}
            disabled={!email}>
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
              "Send Reset Link"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
