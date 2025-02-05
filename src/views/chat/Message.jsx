import { Avatar } from "antd";
import { formatDate } from "../../utils/dateFormatter";
import React from "react";

const Message = ({ chat }) => {
  console.log("chatach:::", chat);
  return (
    <div>
      <div className={`flex gap-4 items-center ${chat?.isMe && "justify-end"}`}>
        <div className="my-4">
          <>
            {chat?.isAdmin ? (
              <>
                <div className="flex gap-2 mb-1">
                  <Avatar size={20} style={{ backgroundColor: "#075985" }}>
                    N
                  </Avatar>{" "}
                  <p> Natnael (Founder)</p>
                </div>
              </>
            ) : (
              <>
                <div className="flex gap-2 mb-1">
                  <Avatar size={20} style={{ backgroundColor: "#168A53" }}>
                    {chat?.ChatFrom?.name[0]}
                  </Avatar>{" "}
                  <p>{chat?.ChatFrom?.name}</p>
                </div>
              </>
            )}
          </>
          <p
            className={`border max-w-[400px] mb-2  border-[#168A53]  px-4 py-2 rounded-xl ${
              chat?.isAdmin
                ? "bg-[#075985] text-white"
                : chat?.isMe
                ? "bg-[#168A53] text-white"
                : "text-[#168A53]"
            }`}
          >
            {chat.message}
          </p>
          <div
            className={`${chat?.isMe && !chat?.isAdmin && "flex justify-end"} `}
          >
            <p>{formatDate(chat?.createdAt)}</p>
          </div>{" "}
        </div>
      </div>
    </div>
  );
};

export default Message;
