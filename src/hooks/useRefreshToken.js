import React from "react";
import api from "../utils/api";
import { useDispatch, useSelector } from "react-redux";
import { updateAccessToken } from "../views/auth/authReducer";
import axios from "axios";

const useRefreshToken = () => {
  const dispatch = useDispatch();
  // const [storedAccessToken, setStoredAccessToken] = useLocalStorage(
  //   "accessToken",
  //   ""
  // );

  // const accessToken = useLocalStorageGetter("accessToken");

  const refresh = async () => {
    try {
      const response = await api.get(
        // "https://server.appleazy.com/api/v1/refresh",
        "http://localhost:8001/api/v1/refresh",
        {
          withCredentials: true,
          credentials: "include",
        }
      );

      console.log(response?.data?.accessToken, "refresh response");
      // Assuming response.data contains the new access token
      dispatch(updateAccessToken(response?.data?.accessToken));
      return response?.data?.accessToken;
    } catch (error) {
      console.log("Error refreshing token:", error);
      // throw error; // Rethrow the error to handle it where useRefreshToken is called
    }
  };

  return refresh;
};

export default useRefreshToken;
