import { useDispatch, useSelector } from "react-redux";
import { updateAccessToken } from "../views/auth/authReducer";
import api from "../utils/api";

let refreshPromise = null;

const useRefreshToken = () => {
  const dispatch = useDispatch();
  const refreshToken = useSelector((state) => state.auth?.refreshToken);

  const refresh = async () => {
    if (!refreshToken) {
      console.error("No refresh token available");
      throw new Error("No refresh token available");
    }

    if (refreshPromise) {
      console.log("Refresh already in progress, waiting...");
      return refreshPromise;
    }

    console.log("Starting token refresh...");

    refreshPromise = new Promise(async (resolve, reject) => {
      try {
        const response = await api.get(
          // "https://server.applizy.com/api/v1/refresh",
          "http://localhost:8001/api/v1/refresh",
          {
            withCredentials: true,
            credentials: "include",
          }
        );

        const newAccessToken = response?.data?.accessToken;

        if (!newAccessToken) {
          console.error("Invalid refresh response", response);
          reject(new Error("Invalid refresh response"));
          return;
        }

        dispatch(updateAccessToken(newAccessToken));
        console.log("Access token refreshed successfully!");
        resolve(newAccessToken);
      } catch (error) {
        console.error("Error refreshing token:", error);
        reject(new Error("Failed to refresh token"));
      } finally {
        refreshPromise = null;
      }
    });

    return refreshPromise;
  };

  return refresh;
};

export default useRefreshToken;
