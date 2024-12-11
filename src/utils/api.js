import axios from "axios";
// const accessToken = useLocalStorageGetter("auth");
const HOSTED_URL = "https://server.appleazy.com/api/v1";
const LOCAL_URL = "http://localhost:8001/api/v1";
const api = axios.create({
  baseURL: HOSTED_URL,
});
export const apiAuth = axios.create({
  // baseURL: "http://192.168.0.116:3000",
  baseURL: "http://196.189.126.183:3000/",
});
export const apiPrivate = axios.create({
  baseURL: HOSTED_URL,
  headers: {
    "Content-Type": "application/json",
    // Authorization: `Bearer ${accessToken}`,
  },
});

export default api;
