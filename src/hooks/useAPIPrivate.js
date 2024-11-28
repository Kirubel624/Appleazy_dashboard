import { apiPrivate } from "../utils/api";
import { useEffect, useState } from "react";
import useRefreshToken from "./useRefreshToken";
// import { useAuth } from "../context/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import { message } from "antd";
// import useRefreshToken from "./useRefreshToken";
import {
  logOutAsync,
  logout,
  updateAccessToken,
} from "../views/auth/authReducer";
const useAPIPrivate = () => {
  // const { state } = useAuth();
  //change htis ot redux persisit token
  const refresh = useRefreshToken();

  const { isLoggedIn, user, accessToken } = useSelector((state) => state.auth);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [firstTime, setFirstTime] = useState(true);
  // const accessToken = user?.data?.token?.active;
  const dispatch = useDispatch();
  useEffect(() => {
    const requestInterceptor = apiPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          // console.log(accessToken, "old access token");

          config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => {
        Promise.reject(error);
      }
    );
    const responseIntercept = apiPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        console.log(error?.response?.status, "error status", firstTime);
        // alert(error?.response?.status);
        if (error?.response?.status === 403 && firstTime) {
          prevRequest.sent = true;
          setFirstTime(false);
          try {
            const newAccessToken = await refresh();
            // if (newAccessToken) {
            dispatch(updateAccessToken(newAccessToken));
            prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
            return apiPrivate(prevRequest);
            // } else {
            // throw new Error("Failed to refresh token");
            // }
          } catch (refreshError) {
            console.log(refreshError, "refresh error");
          }
        } else if (error?.response?.status === 403 && !firstTime) {
          // alert("Session expired. Please log in again.");
          setIsLoggingOut(true);
          // message.info("Session expired. Please log in again.-----");
          dispatch(logout());
          setTimeout(() => setIsLoggingOut(false), 1000);
        } else if (error?.response?.status === 401) {
          message.error("Unauthorized: Please log in again.", 2);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      apiPrivate.interceptors.request.eject(requestInterceptor);
      apiPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [isLoggedIn, refresh]);
  return apiPrivate;
};
export default useAPIPrivate;
