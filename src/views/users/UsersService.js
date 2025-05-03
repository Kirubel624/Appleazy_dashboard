// import api from '../../api/api';

class UsersService {
  createUser(data, api, name) {
    return api.post("/users?name=" + name, data).then((response) => {
      return response.data.data;
    });
  }

  updateUser(data, id, api) {
    return api.patch("/users/" + id, data).then((response) => {
      return response.data.data;
    });
  }

  updateAgendCode(id, api) {
    return api.patch("/users/assignAgentCode/" + id, {}).then((response) => {
      return response.data.data;
    });
  }
  searchUser({
    page,
    limit,
    searchText = null,
    sort = null,
    order,
    api,
    name,
  }) {
    let url = `/users?page=${page}&limit=${limit}&name=${name}`;
    if (sort) {
      const sortValue =
        order == "ascend" ? sort : order == "descend" ? "-" + sort : "";
      url = url + `&sort=${sortValue}`;
    }

    if (searchText) {
      url = url + `&searchText=${searchText}`;
    }

    return api.get(url).then((response) => {
      return { data: response.data.data, total: response.data.total };
    });
  }

  getUser(id, api) {
    return api.get("/users/" + id).then((response) => {
      return response.data;
    });
  }

  deleteUser(id, api) {
    return api.delete("/users/" + id).then((response) => {
      return response.data.data;
    });
  }

  usersDo({ method, payload, api }) {
    return api.post("/users/do", { method, payload }).then((response) => {
      return response.data.data;
    });
  }

  userDo({ method, payload, id, api }) {
    return api.post("/users/do/" + id, { method, payload }).then((response) => {
      return response.data.data;
    });
  }
}

export default new UsersService();
