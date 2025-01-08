import { Input } from "antd";
import React, { useEffect, useState } from "react";
import { BsPlusCircle } from "react-icons/bs";
import SideBarCard from "./SideBarCard";
import useAPIPrivate from "../../hooks/useAPIPrivate";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { changeUserList } from "../../redux/chatReducer";

const SideBar = ({ socket, userId }) => {
  // const [userList, setUserList] = useState([]);

  const userList = useSelector((state) => state.chat?.userList);
  const [searchuserList, setsearchuserList] = useState([]);

  const api = useAPIPrivate();
  const navigate = useNavigate();
  const dipatch = useDispatch();

  useEffect(() => {
    const fectUserList = async () => {
      try {
        const res = await api.get(
          "http://localhost:5000/api/v1/group/admin-list"
        );
        console.log("list__11:", res.data);
        // setUserList(res.data?.chatList);
        dipatch(changeUserList({ userList: res.data }));
      } catch (error) {
        console.log(error);
      }
    };
    fectUserList();
  }, []);
  const search = (e) => {
    const searchTerm = e.target.value;

    if (!searchTerm.trim()) {
      setsearchuserList([]);
      return;
    }

    const val = userList.filter(
      (option) =>
        option.participant1name &&
        option.participant1name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setsearchuserList(val);
    return;
  };
  return (
    <div className="h-full flex flex-col p-4">
      <p className="">Appleazy Chat</p>
      <div className="search flex gap-3 mt-5 ">
        <Input onChange={(e) => search(e)} placeholder="Search" />
      </div>

      <div className=" flex-1   overflow-y-auto">
        {searchuserList.length == 0
          ? userList?.map((user) => (
              <SideBarCard socket={socket} key={user?.id} user={user} />
            ))
          : searchuserList?.map((user) => (
              <SideBarCard socket={socket} key={user?.id} user={user} />
            ))}
      </div>
    </div>
  );
};

export default SideBar;
