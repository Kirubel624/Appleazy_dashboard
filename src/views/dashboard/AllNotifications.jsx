import React, { useEffect, useState } from "react";
import NotificationCard from "../../components/common/NotificationCard";
import useAPIPrivate from "../../hooks/useAPIPrivate";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { IoCheckmarkDone } from "react-icons/io5";
import {
  getNotificationsAsync,
  updateNotificationQueryState,
  updateNotificationstate,
} from "./notificationReducer";
import { useSocket } from "../../hooks/useSocket";
const AllNotifications = ({ setViewSidebar }) => {
  // const [notifications, setNotifications] = useState();
  const apiPrivate = useAPIPrivate();
  const { user } = useSelector((state) => state.auth);
  // const [limit, setLimit] = useState(5);

  const { notificationQuery } = useSelector((state) => state.notifications);
  const dispatch = useDispatch();
  const notifications = useSocket(user?.id);
  const fetchNotifications = async () => {
    // await dispatch();
    // // updateNotificationQueryState({ startDate: null, endDate: null })

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

  const loadMore = async () => {
    await dispatch(
      updateNotificationQueryState({
        limit: Number(notificationQuery.limit) + 5,
      })
    );
    // setLimit(notificationQuery.limit + 5);
  };
  useEffect(() => {
    if (notificationQuery?.limit >= 5) {
      fetchNotifications();
      // setTransactions(payload);
    }
  }, [notificationQuery?.limit]);
  return (
    <div className=" ">
      <div className="flex items-center justify-between gap-4 mb-2">
        <h1 className="font-medium text-xl ">
          {/* {notificationQuery?.total}-{notificationQuery?.limit} */}
        </h1>
      </div>
      {/* <hr /> */}
      <div className="mt-2 grid grid-cols-1 gap-">
        {notifications?.length > 0 &&
          notifications?.map((notification) => (
            <NotificationCard
              {...notification}
              setViewSidebar={setViewSidebar}
            />
          ))}
      </div>
      {notificationQuery?.total > notificationQuery?.limit && (
        <button
          onClick={loadMore}
          className="text-[#168A53] mt-2 self-end w-full pr-2 text-end">
          Load more
        </button>
      )}
    </div>
  );
};

export default AllNotifications;
