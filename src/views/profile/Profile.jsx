import React, { useState } from "react";
import { Avatar, Checkbox, Input, Modal } from "antd";
import ProfileField from "../../components/common/ProfileField";
import { useDispatch, useSelector } from "react-redux";
import { FaFileAlt } from "react-icons/fa";
import EditProfile from "./EditProfile";
import { getProfileAsync } from "../auth/authReducer";
const Profile = ({ collapsed, setCollapsed }) => {
  const { user, profile } = useSelector((state) => state.auth);
  const [edit, setEdit] = useState(false);
  const dispatch = useDispatch();
  const optionsVeteran = [
    {
      label: "Yes",
      value: true,
    },
    {
      label: "No",
      value: false,
    },
    {
      label: "Prefer not to disclose",
      value: "",
    },
  ];
  const getVeteranStatusLabel = (value) => {
    console.log(value, "value...");
    const option = optionsVeteran.find((opt) => opt.value === value);
    return option ? option.label : "Prefer not to disclose"; // Default fallback
  };
  const optionsDisability = [
    {
      label: "Yes",
      value: true,
    },
    {
      label: "No",
      value: false,
    },
    {
      label: "Prefer not to disclose",
      value: "",
    },
  ];
  const options = [
    { label: "Part-time", value: "Part-time" },
    { label: "Full-time", value: "Full-time" },
    { label: "Contract", value: "Contract" },
  ];
  const fetchProfile = async () => {
    const res = await dispatch(getProfileAsync(user?.id));
    console.log(res, "response of fetch profiel");
  };
  return (
    <div
      className={`${
        collapsed ? "ml-[80px]" : "ml-[200px] bg-white h-screen px-12 pt-8"
      } border- border-red-900 transition-all ease-in`}>
      <Modal
        title="Edit profile"
        width={800}
        open={edit}
        onCancel={() => setEdit(false)}
        footer={null}>
        <EditProfile
          profile={profile}
          setEdit={setEdit}
          fetchProfile={fetchProfile}
        />
      </Modal>
      <div className=" flex items-center justify-between">
        <div className="flex items-center">
          <Avatar
            size={96}
            className="border-[1px] border-gray-300"
            src={
              profile?.profileImage ||
              `https://robohash.org/${profile?.username}`
            }
          />
          <div className="ml-5">
            <h1 className="font-medium text-lg font-sans">
              {profile?.username}
            </h1>
            <p className="text-sm text-gray-500">{profile?.user?.email}</p>
          </div>
        </div>
        <div>
          <button
            onClick={() => setEdit(true)}
            className="bg-[#168A53] text-white px-6 py-2 rounded">
            Edit
          </button>
        </div>
      </div>
      <div className="my-8 font-roboto flex flex-col gap-y-5  ">
        <div className="flex items-center justify-between">
          <label className="flex flex-col w-1/3">
            Username
            <input
              value={profile?.username}
              className=" bg-[#F9F9F9] mt-2 h-10 px-3"
              placeholder="Username"
            />
          </label>
          <label className="flex flex-col  w-1/3 mx-8">
            Location
            <input
              value={profile?.location}
              className=" bg-[#F9F9F9] mt-2 h-10 px-3"
              placeholder="Location"
            />
          </label>
          <label className="flex flex-col  w-1/3">
            Position
            <input
              value={profile?.position}
              className=" bg-[#F9F9F9] mt-2 h-10 px-3"
              placeholder="Position"
            />
          </label>
        </div>
        <div className="flex items-center justify-between">
          <label className="flex flex-col w-1/3">
            Desired pay
            <input
              value={profile?.desiredpay}
              className=" bg-[#F9F9F9] mt-2 h-10 px-3"
              placeholder="Desired pay"
            />
          </label>
          <label className="flex flex-col  w-1/3 mx-8">
            Ethnicity
            <input
              value={profile?.ethnicity}
              className=" bg-[#F9F9F9] mt-2 h-10 px-3"
              placeholder="Ethnicity"
            />
          </label>
          <label className="flex flex-col  w-1/3">
            Preferred industry
            <input
              value={profile?.preferredIndustry}
              className=" bg-[#F9F9F9] mt-2 h-10 px-3"
              placeholder="Preferrred industry"
            />
          </label>
        </div>
        <div className="flex items-center justify-between">
          <label className="flex flex-col w-1/3">
            Veteran
            <input
              value={getVeteranStatusLabel(JSON.parse(profile?.veteranStatus))}
              className=" bg-[#F9F9F9] mt-2 h-10 px-3"
              placeholder="Username"
            />
          </label>
          <label className="flex flex-col  w-1/3 mx-8">
            Disability
            <input
              value={getVeteranStatusLabel(
                JSON.parse(profile?.disabilityStatus)
              )}
              className=" bg-[#F9F9F9] mt-2 h-10 px-3"
              placeholder="Username"
            />
          </label>
          <label className="flex flex-col  w-1/3">
            Work authorization
            <input
              value={getVeteranStatusLabel(
                JSON.parse(profile?.workAuthorization)
              )}
              className=" bg-[#F9F9F9] mt-2 h-10 px-3"
              placeholder="Username"
            />
          </label>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className=" w-1/3">
          <h1 className=" font-roboto">Resume</h1>
          <div className="flex items-center mt-2">
            <div className="bg-[#c9ffe7] p-3 rounded-full">
              <FaFileAlt className="w-4 h-4 text-[#168A53]" />
            </div>
            <div>
              <a
                href={profile?.resume}
                target="_blank"
                className="underline text-blue-500 ml-2">
                Resume
              </a>
            </div>
          </div>
        </div>
        <div className=" w-1/3  mx-8">
          <h1 className=" font-roboto">CV</h1>
          <div className="flex items-center mt-2">
            <div className="bg-[#c9ffe7] p-3 rounded-full">
              <FaFileAlt className="w-4 h-4 text-[#168A53]" />
            </div>
            <div>
              <a
                href={profile?.cv}
                target="_blank"
                className="underline text-blue-500 ml-2">
                CV
              </a>
            </div>
          </div>
        </div>
        <div className=" w-1/3">
          <label className="flex flex-col ">
            Job type
            <Checkbox.Group
              options={options}
              value={profile?.jobType.split(",")}
              // onChange={handleJobTypeChange}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default Profile;
