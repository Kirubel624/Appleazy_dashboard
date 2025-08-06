import React, { useEffect, useState } from "react";
import SideBar from "./SideBar";
import ChatHeader from "./ChatHeader";
import ChatBody from "./ChatBody";
import { io } from "socket.io-client";
import { Outlet, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addChat } from "../../redux/chatReducer";
import { changeSocket } from "../../redux/socketReducer";

const ChatLayout = ({ collapsed, userId }) => {
  const [socket, setSocket] = useState(null);
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    if (!userId) return;

    const newSocket = io("https://chat.applizy.com", {
      query: { userId },
      transports: ["websocket"],
      reconnection: true,
    });

    newSocket.on("groupMessage", (message) => {
      console.log("Connected to the server with socket ID----------:", message);
      dispatch(
        addChat({
          message: message?.message,
          isMe: false,
          createdAt: new Date(),
          ChatFrom: message?.user,
        })
      );
    });
    newSocket.on("connect", () => {
      console.log("Connected to the server with socket ID:", newSocket.id);
    });

    newSocket.on("connect_error", (error) => {
      console.error("Connection error:", error?.message);
      dispatch(addChat(message?.msg));
    });

    setSocket(newSocket);
    dispatch(changeSocket({ socket: newSocket }));

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, [userId]);

  return (
    <div
      className={`${
        collapsed ? "ml-[0px] sm:[0px]" : "ml-[200px] "
      }    transition-all h-[100vh] ease-in  px-3`}
    >
      <div className="flex h-full ">
        <div
          className={` ${
            id ? "md:block hidden" : ""
          }  w-full md:max-w-[300px]   md:ml-5 py-10 h-full `}
        >
          {" "}
          <div className="border h-full  bg-white rounded-2xl ">
            <SideBar socket={socket} userId={userId} />
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default ChatLayout;
