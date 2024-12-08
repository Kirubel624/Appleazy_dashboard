import axios from "axios";
import TokenService from "./token.service";

import { message } from "antd";
// import { logout } from "../redux/auth/authSlice";

const handleErrorResponse = (errorMessage) => {
  message.error(errorMessage);
};

const instance = axios.create({
  baseURL: "https://server.appleazy.com/api/v1",
  // baseURL: "http://localhost:8001/api/v1",

  headers: {
    "Content-Type": "application/json",
  },
});
const api2 = axios.create({
  baseURL: "https://server.appleazy.com/api/v1",
  // baseURL: "http://localhost:8001/api/v1",

  headers: {
    "Content-Type": "application/json",
  },
});

let isreFrasing = false;
const errorInterceptor = (error) => {
  if (error.ressonse) {
    // The request was made, and the server responded with a status code
    // that falls out of the range of 2xx
    const { status } = error.response;

    if (status === 401) {
      // Handle unauthorized (maybe logout the user, refresh the token, etc.)
      message.error("Unauthorized: Please log in again.");
    } else if (status === 403) {
      message.error("Forbidden: You don't have permission to access this.");
    } else if (status === 500) {
      message.error("Internal Server Error");
    } else {
      // Handle other errors
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
        config.headers["Authorization"] = "Bearer " + token; // for Spring Boot back-end
        // config.headers["x-access-token"] = token; // for Node.js Express back-end
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
      config.headers["Authorization"] = "Bearer " + JSON.parse(token); // for Spring Boot back-end
      // config.headers["x-access-token"] = token; // for Node.js Express back-end
    }
    return config;
  }, errorInterceptor);

  const { dispatch } = store;

  // instance.interceptors.response.use(
  //   (res) => {
  //     isreFrasing = false;
  //     return res;
  //   },
  //   async (err) => {
  //     const originalConfig = err.config;

  //     console.log("ppppppppppppppp0000000pppp-----top", isreFrasing);

  //     if (originalConfig.url !== "/auth/signin" && err.response) {
  //       console.log("ppppppppppppppp0000000pppp", isreFrasing);

  //       if (err.response.status === 401 && !isreFrasing) {
  //         originalConfig._retry = true;
  //         isreFrasing = true;

  //         console.log("ppppppppppppppppppp", isreFrasing);

  //         try {
  //           const rs = await instance.post("/auth/refreshtoken", {
  //             refreshToken: TokenService.getLocalRefreshToken(),
  //           });

  //           const { accessToken, refreshToken } = rs.data;
  //           TokenService.updateLocalAccessToken(accessToken);
  //           TokenService.updateLOcalRefreshToken(refreshToken);

  //           return instance(originalConfig);
  //         } catch (_error) {
  //           TokenService.removeUser();
  //           // dispatch(logout())

  //           handleErrorResponse(err.response?.data?.message || err.message);

  //           return Promise.reject(_error);
  //         }
  //       } else {
  //         return handleErrorResponse(
  //           err.response?.data?.message || err.message
  //         );
  //       }
  //     } else if (
  //       err.response?.status !== 401 ||
  //       (originalConfig.url === "/auth/signin" && err.response)
  //     ) {
  //       return handleErrorResponse(err.response?.data?.message || err.message);
  //     }

  //     return Promise.reject(err);
  //   }
  // );
  // api2.interceptors.response.use(
  //   (res) => {
  //     isreFrasing = false;
  //     return res;
  //   },
  //   async (err) => {
  //     const originalConfig = err.config;

  //     console.log("ppppppppppppppp0000000pppp-----top", isreFrasing);

  //     if (originalConfig.url !== "/auth/signin" && err.response) {
  //       console.log("ppppppppppppppp0000000pppp", isreFrasing);

  //       if (err.response.status === 401 && !isreFrasing) {
  //         originalConfig._retry = true;
  //         isreFrasing = true;

  //         console.log("ppppppppppppppppppp", isreFrasing);

  //         try {
  //           const rs = await instance.post("/auth/refreshtoken", {
  //             refreshToken: TokenService.getLocalRefreshToken(),
  //           });

  //           const { accessToken, refreshToken } = rs.data;
  //           TokenService.updateLocalAccessToken(accessToken);
  //           TokenService.updateLOcalRefreshToken(refreshToken);

  //           return instance(originalConfig);
  //         } catch (_error) {
  //           TokenService.removeUser();
  //           // dispatch(logout())

  //           handleErrorResponse(err.response?.data?.message || err.message);

  //           return Promise.reject(_error);
  //         }
  //       } else {
  //         return handleErrorResponse(
  //           err.response?.data?.message || err.message
  //         );
  //       }
  //     } else if (
  //       err.response?.status !== 401 ||
  //       (originalConfig.url === "/auth/signin" && err.response)
  //     ) {
  //       return handleErrorResponse(err.response?.data?.message || err.message);
  //     }

  //     return Promise.reject(err);
  //   }
  // );
};
export default instance;
export { setup, api2 };
