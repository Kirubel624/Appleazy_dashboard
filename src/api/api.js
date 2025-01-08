import axios from "axios";
import TokenService from "./token.service";

import { message } from "antd";
// import { logout } from "../redux/auth/authSlice";
const HOSTED_URL = "https://server.appleazy.com/api/v1";
// const HOSTED_URL = "http://localhost:8001/api/v1";
const handleErrorResponse = (errorMessage) => {
  message.error(errorMessage);
};

const instance = axios.create({
  baseURL: HOSTED_URL,
  // baseURL: "http://localhost:8001/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});
const api2 = axios.create({
  baseURL: HOSTED_URL,

  headers: {
    "Content-Type": "application/json",
  },
});

let isreFrasing = false;
const errorInterceptor = (error) => {
  if (error.ressonse) {
    const { status } = error.response;

    if (status === 401) {
      message.error("Unauthorized: Please log in again.");
    } else if (status === 403) {
      message.error("Forbidden: You don't have permission to access this.");
    } else if (status === 500) {
      message.error("Internal Server Error");
    } else {
      console.log(error, "error message//////////////////");
      message.info(`${error?.response?.data?.message}`);
    }
  } else if (error.request) {
    message.error("Network Error: No response received from the server.");
  } else {
    message.error("Error in setting up request:", error.message);
  }

  return Promise.reject(error);
};
const setup = (store) => {
  instance.interceptors.request.use(
    (config) => {
      const token = TokenService.getLocalAccessToken();
      if (token) {
        config.headers["Authorization"] = "Bearer " + token;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  api2.interceptors.request.use((config) => {
    const token = JSON.parse(localStorage.getItem("persist:auth"))?.accessToken;
    console.log("token:", JSON.parse(token));
    if (token) {
      config.headers["Authorization"] = "Bearer " + JSON.parse(token);
    }
    return config;
  }, errorInterceptor);
};
export default instance;
export { setup, api2 };
