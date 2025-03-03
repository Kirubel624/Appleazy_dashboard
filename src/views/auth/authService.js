// import TokenService from "./token.service";

import { api2 } from "../../api/api";

class AuthService {
  async login(email, password) {
    const response = await api2.post(
      "/user/login",
      {
        email,
        password,
      },
      {
        withCredentials: true,
      }
    );
    return response.data;
  }

  async register(username, email, password) {
    const response = await api2.post("/user/register", {
      username,
      email,
      password,
    });
    return response.data;
  }
  async logout() {
    const response = await api2.get("logout/");
    return response.data;
  }
  async getProfile(id) {
    console.log(id, ":id insied ethe service");
    const response = await api2.get(`/user/profile/${id}`);
    return response.data;
  }
  async updateProfile(id, data) {
    console.log(data, "data in service");
    const response = await api2.patch(`/user/update/${id}`, data);
    return response.data;
  }
  async checkPermmision(permmission, value, api) {
    const res = await api.get(
      `/users/check-permission/${permmission}/${value}`
    );
    return res.data?.data;
  }
  //   getCurrentUser() {
  //     return TokenService.getUser();
  //   }
  // async getNewRefreshToken() {
  //   const newAccessToken = useRefreshToken();
  // }
  //   async checkPermmision(permmission, value) {
  //     const res = await api2.get(`/auth/checkPermmission/${permmission}/${value}`);

  //     return res.data?.data;
  //   }
}

export default new AuthService();
