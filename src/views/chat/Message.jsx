import { Avatar } from "antd";
import { formatDate } from "../../utils/dateFormatter";
import React from "react";

const Message = ({ chat }) => {
  console.log("chatach:::", chat);
  return (
    <div>
      <div className={`flex gap-4 items-center ${chat?.isMe && "justify-end"}`}>
        {(!chat?.isMe || chat?.isAdmin) && (
          <>
            {chat?.isAdmin ? (
              <>
                <div>
                  <Avatar size={30} style={{ backgroundColor: "#075985" }}>
                    admin
                  </Avatar>{" "}
                </div>
              </>
            ) : (
              <>
                <div>
                  <Avatar size={30} style={{ backgroundColor: "#14b8a6" }}>
                    {chat?.ChatFrom?.name[0]}
                  </Avatar>{" "}
                </div>
              </>
            )}
          </>
        )}
        <div className="my-4">
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
