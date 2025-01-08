import React, { useEffect } from "react";
import ChatHeader from "./ChatHeader";
import ChatBody from "./ChatBody";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "axios";
import { changeChats } from "../../redux/chatReducer";

const BoddyCon = () => {
  const chats = useSelector((state) => state.chat.chats);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const { id, to } = useParams();
  useEffect(() => {
    if (user) {
      const fectUserList = async () => {
        try {
          const res = await axios.get(
            "http://localhost:5000/api/v1/group/chats/" + to + "/" + id
          );
          console.log("listchat__", res.data?.chats);
          dispatch(changeChats({ chats: res.data?.chats }));
        } catch (error) {
          console.log(error);
        }
      };
      fectUserList();
    }
  }, [user, id]);
  return (
    <div className=" flex-1 mr-5 ml-3 py-10  ">
      <div className="border flex flex-col   bg-white h-full rounded-2xl ">
        <ChatHeader />
        <ChatBody />
      </div>
    </div>
  );
};

export default BoddyCon;
