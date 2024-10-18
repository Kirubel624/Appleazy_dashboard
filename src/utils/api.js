import axios from "axios";
// const accessToken = useLocalStorageGetter("auth");

const api = axios.create({
  baseURL: "http://localhost:8000",
});
export const apiAuth = axios.create({
  // baseURL: "http://192.168.0.116:3000",
  baseURL: "http://196.189.126.183:3000/",
});
export const apiPrivate = axios.create({
  baseURL: "http://192.168.0.116:3000",

  headers: {
    "Content-Type": "application/json",
    // Authorization: `Bearer ${accessToken}`,
  },
});

export default api;
