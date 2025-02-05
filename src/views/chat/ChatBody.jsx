import React, { useEffect, useRef, useState } from "react";
import Message from "./Message";
import { Button, Input, message } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { IoIosAttach } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { addChat, changeUserList } from "../../redux/chatReducer";
import { isMap } from "lodash";
import { useParams } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";

const ChatBody = () => {
  const chats = useSelector((state) => state.chat.chats);
  const userList = useSelector((state) => state.chat.userList);
  const socket = useSelector((state) => state.socket.socket);

  console.log("chats___:", chats);
  console.log("userList__:", userList);

  const dispatch = useDispatch();
  const [input, setInput] = useState("");
  const endRef = useRef(null);
  const { id, to } = useParams();
  const { user } = useSelector((state) => state.auth);
  // const [socket, setSocket] = useState(null);

  // useEffect(() => {
  //   if (!user?.id) return;

  //   const newSocket = io("https://chat.appleazy.com", {
  //     query: { userId: user?.id },
  //     transports: ["websocket"],
  //     reconnection: true,
  //   });

  //   newSocket.on("connect", () => {
  //     console.log(
  //       "Connected to the server with socket ID22222222:",
  //       newSocket.id
  //     );
  //   });

  //   newSocket.on("connect_error", (error) => {
  //     console.error("Connection error:", error.message);
  //   });

  //   setSocket(newSocket);

  //   // Cleanup on unmount
  //   return () => {
  //     newSocket.disconnect();
  //   };
  // }, [user?.id]);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);
  return (
    <div className="flex-1 max-h-full overflow-y-auto flex flex-col py-2 px-6">
      <div className="flex-1 max-h-full overflow-y-auto">
        {chats?.map((chat) => (
          <Message chat={chat} />
        ))}
        {/* {Array(8)
          .fill(2)
          .map((x, i) => {
            if (i % 2 == 0) {
              return <Message />;
            } else {
              return <Message isMe={true} />;
            }
          })} */}
        <div ref={endRef}></div>
      </div>
      <div className="h-20">
        <div className="border rounded-lg flex items-center justify-between">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="py-4 outline-none flex-1 rounded-lg  px-3"
            placeholder="Write a message here"
          />
          <div className="flex gap-2 items-center">
            <Button
              onClick={async (e) => {
                e.preventDefault();

                try {
                  const res = await axios.post(
                    "https://chat.appleazy.com/api/v1/group/add-chat/",
                    { to: id, from: to, message: input, isAdmin: true }
                  );

                  const sortedIds = [to, id].sort();
                  const ides = sortedIds.join("");
                  dispatch(
                    addChat({
                      message: input,
                      isMe: false,
                      createdAt: new Date(),
                      isAdmin: true,
                    })
                  );
                  // const userListW = userList?.filter(
                  //   (user2) => user2?.id == id
                  // );
                  // const userList1 = userList?.filter(
                  //   (user2) => user2?.id != id
                  // );
                  // console.log("[[[[[[[[[[[[", userList1, userListW);
                  // dispatch(
                  //   changeUserList({ userList: [...userListW, ...userList1] })
                  // );
                  socket.emit("groupChatMessage", {
                    msg: input,
                    room: ides,
                  });

                  setInput("");

                  console.log("list__", res);
                } catch (error) {
                  console.log(error);
                }
              }}
              style={{ backgroundColor: "#168A53" }}
              className="bg-[#168A53] rounded-lg flex justify-center items-center py-2 px-3 ">
              <SendOutlined style={{ fontSize: 20, color: "white" }} />
            </Button>
            <button className="rounded-lg flex justify-center items-center py-2 px-3 ">
              <IoIosAttach size={25} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBody;
