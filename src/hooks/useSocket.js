import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import {
  updateNotifications,
  updateNotificationstate,
} from "../views/dashboard/notificationReducer";

const SOCKET_URL = "http://localhost:8000";

export const useSocket = (userId) => {
  const dispatch = useDispatch();
  const { notifications } = useSelector((state) => state.notifications);
  const socket = io(SOCKET_URL);

  useEffect(() => {
    socket.on(`notification:${userId}`, async (notification) => {
      console.log(notification, "new notification in user id");

      await dispatch(updateNotifications(notification));
    });

    return () => {
      socket.disconnect();
      socket.off(`notification:${userId}`);
      socket.off(`notification:group:1984`);
    };
  }, [userId, socket]);

  return notifications;
};
