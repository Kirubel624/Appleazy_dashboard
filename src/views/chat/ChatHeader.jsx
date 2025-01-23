import { InfoOutlined, MoreOutlined } from "@ant-design/icons";
import { Avatar, Button } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const ChatHeader = () => {
  const userList = useSelector((state) => state.chat.userList);
  const { id } = useParams();
  const [headerUser, setheaderUser] = useState(null);

  useEffect(() => {
    if (userList?.length > 0) {
      const data = userList.find((user) => user.participant1 == id);
      setheaderUser(data);
      console.log("headerUser---------", userList, data);
    }
  }, [id, userList]);

  return (
    <div className="border-b py-6 px-9 flex items-baseline justify-between ">
      <div className="flex gap-6">
        <Avatar size={40} style={{ backgroundColor: "#14b8a6" }}>
          M
        </Avatar>
        <div>
          <p>{headerUser?.name}</p>
          {/* <p className="text-gray-400">last Message ... </p> */}
        </div>
      </div>
      <div className="flex gap-4">
        <Button
          style={{ backgroundColor: "#168A53", color: "white" }}
          shape="circle"
          icon={<InfoOutlined />}
        />

        <Button
          style={{ backgroundColor: "#168A53", color: "white" }}
          type="primary"
          shape="circle"
          icon={<MoreOutlined />}
        />
      </div>
    </div>
  );
};

export default ChatHeader;
