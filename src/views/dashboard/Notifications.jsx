import React, { useEffect, useState } from "react";
import NotificationCard from "../../components/common/NotificationCard";
import useAPIPrivate from "../../hooks/useAPIPrivate";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { IoCheckmarkDone } from "react-icons/io5";
import {
  getNotificationsAsync,
  markNotificationsAsReadAsync,
} from "./notificationReducer";
import { useSocket } from "../../hooks/useSocket";
import { message } from "antd";
const Notifications = ({ setViewSidebar }) => {
  // const [notifications, setNotifications] = useState();
  const apiPrivate = useAPIPrivate();
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const notifications = useSocket(user?.id);
  const fetchNotifications = async () => {
    try {
      console.log("inside fetch notificaitons");
      const { payload } = await dispatch(
        getNotificationsAsync({ id: user?.id })
      );
      console.log(payload, "repsonse of fetch notificaitons using redux");
      // const res = await axios.get(
      //   `http://localhost:8000/api/v1/notification/user/${user?.id}`
      // );
      // console.log("res of fetch notificaitons", res);
      // setNotifications(res?.data);
    } catch (error) {
      console.log(error, "erororroororooro");
    }
  };
  // useEffect(() => {
  //   fetchNotifications();
  // }, []);
  const handleMarkAllAsRead = async () => {
    try {
      const res = await dispatch(
        markNotificationsAsReadAsync({ id: user?.id })
      );
      console.log(res, "response of mark all notifications as read");

      if (res?.payload?.status === 404) {
        message.info("There are no unread notifications.");
      } else {
        fetchNotifications();
      }
    } catch (error) {
      console.log(error, "erorororororoor");
    }
  };

  return (
    <div className="borde border-red-900 max-w-[25rem] ">
      <div className="flex items-center justify-between gap-4 mb-2">
        <h1 className="font-medium text- ">Notifications</h1>
        <button className="flex items-center justify-between gap-1">
          <IoCheckmarkDone className="text-[#168A53]" />
          <button onClick={handleMarkAllAsRead} className="text-[#168A53]">
            Mark all as read
          </button>
        </button>
      </div>
      <hr />
      <div className="mt-2 grid grid-cols-1 gap-">
        {notifications?.length > 0 &&
          notifications?.map((notification) => (
            <NotificationCard
              {...notification}
              setViewSidebar={setViewSidebar}
            />
          ))}
      </div>
      <button
        onClick={() => setViewSidebar(true)}
        className="text-[#168A53] mt-2 self-end w-full pr-2 text-end">
        View all
      </button>
    </div>
  );
};

export default Notifications;
