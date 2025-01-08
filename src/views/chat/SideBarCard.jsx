import { Avatar } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const SideBarCard = ({ user, socket }) => {
  const navigate = useNavigate();
  const { user: currentUser } = useSelector((state) => state.auth);
  const { id } = useParams();
  // console.log("CurrentUser:::", currentUser);
  return (
    <div
      onClick={() => {
        navigate("/chat/" + user?.participant1 + "/" + user?.participant2);
        const sortedIds = [user?.participant1, user?.participant2].sort();
        console.log("sortedIds", sortedIds.join(""));
        socket.emit("joinRoom", sortedIds.join(""));
      }}
      className={`shadow max-w-[300px] p-3 my-4 cursor-pointer rounded-lg hover:bg-[#23925e] ${
        id == user?.participant1 ? "bg-[#168A53] text-white" : ""
      } `}
    >
      <div className="flex gap-4">
        <div>
          <Avatar size={40} style={{ backgroundColor: "#14b8a6" }}>
            {user?.name[0]}
          </Avatar>
        </div>
        <div>
          <p> {user?.name}</p>
          {/* <p className="text-gray-400">
            {user?.lastMessage?.substring(0, 25)}
            {user?.lastMessage?.length > 25 ? "..." : ""}
          </p> */}
        </div>
      </div>
    </div>
  );
};

export default SideBarCard;
