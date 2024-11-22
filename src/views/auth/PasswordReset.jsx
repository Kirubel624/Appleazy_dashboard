import React, { useState } from "react";
import { Input, Button, message } from "antd";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { RiLockPasswordFill } from "react-icons/ri";
import useAPIPrivate from "../../hooks/useAPIPrivate";
// import api from "../../utils/api";

const PasswordReset = () => {
  const api = useAPIPrivate();

  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    setLoading(true);
    if (password !== confirmPassword) {
      setLoading(false);
      return message.error("Passwords do not match");
    }
    try {
      await api.post("/user/reset-password", { token, newPassword: password });
      message.success(
        "Password reset successful! You can now log in with your new password."
      );
      navigate("/login");
      setPassword(null);
      setConfirmPassword(null);
    } catch (error) {
      // message.error("Failed to reset password. Please try again.");
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
        src="https://res.cloudinary.com/dtwmhl1oh/image/upload/v1729859428/appleazy_inverted_logo_ky0kxg.png"
      />
      <div className="flex flex-col items-center justify-center h-screen bg-ray-100 mx-[2rem]">
        <div
          className="bg-white  
        flex flex-col items-center justify-center w-full max-w-lg"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">
            Set New Password
          </h2>
          <div className="bg-[#8EFECA] inline-block p-5 mb-6 rounded-full">
            <RiLockPasswordFill className="w-8 h-8" />
          </div>
          <Input.Password
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4 w-full"
          />
          <Input.Password
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mb-4 w-full"
          />
          <button
            className="bg-[#168a53] w-full rounded py-2
      text-white font-medium border border-transparent hover:bg-white hover:border hover:border-[#168a53] hover:text-[#168a53]"
            onClick={handleResetPassword}
            disabled={!password || !confirmPassword}
          >
            {loading ? (
              <ClipLoader
                color="#FFFFFF"
                loading={loading}
                size={20}
                aria-label="Loading Spinner"
              />
            ) : (
              "Reset Password"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;
